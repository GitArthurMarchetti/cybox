"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdArrowBack } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import { DoCredentialsLogin } from "../services/login";
import { toast } from "sonner";
import { motion } from "framer-motion";
import logo from "../../../public/logo-completa-branca.png";

export default function Login() {
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
        } catch (e: any) {
            toast.error("Erro ao fazer login", {
                description: e.message || "Tente novamente em alguns instantes.",
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] flex items-center justify-center p-4">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F6CF45]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#F6CF45]/5 rounded-full blur-2xl"></div>
            </div>

            <motion.div 
                className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Seção esquerda - Branding */}
                <motion.div 
                    className="hidden lg:flex flex-col justify-center space-y-8 px-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <Image className="w-40 -ml-3 -mb-4" src={logo} alt="logo cybox" />
                        </div>
                        
                        <h1 className="text-5xl font-bold leading-tight text-white">
                            Bem-vindo de volta!
                        </h1>
                        
                        <p className="text-xl text-[#b4b4b4] leading-relaxed">
                            Gerencie seus patrimônios de forma inteligente e eficiente. 
                            Controle total na palma da sua mão.
                        </p>
                        
                        <div className="flex space-x-4 pt-4">
                            <div className="flex items-center space-x-2 text-[#F6CF45]">
                                <div className="w-2 h-2 bg-[#F6CF45] rounded-full"></div>
                                <span className="text-sm">Gestão completa</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[#F6CF45]">
                                <div className="w-2 h-2 bg-[#F6CF45] rounded-full"></div>
                                <span className="text-sm">Relatórios detalhados</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Seção direita - Formulário */}
                <motion.div 
                    className="w-full max-w-md mx-auto"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="bg-[#1F1F1F] rounded-3xl p-8 shadow-2xl border border-[#2c2c2c]">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="lg:hidden flex items-center justify-center mb-6">
                                <Image className="w-40 -ml-3 -mb-4" src={logo} alt="logo cybox" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-2">Entrar na sua conta</h2>
                            <p className="text-[#8c8888]">Digite suas credenciais para acessar</p>
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/departamentos' })}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-all duration-300 mb-6"
                        >
                            <FcGoogle size={20} />
                            <span className="font-medium">Continuar com Google</span>
                        </button>

                        {/* Divisor */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-[#2c2c2c]"></div>
                            <span className="px-4 text-sm text-[#8c8888]">ou</span>
                            <div className="flex-1 h-px bg-[#2c2c2c]"></div>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {/* Email */}
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

                            {/* Senha */}
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

                            {/* Esqueceu senha */}
                            <div className="text-right">
                                <button type="button" className="text-sm text-[#F6CF45] hover:underline">
                                    Esqueceu a senha?
                                </button>
                            </div>

                            {/* Botão de login */}
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

                        {/* Link para cadastro */}
                        <div className="text-center mt-8 pt-6 border-t border-[#2c2c2c]">
                            <p className="text-sm text-[#8c8888]">
                                Não tem uma conta?{' '}
                                <a href="/cadastro" className="text-[#F6CF45] font-medium hover:underline">
                                    Criar conta
                                </a>
                            </p>
                        </div>

                        {/* Botão voltar */}
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
            </motion.div>
        </div>
    );
}