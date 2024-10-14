import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';


export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut
} = NextAuth({
    providers: [

        GoogleProvider({

            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

            authorization:{
                params:{
                    prompt:"consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            
        }),

    ],



});