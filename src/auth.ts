import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { CredentialsSignin } from 'next-auth';
import { authConfig } from './auth.config';
import {
    estaBloqueado,
    findUserByEmail,
    findUserByGoogleId,
    registrarFalhaLogin,
    registrarLoginComSucesso,
    resolverUsuarioGoogle
} from './lib/users';

class ContaBloqueada extends CredentialsSignin {
    code = 'conta_bloqueada';
}

class ContaInativa extends CredentialsSignin {
    code = 'conta_inativa';
}

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    ...authConfig,

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: Record<string, string> | undefined) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) return null;

                const user = await findUserByEmail(email);

                if (!user?.id || !user.senha) return null;

                if (await estaBloqueado(user.id)) {
                    throw new ContaBloqueada();
                }

                const isMatch = await bcrypt.compare(password, user.senha);

                if (!isMatch) {
                    await registrarFalhaLogin(user.id);
                    return null;
                }

                if (user.status !== 'ativo') {
                    throw new ContaInativa();
                }

                await registrarLoginComSucesso(user.id);

                return {
                    id: String(user.id),
                    name: user.nome,
                    email: user.email,
                };
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                },
            },
        }),
    ],

    callbacks: {
        ...authConfig.callbacks,

        async signIn({ account, profile }) {
            if (account?.provider !== 'google') return true;

            if (!profile?.sub || !profile.email || profile.email_verified !== true) {
                return false;
            }

            const user = await resolverUsuarioGoogle({
                sub: profile.sub,
                email: profile.email,
                nome: profile.name || profile.email,
            });

            if (!user?.id) return false;

            await registrarLoginComSucesso(user.id);
            return true;
        },

        async jwt({ token, user, account, profile }) {
            if (account) {
                token.emitidoEm = Math.floor(Date.now() / 1000);
            }

            if (account?.provider === 'google' && profile?.sub) {
                const googleUser = await findUserByGoogleId(profile.sub);
                token.id = googleUser?.id;
                token.provider = 'google';
            }

            if (account?.provider === 'credentials') {
                token.id = user?.id;
                token.provider = 'credentials';
            }

            return token;
        },
    },

    debug: process.env.NODE_ENV === 'development',
});
