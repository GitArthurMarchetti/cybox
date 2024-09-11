import Image from 'next/image'
import logoNav from '../../../img/logo-completa-branca.png'
import { MdDashboard } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaGear } from "react-icons/fa6";
interface navProps {
    type: string
}

export default function Navbar({ type }: navProps) {
    return (
        <>
            {type == "1" ? (
                <>
                    <header >
                        <nav className=' flex items-center w-full justify-between px-10 '>
                            <div className='w-[25%]'>
                                <Image className='w-36' alt='Logo nav' src={logoNav} />
                            </div>
                            <div className='bg-[#2E2E2E] w-2/4 flex justify-evenly text-xl text-white p-6 rounded-full'>
                                <a className=' transition- duration-300  hover:font-semibold' href="">Home</a>
                                <a className=' transition- duration-300  hover:font-semibold' href="">Planos</a>
                                <a className=' transition- duration-300  hover:font-semibold' href="">Sobre nós</a>
                                <a className=' transition- duration-300  hover:font-semibold' href="">Contato</a>
                            </div>
                            <div className='w-[25%] flex justify-end gap-2 '>

                                <button className='bg-[#F6CF45] text-black w-40 hover:bg-[#F1fF14] transition-all duration-300 h-11 px-9  text-lg rounded-full'>Cadastrar</button>

                                <button className='border-[#F6CF45] border-solid text-white border w-40 transition-all  duration-300 hover:bg-[#F1aF45] h-11 px-9  text-lg rounded-full'>Entrar</button>
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