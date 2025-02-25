import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { getUsersByEmail } from './app/services/user';
import { query } from './lib/mysql';
import { v4 as uuidv4 } from 'uuid';

declare module 'next-auth' {
    interface Session {
        userId: string;
        provider: string;
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    session: {
        strategy: 'jwt',
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: Record<string, string> | undefined) {
                if (!credentials) return null;

                try {
                    const user = await getUsersByEmail(credentials?.email as string);

                    if (!user) {
                        throw new Error("Usuário não encontrado.");
                    }

                    const isMatch = await bcrypt.compare(credentials?.password as string, user.senha as string);

                    if (!isMatch) {
                        throw new Error("Credenciais incorretas.");
                    }

                    return {
                        id: String(user.id),
                        name: user.nome,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Erro na autenticação:", error);
                    throw new Error(error as string);
                }
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    code_challenge_method: "S256",
                },
            },
            checks: ["pkce"],
        }),
    ],

    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account) {
                if (account.provider === 'google') {
                    const googleId = profile?.sub;
                    token.id = googleId;
                    token.provider = 'google';
                    token.id_token = account.id_token;

                    if (!profile?.email) {
                        throw new Error('O e-mail do perfil do Google não está disponível.');
                    }

                    let existingUser = await getUsersByEmail(profile.email);
                    const placeholderPassword = await bcrypt.hash('GoogleOAuthPassword', 10);

                    if (!existingUser) {
                        // Criar novo usuário se não existir
                        const userId = uuidv4(); // Gerar um UUID para o novo usuário
                        await query(
                            `INSERT INTO users (id, nome, email, senha, google_id)
                             VALUES (?, ?, ?, ?, ?)`,
                            [userId, profile.name, profile.email, placeholderPassword, googleId]
                        );
                        token.id = userId;
                    } else {
                        token.id = existingUser.id;

                        // Atualizar googleId se necessário
                        if (!existingUser.google_id) {
                            await query(
                                `UPDATE users SET google_id = ? WHERE id = ?`,
                                [googleId, existingUser.id]
                            );
                        }
                    }
                }

                if (account.provider === 'credentials') {
                    token.id = user?.id;
                    token.provider = 'credentials';
                }
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            session.provider = token.provider as string;

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
});