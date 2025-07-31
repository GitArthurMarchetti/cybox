"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdPerson, MdArrowBack, MdCheck } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { saveUser } from "../services/user";
import { UserType } from "@/lib/types/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../public/logo-completa-branca.png"

type Props = {
    user: UserType;
};

export default function Cadastro({ user: novoUser }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: novoUser.nome || '',
        email: novoUser.email || '',
        senha: '',
        confirmarSenha: ''
    });
    const router = useRouter();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        if (!formData.nome.trim()) {
            toast.error("Nome é obrigatório");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Email é obrigatório");
            return false;
        }

        if (formData.senha.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres");
            return false;
        }

        if (formData.senha !== formData.confirmarSenha) {
            toast.error("As senhas não coincidem");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nome', formData.nome);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('senha', formData.senha);
            formDataToSend.append('confirmarSenha', formData.confirmarSenha);

            const result = await saveUser(formDataToSend);

            if (result?.success) {
                toast.success("Cadastro realizado com sucesso!", {
                    description: "Redirecionando para departamentos...",
                    duration: 3000,
                });

                // Login automático
                const loginResult = await signIn('credentials', {
                    email: formData.email,
                    password: formData.senha,
                    redirect: false,
                });

                if (loginResult?.error) {
                    toast.error("Erro no login automático", {
                        description: "Cadastro realizado! Redirecionando para o login...",
                        duration: 3000,
                    });
                    setTimeout(() => {
                        router.push('/login');
                    }, 1000);
                } else {
                    setTimeout(() => {
                        router.push('/departamentos');
                    }, 1000);
                }
            }
        } catch (err: any) {
            toast.error("Erro no cadastro", {
                description: err.message || "Verifique os dados e tente novamente.",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.senha;
        if (password.length === 0) return { strength: 0, text: "", color: "" };
        if (password.length < 6) return { strength: 25, text: "Muito fraca", color: "bg-red-500" };
        if (password.length < 8) return { strength: 50, text: "Fraca", color: "bg-yellow-500" };
        if (password.length < 12) return { strength: 75, text: "Boa", color: "bg-blue-500" };
        return { strength: 100, text: "Forte", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] flex items-center justify-center p-4">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F6CF45]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#F6CF45]/5 rounded-full blur-2xl"></div>
            </div>

            <motion.div
                className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Seção direita - Branding */}
                <motion.div
                    className="hidden lg:flex flex-col justify-center space-y-8 px-8 order-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="">
                        <div className="flex items-center ">
                            <Image className="w-40 -ml-3 -mb-4" src={logo} alt="logo cybox" />

                        </div>
                        <div className="flex flex-col gap-2">

                            <h1 className="text-5xl font-bold leading-tight text-white">
                                Junte-se a nós!
                            </h1>

                            <p className="text-xl text-[#b4b4b4] leading-relaxed">
                                Crie sua conta e comece a gerenciar seus patrimônios de forma profissional e eficiente.
                            </p>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center space-x-3 text-[#F6CF45]">
                                    <MdCheck size={20} />
                                    <span>Gestão completa de patrimônios</span>
                                </div>
                                <div className="flex items-center space-x-3 text-[#F6CF45]">
                                    <MdCheck size={20} />
                                    <span>Relatórios detalhados e automáticos</span>
                                </div>
                                <div className="flex items-center space-x-3 text-[#F6CF45]">
                                    <MdCheck size={20} />
                                    <span>Controle de depreciação em tempo real</span>
                                </div>
                                <div className="flex items-center space-x-3 text-[#F6CF45]">
                                    <MdCheck size={20} />
                                    <span>Colaboração em equipe</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* Seção esquerda - Formulário */}
                <motion.div
                    className="w-full max-w-md mx-auto order-1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="bg-[#1F1F1F] rounded-3xl p-8 shadow-2xl border border-[#2c2c2c]">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                                <Image className="w-40 -ml-3 -mb-4" src={logo} alt="logo cybox" />

                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Criar sua conta</h2>
                            <p className="text-[#8c8888]">Preencha os dados para começar</p>
                        </div>

                        {/* Google Signup */}
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/departamentos' })}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-all duration-300 mb-6"
                        >
                            <FcGoogle size={20} />
                            <span className="font-medium">Cadastrar com Google</span>
                        </button>

                        {/* Divisor */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-[#2c2c2c]"></div>
                            <span className="px-4 text-sm text-[#8c8888]">ou</span>
                            <div className="flex-1 h-px bg-[#2c2c2c]"></div>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nome */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#b4b4b4]">Nome completo</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => handleInputChange('nome', e.target.value)}
                                        required
                                        autoComplete="name"
                                        className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent transition-all duration-300"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#b4b4b4]">Email</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
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
                                        value={formData.senha}
                                        onChange={(e) => handleInputChange('senha', e.target.value)}
                                        required
                                        autoComplete="new-password"
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

                                {/* Indicador de força da senha */}
                                {formData.senha && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-[#8c8888]">Força da senha:</span>
                                            <span className={`text-xs font-medium ${passwordStrength.strength >= 75 ? 'text-green-400' :
                                                passwordStrength.strength >= 50 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                {passwordStrength.text}
                                            </span>
                                        </div>
                                        <div className="w-full bg-[#3c3c3c] rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#b4b4b4]">Confirmar senha</label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                                    <input
                                        type={isVisible2 ? "text" : "password"}
                                        value={formData.confirmarSenha}
                                        onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="w-full bg-[#2c2c2c] text-white pl-10 pr-12 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent transition-all duration-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsVisible2(!isVisible2)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c8888] hover:text-white transition-colors"
                                    >
                                        {isVisible2 ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                                    </button>
                                </div>

                                {/* Indicador de confirmação */}
                                {formData.confirmarSenha && (
                                    <div className="flex items-center space-x-2">
                                        {formData.senha === formData.confirmarSenha ? (
                                            <>
                                                <MdCheck className="text-green-400" size={16} />
                                                <span className="text-xs text-green-400">Senhas coincidem</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-4 h-4 border-2 border-red-400 rounded-full flex items-center justify-center">
                                                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                                </div>
                                                <span className="text-xs text-red-400">Senhas não coincidem</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Botão de cadastro */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#F6CF45] text-black font-semibold py-3 px-4 rounded-xl hover:bg-[#F6CF45]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                                        Criando conta...
                                    </>
                                ) : (
                                    'Criar conta'
                                )}
                            </button>
                        </form>

                        {/* Link para login */}
                        <div className="text-center mt-8 pt-6 border-t border-[#2c2c2c]">
                            <p className="text-sm text-[#8c8888]">
                                Já tem uma conta?{' '}
                                <a href="/login" className="text-[#F6CF45] font-medium hover:underline">
                                    Fazer login
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