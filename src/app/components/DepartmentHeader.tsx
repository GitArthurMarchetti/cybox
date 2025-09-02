"use client"

import { motion } from 'framer-motion';
import { FaArrowLeft, FaShare, FaBuilding } from 'react-icons/fa';
import { MdModeEdit, MdAdd } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { TbUsers } from 'react-icons/tb';
import Image from 'next/image';
import { DepartamentoType, UserType } from '@/lib/types/types';
import { MembroDepartamento } from '@/app/services/membros';

interface DepartmentHeaderProps {
    departamento: DepartamentoType;
    host: UserType | null;
    membros: MembroDepartamento[];
    userRole: string;
    onBack: () => void;
    onShare: () => void;
    onSettings: () => void;
    onViewMembers: () => void;
    onAddCategory: () => void;
    onDeleteDepartment: () => void;
    itemVariants: {
        hidden: { opacity: number; y: number };
        visible: { opacity: number; y: number; transition: { delay?: number } };
    };
}

export default function DepartmentHeader({
    departamento,
    host,
    membros,
    userRole,
    onBack,
    onShare,
    onSettings,
    onViewMembers,
    onAddCategory,
    onDeleteDepartment,
    itemVariants
}: DepartmentHeaderProps) {
    const maxMembros = 50;
    const coresMembros = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];

    return (
        <motion.div 
            className="flex justify-between items-center mb-6"
            variants={itemVariants}
        >
            <div className="flex items-center gap-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#8c8888] hover:text-white transition-colors duration-300"
                >
                    <FaArrowLeft size={20} />
                    <span>Voltar</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        {departamento.fotoDepartamento && departamento.fotoDepartamento.startsWith('/') ? (
                            <Image
                                src={departamento.fotoDepartamento}
                                alt={`Foto do departamento ${departamento.titulo}`}
                                width={60}
                                height={60}
                                className="rounded-xl object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-15 h-15 rounded-xl bg-[#3D3D3D] text-[#F6CF45]">
                                <FaBuilding size={32} />
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-white">{departamento.titulo}</h1>
                        <p className="text-[#b4b4b4]">{departamento.descricao}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <TbUsers className="text-[#8c8888]" size={16} />
                                <span className="text-sm text-[#8c8888]">
                                    {membros.length}/{maxMembros} membros
                                </span>
                            </div>
                            {host && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#8c8888]">Host:</span>
                                    <span className="text-sm text-[#F6CF45]">{host.nome}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <motion.div className="flex -space-x-2">
                    {membros.slice(0, 5).map((membro, index) => (
                        <div
                            key={membro.id}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-[#0f0f0f] ${
                                coresMembros[index % coresMembros.length]
                            }`}
                            title={membro.nome}
                        >
                            {membro.nome.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {membros.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-[#2c2c2c] flex items-center justify-center text-white text-xs font-medium border-2 border-[#0f0f0f]">
                            +{membros.length - 5}
                        </div>
                    )}
                </motion.div>

                <button
                    onClick={onViewMembers}
                    className="flex items-center gap-2 bg-[#2c2c2c] text-white px-4 py-2 rounded-lg hover:bg-[#3c3c3c] transition-colors duration-300"
                >
                    <TbUsers size={16} />
                    Membros
                </button>

                <button
                    onClick={onShare}
                    className="flex items-center gap-2 bg-[#2c2c2c] text-white px-4 py-2 rounded-lg hover:bg-[#3c3c3c] transition-colors duration-300"
                >
                    <FaShare size={16} />
                    Compartilhar
                </button>

                {(userRole === 'owner' || userRole === 'admin') && (
                    <>
                        <button
                            onClick={onAddCategory}
                            className="flex items-center gap-2 bg-[#F6CF45] text-black px-4 py-2 rounded-lg hover:bg-[#F6CF45]/90 transition-colors duration-300"
                        >
                            <MdAdd size={16} />
                            Nova categoria
                        </button>

                        <button
                            onClick={onSettings}
                            className="p-2 bg-[#2c2c2c] text-[#F6CF45] hover:text-white rounded-lg transition-colors duration-300"
                        >
                            <MdModeEdit size={20} />
                        </button>

                        <button
                            onClick={onDeleteDepartment}
                            className="p-2 bg-[#2c2c2c] text-red-400 hover:text-red-300 rounded-lg transition-colors duration-300"
                        >
                            <RiDeleteBinLine size={20} />
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
}