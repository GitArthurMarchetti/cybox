"use client"

import { doSocialLogin } from '@/app/services/login';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleSignInButton() {
    return (
        <form action={doSocialLogin}>
            <button
                type="submit"
                name="action"
                value="google"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#444] bg-[#2C2C2C] py-3 text-white transition-all hover:bg-[#3C3C3C]"
            >
                <FcGoogle className="text-xl" />
                <span>Continuar com Google</span>
            </button>
        </form>
    );
}