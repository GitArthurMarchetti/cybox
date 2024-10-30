"use client"

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "../components/Button/buttonLogOut";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { IoMdNotifications, IoMdSearch } from "react-icons/io";
import { FaFilter, FaGear } from "react-icons/fa6";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { BsPlus } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";

import { CardDepartamento } from "../components/cardDepartamentos"
import { ListDepartamentos } from "../components/listDepartamentos";
import { SideBar } from "../components/Navigation/sideBar";
import { DepartamentoType, UserType } from "@/lib/types/types";
import { useState } from "react";
import { saveDepartamento } from "../services/departamento";


type Props = {
    departamentos: DepartamentoType[];
    users: UserType[];
    departamento: DepartamentoType;
    userId: string;
    userName: string | null | undefined;
    userEmail: string | null | undefined;
};


export default function DepartamentosFront({ departamentos, departamento: novoDepartamento, userId, userName, userEmail, users }: Props) {

    const [departamento, setDepartamento] = useState<DepartamentoType>(novoDepartamento);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await saveDepartamento(formData, userId);
        } catch (error) {
            console.error('Erro ao salvar o departamento:', error);
        }
    };


    

    return (
        <div className="bg-[#0F0F0F] h-screen flex">
            <SideBar userEmail={userEmail} userName={userName}/>

            <main className="flex-grow bg-[#0F0F0F] p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="2xl:text-3xl text-xl font-bold text-white">Seus Departamentos</h1>
                    <div className="flex gap-4 absolute right-7">
                        <button className="bg-none text-[#F6CF45] flex items-center gap-2 border border-[#F6CF45] 2xl:px-6 2xl:py-2 px-4 py-1 2xl:text-base text-sm  rounded-full">
                            <TbLogin2 className="2xl:text-2xl" /> Entrar em sala
                        </button>
                        <button className="bg-[#F6CF45] flex items-center gap-2  text-black 2xl:px-6 2xl:py-2 px-4 py-1 2xl:text-base text-sm rounded-full">
                            <BsPlus className="2xl:text-3xl" /> Criar sala
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8 2xl:gap-0  gap-6 pr-3">
                    <label className="flex items-center bg-[#2C2C2C] w-[90%] px-4 rounded-full">
                        <input
                            type="text"
                            placeholder="Pesquise por sua sala"
                            className="flex-grow p-3 bg-[#2C2C2C] text-white rounded-lg outline-none 2xl:placeholder:text-base placeholder:text-sm"
                        />
                        <IoMdSearch className="text-[#8C8888] 2xl:text-2xl text-xl" />
                    </label>
                    <button className="flex items-center text-white mr-4 ">
                        <FaFilter className="2xl:text-2xl text-base text-[#8C8888]" />
                        <span className="ml-2 text-[#8C8888] underline-offset-4 underline 2xl:text-base text-xs italic">Filtrar</span>
                    </button>
                </div>

                <div className="overflow-y-auto 2xl:h-[79vh] h-[64vh] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {departamentos.map((d) => (
                            <CardDepartamento key={d.id_departamentos}
                            nome={d.titulo}
                            desc={d.descricao}
                            cargo={"Host: Y"}
                            NParticipantes={d.totalMembros} 
                            avatar="/avatar.png" />
                        ))}
                    </div>
                </div>
            </main>
            
            <aside className="w-[20%] bg-[#1F1F1F] text-white p-6 2xl:h-[88.5vh] h-[80vh] mt-[5.12rem] rounded-xl mr-7 overflow-y-auto">
                <h2 className="2xl:text-lg text-sm font-bold mb-4 flex items-center justify-between">
                    Lista de salas <SlOptions />
                </h2>
                <ul className="flex flex-col gap-4">
                    <ListDepartamentos nome="Eletrônicos" data="13/10/2024" />
                    <ListDepartamentos nome="Móveis" data="20/11/2024" />
                    <ListDepartamentos nome="Veículos" data="02/07/2022" />
                </ul>
            </aside>
        </div>
    );
}