import  bcrypt  from 'bcryptjs';
import  CredentialsProvider  from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { getUsersByEmail } from './app/services/user';


export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    session: {
        strategy: 'jwt'
    },


    providers: [

        CredentialsProvider({
            name: "Credentials",    
            credentials: {}, 
            async authorize(credentials: Record<string, string> | undefined) {

                if (credentials === null) return null;

                try {

                    const user = await getUsersByEmail(credentials?.email as string)

                    if(user){
                              return {
                                id: user.id ? String(user.id) : "", // Converte id para string
                                name: user.nome,
                                email: user.email,
                            };
                    }else{
                        throw new Error("user não encontrado")
                    }

                } catch(error){
                    throw new Error(error as string)
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



});