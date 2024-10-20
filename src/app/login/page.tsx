"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Image from "next/image";

//icones
import { RiArrowLeftSLine } from "react-icons/ri";
import GoogleSingInButton from "../components/Button/buttonSignInGoogle";
import { getUsers } from "../services/user";
import { DoCredentialsLogin } from "../services/login";

export default function Login() {
     const usuarios = getUsers();
     console.log("USUARIOS: ", usuarios);
     const [isVisible, setIsVisible] = useState(false);
     const router = useRouter();
     const [error, setError] = useState<string | null>(null);

     async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
          event.preventDefault();

          try {
               const formData = new FormData(event.currentTarget);

               const response = await DoCredentialsLogin(formData);

               if (response?.error) {
                    console.error('Erro ao fazer login:', response.error);
               } else {
                    router.push('/departamentos');
               }
          } catch (e) {
               console.error(e);
          }
     }

     return (
          <>
               <Image src="/loginFundo.png" alt="Imagem de fundo" layout="fill" objectFit="cover" className="w-full h-[100vh] absolute z-0" />
               <main className="flex justify-between w-[95%] xl:w-[90%] md:w-full items-center m-auto z-10 min-h-screen max-h-screen relative">
                    <div className="flex flex-col  2xl:h-[70vh] xl:h-[70vh] md:h-[70vh] w-1/2 justify-start items-start ">
                         <Image
                              src="/logo-completa-branca.png"
                              alt="Logo"
                              width={144}
                              height={144}
                              className="object-contain absolute 2xl:top-8 -top-6"
                         />
                         <div className="absolute 2xl:bottom-16 bottom-5">
                              <h1 className="text-5xl 2xl:text-7xl xl:text-5xl md:text-4xl font-bold 2xl:w-[600px] xl:w-[400px] md:w-full ">
                                   Pensando dentro e fora da caixa.
                              </h1>
                         </div>
                    </div>
                    <div className="w-[35%] xl:w-[40%] md:w-[90%] bg-[#0F0F0F] flex flex-col 2xl:py-8 p-4 2xl:px-6 py-6 rounded-[25px] text-white min-h-[70vh] justify-between">
                         <div className="flex items-center  py-3 text-left cursor-pointer  text-[#F6CF45]">
                              <RiArrowLeftSLine className="text-xl 2xl:text-2xl md:text-lg" />
                              <a href="/" className="text-md 2xl:text-xl md:text-sm italic">voltar</a>
                         </div>
                         <div className="m-auto mb-4 2xl:mb-10 w-full">
                              <h2 className="cursor-default text-2xl 2xl:text-4xl xl:text-2xl md:text-xl">Bom te ver de volta!</h2>
                              <p className="cursor-default text-[#B4B4B4] 2xl:text-lg text-sm md:text-xs">
                                   Olá! Seu retorno é sempre bem-vindo! Pronto para mais uma sessão produtiva?
                              </p>
                         </div>
                         <div className="flex flex-col gap-2 w-4/5 md:w-full m-auto">
                              <form className="w-full flex flex-col gap-2" onSubmit={handleFormSubmit}>
                                   {error && (
                                        <span className="p-4 mb-4 text-lg font-semibold text-white bg-red-500">
                                             {error}
                                        </span>
                                   )}
                                   <label className="mb-2 bg-[#2C2C2C] text-md 2xl:text-2xl md:text-sm flex flex-col gap-1  2xl:p-2 px-3 2xl:px-4  rounded-lg text-[#B4B4B4]">
                                        Email:
                                        <input className="w-full bg-transparent border-0 outline-none text-white" type="email" name="email" id="email" required />
                                   </label>
                                   <label className="mb-2 bg-[#2C2C2C] text-md 2xl:text-2xl md:text-sm flex flex-row items-center gap-1  2xl:p-2 px-3 2xl:px-4 rounded-lg text-[#B4B4B4]">
                                        <div className="flex w-full flex-col gap-1">
                                             Senha:
                                             <input className="w-full bg-transparent border-0 outline-none text-white" type={isVisible ? "text" : "password"} name="password" id="password" />
                                        </div>
                                        {isVisible ? <IoMdEye className="text-2xl 2xl:text-3xl" onClick={() => setIsVisible(false)} /> : <IoMdEyeOff className="text-2xl 2xl:text-3xl" onClick={() => setIsVisible(true)} />}
                                   </label>
                                   <div className="w-full m-auto flex mt-2 items-center justify-between">
                                        <button className="bg-[#F6CF45] text-black w-full rounded-full 2xl:py-4 py-2 text-md 2xl:text-2xl font-semibold" type="submit">Entrar</button>
                                   </div>
                              </form>
                              <div className="flex flex-col items-center justify-center 2xl:gap-3 gap-1 mt-4">
                                   <p className="2xl:text-2xl pr-1.5">ou</p>
                                   <GoogleSingInButton />
                              </div>
                         </div>
                         <p className="text-right w-4/5 md:w-full m-auto text-[#B4B4B4] underline italic text-sm 2xl:text-base md:text-xs mt-2">Esqueceu a senha?</p>

                         <div className="text-center italic text-[#B4B4B4] mt-4 md:mt-4 2xl:mt-10 text-lg 2xl:text-xl md:text-sm">
                              <a href="/cadastro" className="font-semibold not-italic">Ainda não possui uma conta? <span className="font-extralight underline">Crie uma aqui.</span></a>
                         </div>
                    </div>
               </main >
          </>
     );
}
