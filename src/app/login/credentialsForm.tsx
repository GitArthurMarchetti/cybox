"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"



export default function CredentialsForm()
 {
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    

    return (
        <form className="w-4/5 m-auto flex flex-col">
            {error && (
                <span className="p-4 mb-4 text-lg font-semibold text-white bg-red-500">
                    {error}
                </span>
            )}
            <label className="bg-[#2C2C2C] text-lg flex flex-col gap-1 p-2 px-4 my-4 rounded-lg text-[#B4B4B4]">
                Email:
                <input className="w-11/12 px-2 bg-transparent border-0 outline-none text-white" type="email" name="email" />
            </label>
            <label className="bg-[#2C2C2C] text-lg flex flex-row items-center p-2 px-4 my-4 rounded-lg text-[#B4B4B4]">
                <div className="flex w-full flex-col gap-1">
                    Senha:
                    <input className="w-11/12 px-2 bg-transparent border-0 outline-none text-white" type={isVisible ? "text" : "password"} name="senha" />
                </div>
                {isVisible ? <IoMdEye size={30}/> : <IoMdEyeOff size={30} onClick={() => setIsVisible(true)} />}
            </label>
            <div className="w-4/5 m-auto flex mt-11">
                <button className="bg-[#F6CF45] text-black w-1/2 mx-auto rounded-full h-14 text-xl font-semibold" type="submit">Entrar</button>
            </div>
        </form>
    );
}