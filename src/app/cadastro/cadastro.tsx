"use client"

import Image from "next/image";
import { RiArrowLeftSLine } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { saveUser } from "../services/user";
import { UserType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
    user: UserType;
};

export default function Cadastro({ user: novoUser }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [user, setUser] = useState<UserType>(novoUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await saveUser(formData);

            if (result?.success) {
                toast.success("Cadastro realizado com sucesso!", {
                    description: "Você será redirecionado para a página de login.",
                    duration: 3000,
                });

                // Pequeno atraso para mostrar o toast antes de redirecionar
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            }
        } catch (err: any) {
            toast.error("Erro no cadastro", {
                description: err.message || "Ocorreu um erro ao processar o cadastro.",
                duration: 5000,
            });
            console.error("Erro no cadastro:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#121212]">
            {/* Imagem de fundo */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/cadastroFundo.png"
                    alt="Imagem de fundo"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <main className="relative z-10 flex min-h-screen items-center justify-between px-6 md:px-8 lg:px-16 xl:px-24">

                <div className="hidden w-1/2 md:flex flex-col justify-between h-screen py-8">
                    <Image
                        src="/logo-completa-branca.png"
                        alt="Logo"
                        width={180}
                        height={60}
                        className="mb-20"
                    />
                    <h1 className="mt-24 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                        Pensando dentro <br />e fora da caixa.
                    </h1>
                </div>

                {/* Container principal */}
                {/* Card de cadastro */}
                <div className="w-5/12 rounded-xl  bg-[#111] p-8">
                    {/* Botão de voltar */}
                    <a href="/" className="mb-8 inline-flex items-center text-[#F6CF45]">
                        <RiArrowLeftSLine className="mr-1 text-xl" />
                        <span className="italic">voltar</span>
                    </a>

                    {/* Cabeçalho do formulário */}
                    <h2 className="mb-2 text-3xl font-bold text-white">Seja bem-vindo!</h2>
                    <p className="mb-8 text-sm text-[#B4B4B4]">
                        Pronto para controlar seu patrimônio? Realize seu cadastro aqui embaixo!
                    </p>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit}>
                        {/* Nome completo */}
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    className="w-full rounded-md bg-[#222] p-4 pb-3 pt-6 text-white outline-none focus:ring-1 focus:ring-[#F6CF45]"
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    placeholder=" "
                                    value={user.nome}
                                    onChange={(e) => setUser({ ...user, nome: e.target.value })}
                                    required
                                    autoComplete="off"
                                />
                                <label
                                    htmlFor="nome"
                                    className="absolute left-4 top-2 text-xs text-[#B4B4B4]"
                                >
                                    Nome completo:
                                </label>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    className="w-full rounded-md bg-[#222] p-4 pb-3 pt-6 text-white outline-none focus:ring-1 focus:ring-[#F6CF45]"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder=" "
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    required
                                    autoComplete="off"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-2 text-xs text-[#B4B4B4]"
                                >
                                    Email:
                                </label>
                            </div>
                        </div>

                        {/* Senhas em grid */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            {/* Senha */}
                            <div className="relative">
                                <div className="flex h-full items-center">
                                    <div className="relative flex-grow">
                                        <input
                                            className="w-full rounded-md bg-[#222] p-4 pb-3 pr-10 pt-6 text-white outline-none focus:ring-1 focus:ring-[#F6CF45]"
                                            type={isVisible ? "text" : "password"}
                                            name="senha"
                                            id="senha"
                                            placeholder=" "
                                            value={user.senha}
                                            onChange={(e) => setUser({ ...user, senha: e.target.value })}
                                            required
                                            autoComplete="new-password"
                                        />
                                        <label
                                            htmlFor="senha"
                                            className="absolute left-4 top-2 text-xs text-[#B4B4B4]"
                                        >
                                            Senha:
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsVisible(!isVisible)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4B4B4]"
                                        >
                                            {isVisible ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Confirmar senha */}
                            <div className="relative">
                                <div className="flex h-full items-center">
                                    <div className="relative flex-grow">
                                        <input
                                            className="w-full rounded-md bg-[#222] p-4 pb-3 pr-10 pt-6 text-white outline-none focus:ring-1 focus:ring-[#F6CF45]"
                                            type={isVisible2 ? "text" : "password"}
                                            name="confirmarSenha"
                                            id="confirmarSenha"
                                            placeholder=" "
                                            required
                                            autoComplete="new-password"
                                        />
                                        <label
                                            htmlFor="confirmarSenha"
                                            className="absolute left-4 top-2 text-xs text-[#B4B4B4]"
                                        >
                                            Confirmar senha:
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsVisible2(!isVisible2)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4B4B4]"
                                        >
                                            {isVisible2 ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botão de cadastro */}
                        <button
                            className="mt-4 w-full rounded-full bg-[#F6CF45] py-4 font-semibold text-black hover:bg-[#f5d05b]"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    {/* Divisor */}
                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-[#333]"></div>
                        <span className="mx-4 text-sm text-[#999]">ou</span>
                        <div className="flex-grow border-t border-[#333]"></div>
                    </div>

                    {/* Google Sign-In */}
                    <div className="mb-6">
                        <p className="mb-3 text-center text-sm text-[#B4B4B4]">Cadastre-se com Google:</p>
                        <form action="/app/services/login" method="post">
                            <button
                                type="submit"
                                name="action"
                                value="google"
                                className="flex w-full items-center justify-center rounded-full border border-[#F6CF45] bg-transparent py-3 text-[#F6CF45] transition-all hover:bg-[#F6CF45] hover:text-black"
                            >
                                <div className="flex items-center justify-center">
                                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                                        <FcGoogle size={18} />
                                    </div>
                                    <span>Continuar com Google</span>
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Link para Login */}
                    <div className="text-center">
                        <p className="text-sm text-[#B4B4B4]">
                            Já possui uma conta? <a href="/login" className="font-semibold text-white hover:underline">Faça login aqui.</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}