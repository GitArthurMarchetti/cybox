"use client"

import Image from "next/image";

//icones
import { RiArrowLeftSLine } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { saveUser } from "../services/user";
import GoogleSingInButton from "../components/Button/buttonSignInGoogle";
import { UserType } from "@/lib/types/types";

type Props = {
    user: UserType;
};

export default function Cadastro({ user: novoUser }: Props) {
    const [isVisible, setIsVisible] = useState(false)
    const [isVisible2, setIsVisible2] = useState(false)

    const [user, setUser] = useState<UserType>(novoUser)

    return (
        <>
            <Image
                src="/cadastroFundo.png"
                alt="Imagem de fundo"
                fill
                className="object-cover"
                priority
            />
            <main className="flex justify-between w-[95%] xl:w-[90%] md:w-full items-center m-auto z-10 min-h-screen max-h-screen relative">
                <div className="flex flex-col  2xl:h-[70vh] xl:h-[70vh] md:h-[70vh] w-1/2 justify-start items-start ">
                    <Image
                        src="/logo-completa-branca.png"
                        alt="Logo"
                        width={144}
                        height={144}
                        className="object-contain absolute 2xl:top-1 -top-6"
                    />
                    <div className="absolute 2xl:bottom-10 bottom-5">
                        <h1 className="text-5xl 2xl:text-7xl xl:text-5xl md:text-4xl font-bold 2xl:w-[600px] xl:w-[400px] md:w-full ">
                            Pensando dentro e fora da caixa.
                        </h1>
                    </div>
                </div>

                <div className="w-[35%] xl:w-[40%] md:w-[90%] bg-[#0F0F0F] flex flex-col 2xl:pb-8 p-2 py-2 2xl:py-8 px-6 rounded-[25px] text-white min-h-[90vh]">
                    <div className="flex items-center  py-3 text-left cursor-pointer  text-[#F6CF45]">
                        <RiArrowLeftSLine className="text-xl 2xl:text-2xl md:text-lg" />
                        <a href="/" className="text-md 2xl:text-xl md:text-sm italic">voltar</a>
                    </div>
                    <div className="m-auto mb-1 2xl:mb-18 w-full">
                        <h2 className="cursor-default text-2xl 2xl:text-4xl xl:text-2xl md:text-xl">Seja bem-vindo!</h2>
                        <p className="cursor-default text-[#B4B4B4] 2xl:text-lg text-sm md:text-xs">Pronto para controlar seu patrimônio? Realize seu cadastro aqui embaixo! </p>
                    </div>
                    <form action={saveUser} className="w-full m-auto flex flex-col">
                        <label className="bg-[#2C2C2C] text-md 2xl:text-2xl md:text-sm flex flex-col gap-1 py-2 2xl:px-4 px-4 my-1.5 2xl:my-4 rounded-lg text-[#B4B4B4]">
                            Nome:
                            <input className="w-full bg-transparent border-0 outline-none text-white"
                                type="text"
                                name="nome"
                                value={user.nome}
                                onChange={(e) => setUser({ ...user, nome: e.target.value })}
                            />
                        </label>
                        <label className="bg-[#2C2C2C] text-md 2xl:text-2xl md:text-sm flex flex-col gap-1 py-2 2xl:px-4 px-4 my-1.5 2xl:my-4 rounded-lg text-[#B4B4B4]">
                            Email:
                            <input className="w-full bg-transparent border-0 outline-none text-white"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                        </label>
                        <div className="flex gap-2">
                            <label className="bg-[#2C2C2C] text-md 2xl:text-2xl md:text-sm flex flex-row items-center py-2 2xl:px-4 px-4 my-1.5 2xl:my-4 rounded-lg text-[#B4B4B4]">
                                <div className="flex w-full flex-col gap-1">
                                    Senha:
                                    <input className="w-full bg-transparent border-0 outline-none text-white"
                                        type={isVisible ? "text" : "password"}
                                        name="senha"
                                        value={user.senha}
                                        onChange={(e) => setUser({ ...user, senha: e.target.value })}
                                    />
                                </div>
                                {isVisible ? <IoMdEye className="text-2xl 2xl:text-4xl" onClick={() => setIsVisible(false)} /> : <IoMdEyeOff className="text-2xl 2xl:text-4xl" onClick={() => setIsVisible(true)} />}
                            </label>
                            <label className="bg-[#2C2C2C] text-md 2xl:text-2xl md:text-sm flex flex-row items-center py-2 2xl:px-4 px-4 my-1.5 2xl:my-4 rounded-lg text-[#B4B4B4]">
                                <div className="flex w-full flex-col gap-1">
                                    Confirmar senha:
                                    <input className="w-full bg-transparent border-0 outline-none text-white" type={isVisible2 ? "text" : "password"} name="confirmarSenha" />
                                </div>
                                {isVisible2 ? <IoMdEye className="text-2xl 2xl:text-4xl" onClick={() => setIsVisible2(false)} /> : <IoMdEyeOff className="text-2xl 2xl:text-4xl" onClick={() => setIsVisible2(true)} />}
                            </label>
                        </div>
                        <div className="w-full m-auto flex mt-1 flex-col items-center gap-3 py-2">
                            <button type="submit" className="bg-[#F6CF45] text-black w-full rounded-full 2xl:h-16 2xl:text-2xl p-2 text-md font-semibold">Entrar</button>
                        </div>
                    </form>
                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <p className="2xl:text-lg">ou</p>
                        <div className="w-full">
                            <GoogleSingInButton />
                        </div>
                    </div>

                    <div className="text-center italic text-[#B4B4B4] mt-4 2xl:text-2xl text-md md:text-sm">
                        <a href="/login" className="font-semibold not-italic">Ja possui uma conta? <span className="font-extralight underline">Faça login aqui.</span> </a>
                    </div>
                </div>
            </main>
        </>
    );
}
