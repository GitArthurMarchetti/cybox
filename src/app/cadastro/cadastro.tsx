'use client'

import Image from "next/image";

//icones
import { RiArrowLeftSLine } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import UserType, { saveUser } from "../services/user";
import GoogleSingInButton from "../components/Button/buttonSignInGoogle";


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
            <main className="flex w-[95%]  items-center m-auto z-10    min-h-screen relative ">
                <div className="flex flex-col h-[85vh] 2xl:h-[100vh]  w-1/2 justify-start items-start  ">

                    <Image

                        src="/logo-completa-branca.png"
                        alt="Logo"
                        width={144}
                        height={144}
                        className="object-contain absolute -top-6"
                    />

                    <div className="absolute bottom-5">
                        <h1 className="text-5xl 2xl:text-6xl font-bold w-[530px]">Pensando dentro e fora da caixa.</h1>
                    </div>
                </div>
                <div className="w-[40%]  m-auto my-4 2xl:my-0   bg-[#0F0F0F] flex flex-col pb-8   rounded-[25px] text-white" >
                    <div className="flex items-center  2xl:p-5 p-3 text-left cursor-pointer text-[#F6CF45]">
                        <RiArrowLeftSLine className="text-xl 2xl:text-3xl" />
                        <a href="/" className="text-md 2xl:text-xl italic">voltar</a>
                    </div>
                    <div className="m-auto mb-3 2xl:mb:18 mt-2  w-4/5">
                        <h2 className="cursor-default text-2xl 2xl:text-3xl">Seja bem-vindo!</h2>
                        <p className="cursor-default text-[#B4B4B4] text-sm">Pronto para controlar seu patrimônio? Realize seu cadastro aqui embaixo! </p>
                    </div>
                    <form action={saveUser} className="w-4/5 m-auto flex flex-col ">
                        <label className="bg-[#2C2C2C] text-md 2xl:text-lg flex flex-col  gap-1 p-1.5 2xl:p-2 px-4 my-2 2xl:my-4 rounded-lg text-[#B4B4B4]" >
                            Nome:
                            <input className="w-11/12 2xl:px-2 bg-transparent border-0 outline-none text-white"
                                type="text"
                                name="nome"
                                value={user.nome}
                                onChange={(e) => setUser({ ...user, nome: e.target.value })}
                            />
                        </label>
                        <label className="bg-[#2C2C2C] text-md 2xl:text-lg flex flex-col  gap-1 p-1.5 2xl:p-2 px-4 my-2 2xl:my-4 rounded-lg text-[#B4B4B4]" >
                            Email:
                            <input className="w-11/12 2xl:px-2 bg-transparent border-0 outline-none text-white"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                        </label>
                        <div className="flex gap-2">
                            <label className="bg-[#2C2C2C]  text-md 2xl:text-lg flex flex-row items-center p-1.5 2xl:p-2 px-4 my-2 2xl:my-4  rounded-lg text-[#B4B4B4]" >
                                <div className="flex w-full flex-col gap-1">
                                    Senha:
                                    <input className="w-11/12 2xl:px-2 bg-transparent border-0 outline-none text-white"
                                        type={isVisible ? "text" : "password"}
                                        name="senha"
                                        value={user.senha}
                                        onChange={(e) => setUser({ ...user, senha: e.target.value })}
                                    />
                                </div>
                                {isVisible ? <IoMdEye className="text-2xl 2xl:4xl" onClick={() => setIsVisible(false)} /> : <IoMdEyeOff className="text-2xl 2xl:4xl" onClick={() => setIsVisible(true)} />}
                            </label>
                            <label className="bg-[#2C2C2C]  text-md 2xl:text-lg flex flex-row items-center p-1.5 2xl:p-2 px-4 my-2 2xl:my-4  rounded-lg text-[#B4B4B4]" >
                                <div className="flex w-full flex-col gap-1">
                                    Confirmar senha:
                                    <input className="w-11/12 2xl:px-2 bg-transparent border-0 outline-none text-white" type={isVisible2 ? "text" : "password"} name="confirmarSenha" />
                                </div>
                                {isVisible2 ? <IoMdEye className="text-2xl 2xl:4xl" onClick={() => setIsVisible2(false)} /> : <IoMdEyeOff className="text-2xl 2xl:4xl" onClick={() => setIsVisible2(true)} />}
                            </label>
                        </div>
                        <p className="text-right w-full  text-[#B4B4B4] underline italic text-sm 2xl:text-md">Esqueceu a senha?</p>
                        <div className="w-4/5 m-auto flex mt-4 flex-col items-center gap-3">
                            <button type="submit" className="bg-[#F6CF45] text-black w-5/12 mx-auto rounded-full 2xl:h-14 2xl:py-0 p-2 text-md font-semibold " onClick={() => setUser({ ...user })}>Entrar</button>
                            <p>ou</p>
                        </div>
                    </form>
                    
                    <GoogleSingInButton />
                    <div className="text-center italic text-[#B4B4B4] mt-4 2xl:text-xl text-md ">
                        <a href="/login" className="font-semibold not-italic">Ja possui uma conta? <span className="font-extralight underline">Faça login aqui.</span> </a>
                    </div>
                </div>
            </main>

        </>
    )
}
