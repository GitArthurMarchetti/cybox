"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { RiArrowLeftSLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { DoCredentialsLogin } from "../services/login";
import { toast } from "sonner";

export default function Login() {
     const [isVisible, setIsVisible] = useState(false);
     const router = useRouter();
     const [error, setError] = useState<string | null>(null);
     const [isLoading, setIsLoading] = useState(false);

     async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
          event.preventDefault();
          setIsLoading(true);

          try {
               const formData = new FormData(event.currentTarget);
               const response = await DoCredentialsLogin(formData);

               if (response?.error) {
                    toast.error("Erro ao fazer login", {
                         description: "Credenciais inválidas. Por favor, verifique seu email e senha.",
                         duration: 5000,
                    });
               } else {
                    toast.success("Login bem-sucedido!", {
                         description: "Você será redirecionado para a página principal.",
                         duration: 2000,
                    });

                    // Pequeno atraso para mostrar o toast antes de redirecionar
                    setTimeout(() => {
                         router.push('/departamentos');
                    }, 500);
               }
          } catch (e: any) {
               toast.error("Erro ao fazer login", {
                    description: e.message || "Ocorreu um erro ao processar o login. Tente novamente.",
                    duration: 5000,
               });
          } finally {
               setIsLoading(false);
          }
     }
     return (
          <div className="relative min-h-screen w-full overflow-hidden bg-[#121212]">
               {/* Imagem de fundo */}
               <div className="absolute inset-0 z-0">
                    <Image
                         src="/loginFundo.png"
                         alt="Imagem de fundo"
                         layout="fill"
                         objectFit="cover"
                         priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
               </div>

               <main className="relative z-10 flex min-h-screen items-center justify-between px-6 md:px-8 lg:px-16 xl:px-24">
                    {/* Seção esquerda - Logo e título */}
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

                    {/* Seção direita - Formulário de login */}
                    <div className="w-5/12 rounded-xl bg-[#111] p-8">
                         {/* Botão de voltar */}
                         <a href="/" className="mb-8 inline-flex items-center text-[#F6CF45]">
                              <RiArrowLeftSLine className="mr-1 text-xl" />
                              <span className="italic">voltar</span>
                         </a>

                         {/* Cabeçalho do formulário */}
                         <h2 className="mb-2 text-3xl font-bold text-white">Bom te ver de volta!</h2>
                         <p className="mb-8 text-sm text-[#B4B4B4]">
                              Olá! Seu retorno é sempre bem-vindo! Pronto para mais uma sessão produtiva?
                         </p>

                         {/* Mensagem de erro */}
                         {error && (
                              <div className="mb-4 rounded-lg bg-red-600/80 p-3 text-sm text-white">
                                   {error}
                              </div>
                         )}

                         {/* Formulário */}
                         <form onSubmit={handleFormSubmit}>
                              {/* Email */}
                              <div className="mb-4">
                                   <div className="relative">
                                        <input
                                             className="w-full rounded-md bg-[#222] p-4 pb-3 pt-6 text-white outline-none focus:ring-1 focus:ring-[#F6CF45]"
                                             type="email"
                                             name="email"
                                             id="email"
                                             placeholder=" "
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

                              {/* Senha */}
                              <div className="mb-2">
                                   <div className="relative">
                                        <input
                                             className="w-full rounded-md bg-[#222] p-4 pb-3 pr-10 pt-6 text-white outline-none focus:ring-1 focus:ring-[#F6CF45]"
                                             type={isVisible ? "text" : "password"}
                                             name="password"
                                             id="password"
                                             placeholder=" "
                                             required
                                             autoComplete="current-password"
                                        />
                                        <label
                                             htmlFor="password"
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

                              {/* Esqueceu a senha */}
                              <div className="mb-6 text-right">
                                   <a href="#" className="text-xs italic text-[#B4B4B4] underline">
                                        Esqueceu a senha?
                                   </a>
                              </div>

                              {/* Botão de login */}
                              <button
                                   className="w-full rounded-full bg-[#F6CF45] py-4 font-semibold text-black hover:bg-[#f5d05b]"
                                   type="submit"
                                   disabled={isLoading}
                              >
                                   {isLoading ? 'Entrando...' : 'Entrar'}
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
                              <p className="mb-3 text-center text-sm text-[#B4B4B4]">Entre com Google:</p>
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

                         {/* Link para Cadastro */}
                         <div className="text-center">
                              <p className="text-sm text-[#B4B4B4]">
                                   Ainda não possui uma conta? <a href="/cadastro" className="font-semibold text-white hover:underline">Crie uma aqui.</a>
                              </p>
                         </div>
                    </div>
               </main>
          </div>
     );
}