'use client'

import Image from 'next/image'

//icons
import { MdDashboard } from "react-icons/md";
import { IoMdNotifications, IoMdSearch } from "react-icons/io";
import { FaFilter, FaGear } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import router from 'next/router';
import { IoNotificationsSharp } from 'react-icons/io5';


interface navProps {
    type: string
}

export default function Navbar({ type }: navProps) {

    return (
        <>
            {type == "1" ? (
                <>
                    <header className='borrar fixed top-0 left-0 w-full z-50'>
                        <nav className=' flex items-center w-full gap-10 px-1 xl:gap-4 xl:px-4 '>
                            <div className='w-[25%]'>
                                <Image
                                    src="/logo-branca.png"
                                    alt="Logo"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className='w-2/4 flex justify-evenly text-xl text-gray-300  p-6 rounded-full sm:w-4/8 lg:w-2/8'>
                                <a className=' transition- duration-300 hover:text-white' href="">Home</a>
                                <a className=' transition- duration-300 hover:text-white' href="">Planos</a>
                                <a className=' transition- duration-300 hover:text-white' href="">Sobre nós</a>
                                <a className=' transition- duration-300 hover:text-white' href="">Contato</a>
                            </div>
                            <div className='w-[25%] flex justify-end gap-2 '>
                                <Link href={'/cadastro'}
                                    className='bg-[#2E2E2E] text-white  hover:bg-[#F6CF45] hover:text-black  transition-all duration-300 h-11 px-9  text-lg rounded-full flex items-center'>
                                    Cadastrar
                                </Link>

                                <Link href={'/login'}
                                    className='border-[#2E2E2E]  hover:border-[#F6CF45] border-2 border-solid text-white transition-all  duration-300 hover:bg-[#F6CF45] hover:text-black h-11  px-9 flex items-center justify  text-lg rounded-full'>
                                    Entrar
                                </Link>


                            </div>
                        </nav>
                    </header>
                </>
            ) : type == '2' ? (
                <>
                    <header>
                        <nav className=' flex items-center w-full justify-between px-10 relative '>
                            <div className='w-[25%] flex items-center opacity-0 '>
                                <Image
                                    src="/logo-completa-branca.png"
                                    alt="Logo"
                                    width={90}
                                    height={20}
                                />
                            </div><div className='w-[25%] flex items-center -top-5 absolute '>
                                <Image
                                    src="/logo-completa-branca.png"
                                    alt="Logo"
                                    width={120}
                                    height={20}
                                />
                            </div>
                            <div className="flex items-center w-2/5 gap-5">
                                <label className="flex items-center bg-[#2C2C2C] w-full px-4 rounded-full">
                                    <input
                                        type="text"
                                        placeholder="Pesquise por sua categoria"
                                        className="flex-grow p-3 bg-[#2C2C2C] text-white rounded-lg outline-none placeholder:text-sm"
                                    />
                                    <IoMdSearch className="text-[#8C8888] text-xl" />
                                </label>
                                <button className="flex items-center text-white mr-4 gap-1">
                                    <FaFilter className="text-xl text-[#8C8888]" />
                                    <span className='underline underline-offset-2 italic text-[#8C8888]'>Filtar</span>
                                </button>
                            </div>
                            <div className='w-[25%] flex justify-end  items-center text-right gap-3 '>
                                <div>
                                    <IoNotificationsSharp className='text-2xl text-[#8C8888]' />
                                </div>
                                <div>
                                    <p className='text-[#fff]'>Colocar nome do logado</p>
                                    <p className='text-[#B4B4B4] text-sm'>email@gmail.com</p>
                                </div>
                                <div className=' w-14 h-14 rounded-full text-black bg-white flex items-center justify-center text-xl'>A</div>
                            </div>

                        </nav>
                    </header>
                </>
            ) : alert("Tipo de navbar invalido")}
        </>
    )
}