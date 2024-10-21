import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { getUsersByEmail } from './app/services/user';
import db from './app/services/db';
import { sql } from 'drizzle-orm';

declare module 'next-auth' {
    interface Session {
        userId: string;  // Define o userId como string na sessão
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    session: {
        strategy: 'jwt'  // Usar JWT para gerenciar a sessão
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: Record<string, string> | undefined) {

                if (credentials === null) return null;

                try {
                    const user = await getUsersByEmail(credentials?.email as string);

                    const isMatch = await bcrypt.compare(credentials?.password as string, user?.senha as string); // Senha hasheada armazenada

                    if (!isMatch) {
                        throw new Error("Confira suas credenciais, a senha está incorreta.");
                    }

                    if (user) {
                        return {
                            id: String(user.id),  // Converte id para string
                            name: user.nome,
                            email: user.email,
                        };
                    } else {
                        throw new Error("Usuário não encontrado.");
                    }

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
            console.log("Account data:", account);  // Dados do Google
            console.log("User data:", user);        // Dados do usuário
            console.log("Token before:", token);    // Token antes da atualização

            // Se o login for via OAuth (como Google), use o sub (ID do Google) como identificador
            if (account && account.provider === 'google') {
                const googleId = profile?.sub;  // ID único do usuário no Google
                token.id = googleId;
                token.id_token = account.id_token;  // Armazena o id_token para chamadas à API do Google, se necessário

                if (!profile?.email) {
                    throw new Error('O e-mail do perfil do Google não está disponível.');
                }

                // Verifica se o usuário já existe no banco de dados
                let existingUser = await getUsersByEmail(profile.email);
                const placeholderPassword = await bcrypt.hash('GoogleOAuthPassword', 10);

                // Se o usuário não existir, crie um novo registro
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
                    // Se o usuário já existe, mantenha o id do banco de dados
                    token.id = existingUser.id;
                }
            }

            // Se o login for via credenciais locais
            if (user && !account?.provider) {
                token.id = user.id;  // Usa o id do usuário local
            }

            console.log("Token after:", token);  // Verifique o conteúdo do token após a atualização
            return token;
        },

        async session({ session, token }) {
            console.log("Token in session:", token);  // Verifica se o id_token ou id está presente no token

            session.user.id = token.id as string;  // Armazena o id do usuário dentro da sessão
            console.log("Session data:", session);  // Verifique o que está sendo passado para a sessão

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
    debug: true,  // Habilitar logs detalhados para o NextAuth
});
