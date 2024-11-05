import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { getUsersByEmail } from './app/services/user';
import db from './app/services/db';
import { sql } from 'drizzle-orm';

declare module 'next-auth' {
    interface Session {
        userId: string;
        provider: string;  // Define o provider na sessão
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    session: {
        strategy: 'jwt',  // Usar JWT para gerenciar a sessão
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
            console.log("Account data:", account);
            console.log("User data:", user);
            console.log("Token before:", token);

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
                        console.log("Creating new Google user in the database...");
                        const result = await db.execute(sql`
                            INSERT INTO next_auth.users (nome, email, senha, google_id)
                            VALUES (${profile.name}, ${profile.email}, ${placeholderPassword}, ${googleId})
                            RETURNING id
                        `);

                        const newUser = result[0];
                        if (newUser) {
                            token.id = newUser.id;
                        }
                    } else {
                        token.id = existingUser.id;
                    }
                }

                if (account.provider === 'credentials') {
                    token.id = user?.id;  // Usa o id do usuário do CredentialsProvider
                    token.provider = 'credentials';
                }
            }

            console.log("Token after:", token);
            return token;
        },

        async session({ session, token }) {
            console.log("Token in session:", token);

            session.user.id = token.id as string;
            session.provider = token.provider as string;  // Armazena o provedor na sessão

            console.log("Session data:", session);
            return session;
        },
    },


    secret: process.env.AUTH_SECRET,
    debug: true,
});
