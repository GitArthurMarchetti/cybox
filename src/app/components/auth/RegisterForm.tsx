"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { destinoSeguro } from "@/lib/destino";
import { saveUser } from "../../services/user";
import { UserType } from "@/lib/types/types";
import { AuthHeading, DemoButton, Field, OrDivider } from "./AuthShell";

interface RegisterFormProps {
    user: UserType;
}

const STRENGTH = [
    { min: 0, label: "", color: "", width: 0 },
    { min: 1, label: "Too weak", color: "bg-red-500", width: 25 },
    { min: 6, label: "Weak", color: "bg-orange-500", width: 50 },
    { min: 8, label: "Good", color: "bg-yellow-500", width: 75 },
    { min: 12, label: "Strong", color: "bg-green-500", width: 100 },
];

export default function RegisterForm({ user: novoUser }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: novoUser.nome || '',
        email: novoUser.email || '',
        senha: '',
        confirmarSenha: ''
    });
    const router = useRouter();
    const callbackUrl = useSearchParams().get('callbackUrl');
    const destino = destinoSeguro(callbackUrl);

    const set = (field: keyof typeof formData, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    const validateForm = () => {
        if (!formData.nome.trim()) { toast.error("Add your name"); return false; }
        if (!formData.email.trim()) { toast.error("Add your email"); return false; }
        if (formData.senha.length < 8) { toast.error("Your password needs at least 8 characters"); return false; }
        if (formData.senha !== formData.confirmarSenha) { toast.error("Passwords don't match"); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = new FormData();
            payload.append('nome', formData.nome);
            payload.append('email', formData.email);
            payload.append('senha', formData.senha);
            payload.append('confirmarSenha', formData.confirmarSenha);

            const result = await saveUser(payload);

            if (result.success) {
                toast.success("Account created!", {
                    description: `We sent a link to ${formData.email}. You'll need to confirm it to accept invites.`,
                    duration: 8000,
                });

                const loginResult = await signIn('credentials', {
                    email: formData.email,
                    password: formData.senha,
                    redirect: false,
                });

                router.push(loginResult?.error ? '/login' : destino);
            } else {
                toast.error("Couldn't create your account", {
                    description: result.error || "Check your details and try again.",
                    duration: 5000,
                });
            }
        } catch {
            toast.error("Couldn't create your account", { description: "Check your details and try again.", duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    const strength = [...STRENGTH].reverse().find(s => formData.senha.length >= s.min) ?? STRENGTH[0];
    const matches = formData.confirmarSenha.length > 0 && formData.senha === formData.confirmarSenha;

    const eye = (visible: boolean, toggle: () => void) => (
        <button
            type="button"
            onClick={toggle}
            aria-label={visible ? "Hide password" : "Show password"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
            {visible ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
    );

    return (
        <div>
            <AuthHeading eyebrow="Sign up" title="Create your account" subtitle="Set up your first room in minutes." />

            <button
                onClick={() => signIn('google', { callbackUrl: destino })}
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white font-medium text-gray-800 transition-colors hover:bg-gray-100"
            >
                <FcGoogle size={20} aria-hidden />
                Continue with Google
            </button>

            <OrDivider label="or with email" />

            <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Full name" name="nome" required autoComplete="name" placeholder="Jane Cooper" icon={<FiUser aria-hidden />} value={formData.nome} onChange={e => set('nome', e.target.value)} />
                <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" icon={<FiMail aria-hidden />} value={formData.email} onChange={e => set('email', e.target.value)} />
                <Field
                    label="Password"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    icon={<FiLock aria-hidden />}
                    value={formData.senha}
                    onChange={e => set('senha', e.target.value)}
                    trailing={eye(showPassword, () => setShowPassword(v => !v))}
                    hint={formData.senha && (
                        <div className="mt-2 flex items-center gap-3">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                                <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.width}%` }} />
                            </div>
                            <span className="w-16 text-right font-mono text-[11px] text-white/45">{strength.label}</span>
                        </div>
                    )}
                />
                <Field
                    label="Confirm password"
                    name="confirmarSenha"
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Type it again"
                    icon={<FiLock aria-hidden />}
                    value={formData.confirmarSenha}
                    onChange={e => set('confirmarSenha', e.target.value)}
                    trailing={eye(showConfirm, () => setShowConfirm(v => !v))}
                    hint={formData.confirmarSenha && (
                        <p className={`mt-2 flex items-center gap-1.5 text-xs ${matches ? 'text-green-400' : 'text-red-400'}`}>
                            {matches ? <FiCheck aria-hidden /> : <FiX aria-hidden />} {matches ? "Passwords match" : "Passwords don't match"}
                        </p>
                    )}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-black shadow-[0_0_40px_-10px_rgba(246,207,69,0.8)] transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? (
                        <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Creating your account…</>
                    ) : (
                        <>Create account <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden /></>
                    )}
                </button>
                <p className="text-center text-xs leading-relaxed text-white/40">
                    By creating an account you agree to our{' '}
                    <a href="/terms" className="text-white/70 underline-offset-4 hover:text-primary hover:underline">Terms of Use</a> and{' '}
                    <a href="/privacy" className="text-white/70 underline-offset-4 hover:text-primary hover:underline">Privacy Policy</a>.
                </p>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
                Already have an account?{' '}
                <a href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(destino)}` : "/login"} className="font-medium text-primary hover:underline">
                    Log in
                </a>
            </p>

            <OrDivider label="not ready yet?" />
            <DemoButton />
        </div>
    );
}
