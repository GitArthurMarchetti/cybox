"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdLock, MdPerson, MdArrowBack, MdCheck } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { saveUser } from "../../services/user";
import { UserType } from "@/lib/types/types";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface RegisterFormProps {
    user: UserType;
}

export default function RegisterForm({ user: novoUser }: RegisterFormProps) {
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
        } catch (err: unknown) {
            toast.error("Erro no cadastro", {
                description: (err as Error).message || "Verifique os dados e tente novamente.",
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
        if (password.length < 8) return { strength: 50, text: "Fraca", color: "bg-orange-500" };
        if (password.length < 12) return { strength: 75, text: "Boa", color: "bg-yellow-500" };
        return { strength: 100, text: "Forte", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <div className="bg-[#1F1F1F] rounded-3xl p-8 shadow-2xl border border-[#2c2c2c]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Criar sua conta</h2>
                    <p className="text-[#8c8888]">Preencha os dados para começar</p>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#b4b4b4]">Nome completo</label>
                        <div className="relative">
                            <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                            <input
                                type="text"
                                required
                                value={formData.nome}
                                onChange={(e) => handleInputChange('nome', e.target.value)}
                                className="w-full bg-[#2c2c2c] text-white pl-10 pr-4 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#F6CF45] focus:border-transparent transition-all duration-300"
                                placeholder="Seu nome completo"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#b4b4b4]">Email</label>
                        <div className="relative">
                            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
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
                                required
                                value={formData.senha}
                                onChange={(e) => handleInputChange('senha', e.target.value)}
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
                        
                        {formData.senha && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-[#8c8888]">Força da senha</span>
                                    <span className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                                <div className="w-full bg-[#2c2c2c] rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: `${passwordStrength.strength}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#b4b4b4]">Confirmar senha</label>
                        <div className="relative">
                            <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8888]" size={20} />
                            <input
                                type={isVisible2 ? "text" : "password"}
                                required
                                value={formData.confirmarSenha}
                                onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
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
                        
                        {formData.confirmarSenha && (
                            <div className="flex items-center gap-2 mt-2">
                                {formData.senha === formData.confirmarSenha ? (
                                    <>
                                        <MdCheck className="text-green-500" size={16} />
                                        <span className="text-xs text-green-500">Senhas coincidem</span>
                                    </>
                                ) : (
                                    <span className="text-xs text-red-500">Senhas não coincidem</span>
                                )}
                            </div>
                        )}
                    </div>

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

                <div className="text-center mt-8 pt-6 border-t border-[#2c2c2c]">
                    <p className="text-sm text-[#8c8888]">
                        Já tem uma conta?{' '}
                        <a href="/login" className="text-[#F6CF45] font-medium hover:underline">
                            Fazer login
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