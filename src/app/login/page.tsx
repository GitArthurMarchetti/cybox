'use client'

import Image from "next/image";

//icones
import { RiArrowLeftSLine } from "react-icons/ri";
import GoogleSingInButton from "../components/Button/buttonSignInGoogle";

import { login } from "../services/user";
import { signIn } from "next-auth/react";
import { useState } from "react";


export default function Login() {
     const [emailState, setEmail] = useState("")
     const [passwordState, setPassword] = useState("")
     console.log(emailState, passwordState)

     return (
          <>
               <Image src="/loginFundo.png" alt="Imagem de fundo" layout="fill" objectFit="cover" className="w-full h-[100vh] absolute z-0" />
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
                    <div className="w-[45%] m-auto   bg-[#0F0F0F] flex flex-col pb-20   rounded-[25px] text-white" >
                         <div className="flex items-center p-5 text-left cursor-pointer text-[#F6CF45]">
                              <RiArrowLeftSLine size={25} />
                              <a href="/" className="text-xl italic">voltar</a>
                         </div>
                         <div className="m-auto mb-16 mt-10 w-4/5">
                              <h2 className="cursor-default text-3xl">Bom te ver de volta!</h2>
                              <p className="cursor-default text-[#B4B4B4]">Olá! Seu retorno é sempre bem-vindo! Pronto para mais uma sessão produtiva?</p>
                         </div>
                         <div className="flex flex-col gap-2 text-center">
                              <form className="w-4/5 m-auto flex flex-col" action={() => signIn("credentials", {
                                   emailState,
                                   passwordState,
                                   redirect: false,
                                   callbackUrl: "/departamentos"
                              })}>
                                   <label className="bg-[#2C2C2C] text-lg flex flex-col gap-1 p-2 px-4 my-4 rounded-lg text-[#B4B4B4]">
                                        Email:
                                        <input className="w-11/12 px-2 bg-transparent border-0 outline-none text-white"
                                             id="email"
                                             type="email"
                                             name="email"
                                             value={emailState}
                                             onChange={(e) => setEmail(e.target.value)} />
                                   </label>
                                   <label className="bg-[#2C2C2C] text-lg flex flex-row items-center p-2 px-4 my-4 rounded-lg text-[#B4B4B4]">
                                        <div className="flex w-full flex-col gap-1">
                                             Senha:
                                             <input className="w-11/12 px-2 bg-transparent border-0 outline-none text-white"
                                                  id="password"
                                                  name="password"
                                                  type="password" value={passwordState}
                                                  onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                   </label>
                                   <div className="w-4/5 m-auto flex mt-11">
                                        <button className="bg-[#F6CF45] text-black w-1/2 mx-auto rounded-full h-14 text-xl font-semibold"
                                             onClick={() => signIn("credentials", {
                                                  emailState,
                                                  passwordState,
                                                  redirect: false,
                                                  callbackUrl: "/departamentos/page"
                                             })}>Entrar</button>
                                   </div>
                              </form>
                              <p>Ou</p>
                              <GoogleSingInButton />
                         </div>
                         <p className="text-right w-4/5 m-auto text-[#B4B4B4] underline italic">Esqueceu a senha?</p>

                         <div className="text-center italic text-[#B4B4B4] mt-16 text-xl ">
                              <a href="/cadastro" className="font-semibold not-italic">Ainda não possui uma conta? <span className="font-extralight underline">Crie uma aqui.</span> </a>
                         </div>
                    </div>
               </main>

          </>
     )
}