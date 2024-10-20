import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { getUsersByEmail } from './app/services/user';
import { Session } from 'next-auth';

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
                },
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            console.log("Account data:", account);  // Verifique se o account tem id_token ou sub
            console.log("User data:", user);        // Verifique se o user contém o id
            console.log("Token before:", token);
    
            // Persistir o OAuth id_token ou sub no token logo após o login
            if (account) {
                token.id_token = account.id_token || account.sub;  // Usa id_token ou sub, dependendo do provedor
            }
    
            // Se estiver usando credenciais locais, o id vem do user
            if (user) {
                token.id = user.id;  // Salva o id do usuário no token JWT
            }
    
            console.log("Token after:", token);  // Verifique o conteúdo do token após a atualização
            return token;
        },
    
        async session({ session, token }) {
            console.log("Token in session:", token);  // Verifica se o id_token ou id está presente no token
    
            // Garantir que estamos lidando com strings
            const userId = (token.id_token || token.id) as string;
    
            // Armazenar o userId dentro de session.user
            session.user.id = userId;  // Armazena o id dentro de session.user, que é o local correto para dados do usuário
            console.log("Session data:", session);  // Verifique o que está sendo passado para a sessão
    
            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
    debug: true,  // Habilitar logs detalhados para o NextAuth
});
