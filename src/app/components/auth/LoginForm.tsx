"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdArrowBack } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";
import { DoCredentialsLogin } from "../../services/login";
import { toast } from "sonner";

export default function LoginForm() {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const response = await DoCredentialsLogin(formData);

            if (response?.error) {
                toast.error("Credenciais inválidas", {
                    description: "Verifique seu email e senha e tente novamente.",
                    duration: 4000,
                });
            } else {
                toast.success("Login realizado com sucesso!", {
                    description: "Redirecionando para seus departamentos...",
                    duration: 2000,
                });

                setTimeout(() => {
                    router.push('/departamentos');
                }, 500);
            }
        } catch (e: unknown) {
            toast.error("Erro ao fazer login", {
                description: (e as Error).message || "Tente novamente em alguns instantes.",
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <div className="bg-[#1F1F1F] rounded-3xl p-8 shadow-2xl border border-[#2c2c2c]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Entrar na sua conta</h2>
                    <p className="text-[#8c8888]">Digite suas credenciais para acessar</p>
                </div>

                <button
                    onClick={() => signIn('google', { callbackUrl: '/departamentos' })}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-all duration-300 mb-6"
                >
                    <FcGoogle size={20} />
                    <span className="font-medium">Continuar com Google</span>
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-[#2c2c2c]"></div>
                    <span className="px-4 text-sm text-[#8c8888]">ou</span>
                    <div className="flex-1 h-px bg-[#2c2c2c]"></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#b4b4b4]">Email</label>
                        <div className="relative">
                            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent transition-all duration-300"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#b4b4b4]">Senha</label>
                        <div className="relative">
                            <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                            <input
                                type={isVisible ? "text" : "password"}
                                name="password"
                                required
                                autoComplete="current-password"
                                className="w-full bg-[#2c2c2c] text-white pl-10 pr-12 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setIsVisible(!isVisible)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c8888] hover:text-white transition-colors"
                            >
                                {isVisible ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <button type="button" className="text-sm text-[#F6CF45] hover:underline">
                            Esqueceu a senha?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#F6CF45] text-black font-semibold py-3 px-4 rounded-xl hover:bg-[#F6CF45]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                                Entrando...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-[#2c2c2c]">
                    <p className="text-sm text-[#8c8888]">
                        Não tem uma conta?{' '}
                        <a href="/cadastro" className="text-[#F6CF45] font-medium hover:underline">
                            Criar conta
                        </a>
                    </p>
                </div>

                <div className="text-center mt-4">
                    <a 
                        href="/" 
                        className="inline-flex items-center gap-2 text-sm text-[#8c8888] hover:text-white transition-colors"
                    >
                        <MdArrowBack size={16} />
                        Voltar ao início
                    </a>
                </div>
            </div>
        </motion.div>
    );
}