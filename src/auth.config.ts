import type { NextAuthConfig } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        userId: string;
        provider: string;
        emitidaEm?: number;
    }
}

const ROTAS_PUBLICAS = ['/', '/login', '/cadastro', '/esqueci-senha'];
const PREFIXOS_PUBLICOS = ['/convite/', '/verificar-email/', '/redefinir-senha/'];

export function rotaPublica(pathname: string): boolean {
    return ROTAS_PUBLICAS.includes(pathname) || PREFIXOS_PUBLICOS.some(prefixo => pathname.startsWith(prefixo));
}

export const authConfig = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    providers: [],

    callbacks: {
        authorized({ auth, request }) {
            return rotaPublica(request.nextUrl.pathname) || !!auth?.user;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            session.provider = token.provider as string;
            session.emitidaEm = token.emitidoEm as number | undefined;

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
    trustHost: true,
} satisfies NextAuthConfig;
