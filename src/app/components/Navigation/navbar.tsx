'use client'

import Image from 'next/image'
import logoNav from '../../../img/logo-completa-branca.png'

//icons
import { MdDashboard } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaGear } from "react-icons/fa6";
import { useRouter } from 'next/navigation';


interface navProps {
    type: string
}

export default function Navbar({ type }: navProps) {

    const router = useRouter()

    return (
        <>
            {type == "1" ? (
                <>
                    <header className='fixed top-0 left-0 w-full z-50'>
                        <nav className=' flex items-center w-full gap-5 px-10 '>
                            <div className='w-[25%]'>
                                <Image className='w-36' alt='Logo nav' src={logoNav} />
                            </div>
                            <div className='bg-[#2E2E2E] w-2/4 flex justify-evenly text-xl text-gray-300  p-6 rounded-full sm:w-4/8 lg:w-2/8'>
                                <a className=' transition- duration-300 hover:text-white' href="">Home</a>
                                <a className=' transition- duration-300 hover:text-white' href="">Planos</a>
                                <a className=' transition- duration-300 hover:text-white' href="">Sobre nós</a>
                                <a className=' transition- duration-300 hover:text-white' href="">Contato</a>
                            </div>
                            <div className='w-[25%] flex justify-end gap-2 '>

                                <button className='bg-[#2E2E2E] text-white w-40 hover:bg-[#F6CF45] hover:text-black  transition-all duration-300 h-11 px-9  text-lg rounded-full'>Cadastrar</button>

                                <button className='border-[#2E2E2E] hover:border-[#F6CF45] border-2 border-solid text-white w-40 transition-all  duration-300 hover:bg-[#F6CF45] hover:text-black h-11 px-9  text-lg rounded-full'>Entrar</button>

                            </div>
                        </nav>
                    </header>
                </>
            ) : type == '2' ? (
                <>
                    <header>
                        <nav className=' flex items-center w-full justify-between px-10 '>
                            <div className='w-[25%] flex items-center'>
                                <Image className='w-36' alt='Logo nav' src={logoNav} />
                            </div>
                            <div className='bg-[#2E2E2E] w-2/4 flex justify-evenly text-xl text-white p-6 rounded-full'>
                                <a className=' flex items-center gap-2 transition-all duration-300   hover:font-bold' href=""><MdDashboard size={27} /> Departamentos</a>
                                <a className=' flex items-center gap-2 transition-all duration-300   hover:font-bold' href=""><IoMdNotifications size={30} /> Notificações</a>
                                <a className=' flex items-center gap-2 transition-all duration-300   hover:font-bold' href=""><FaGear size={25} /> Configurações</a>
                            </div>
                            <div className='w-[25%] flex justify-end gap-2 '>
                                <div className=' w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl'>A</div>
                            </div>

                        </nav>
                    </header>
                </>
            ) : alert("Tipo de navbar invalido")}
        </>
    )
}