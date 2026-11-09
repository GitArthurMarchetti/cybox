import type { NextAuthConfig } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        userId: string;
        provider: string;
        emitidaEm?: number;
    }
}

// The signed-in area of the app. Everything else (landing, auth screens, invites,
// legal pages and unknown URLs, which get the 404 page) is public. Pages inside the
// private area also check the session themselves, and every service checks access.
const PREFIXOS_PRIVADOS = ['/departamentos'];

export function rotaPublica(pathname: string): boolean {
    return !PREFIXOS_PRIVADOS.some(prefixo => pathname === prefixo || pathname.startsWith(prefixo + '/'));
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
