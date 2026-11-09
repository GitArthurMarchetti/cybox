"use client"

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { DoCredentialsLogin } from "../../services/login";
import { destinoSeguro } from "@/lib/destino";
import { toast } from "sonner";
import { AuthHeading, DemoButton, Field, OrDivider } from "./AuthShell";

const LOGIN_ERRORS: Record<string, { title: string; description: string }> = {
    credentials: {
        title: "Wrong email or password",
        description: "Check your details and try again.",
    },
    conta_bloqueada: {
        title: "Too many attempts",
        description: "For your security, sign-in is locked for 15 minutes.",
    },
    conta_inativa: {
        title: "Account disabled",
        description: "Contact support to reactivate your account.",
    },
    AccessDenied: {
        title: "Couldn't sign in with Google",
        description: "Make sure the email on your Google account is verified.",
    },
};

const GENERIC_ERROR = { title: "Couldn't sign in", description: "Please try again in a moment." };

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlError = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl');
    const destino = destinoSeguro(callbackUrl);

    useEffect(() => {
        if (!urlError) return;
        const message = LOGIN_ERRORS[urlError] ?? GENERIC_ERROR;
        toast.error(message.title, { description: message.description, duration: 5000 });
    }, [urlError]);

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await DoCredentialsLogin(new FormData(event.currentTarget));

            if (response.error) {
                const message = LOGIN_ERRORS[response.error] ?? GENERIC_ERROR;
                toast.error(message.title, { description: message.description, duration: 4000 });
            } else {
                toast.success("Welcome back!", { description: "Taking you to your rooms…", duration: 2000 });
                setTimeout(() => router.push(destino), 400);
            }
        } catch {
            toast.error(GENERIC_ERROR.title, { description: GENERIC_ERROR.description, duration: 4000 });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <AuthHeading eyebrow="Log in" title="Welcome back" subtitle="Pick up right where you left your assets." />

            <button
                onClick={() => signIn('google', { callbackUrl: destino })}
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white font-medium text-gray-800 transition-colors hover:bg-gray-100"
            >
                <FcGoogle size={20} aria-hidden />
                Continue with Google
            </button>

            <OrDivider label="or with email" />

            <form onSubmit={handleFormSubmit} className="space-y-5">
                <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" icon={<FiMail aria-hidden />} />
                <Field
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    icon={<FiLock aria-hidden />}
                    trailing={
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                        </button>
                    }
                />

                <div className="flex justify-end">
                    <Link href="/esqueci-senha" className="text-sm text-primary/90 hover:text-primary hover:underline">
                        Forgot your password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-black shadow-[0_0_40px_-10px_rgba(246,207,69,0.8)] transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Logging in…
                        </>
                    ) : (
                        <>
                            Log in <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
                New to Cybox?{' '}
                <a href={callbackUrl ? `/cadastro?callbackUrl=${encodeURIComponent(destino)}` : "/cadastro"} className="font-medium text-primary hover:underline">
                    Create an account
                </a>
            </p>

            <OrDivider label="just looking?" />
            <DemoButton />
        </div>
    );
}
