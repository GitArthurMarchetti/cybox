"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { IoMdNotifications, IoMdSearch } from "react-icons/io";
import { FaFilter, FaGear } from "react-icons/fa6";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { BsPlus } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { motion } from "framer-motion";
import { CardDepartamento } from "../components/cardDepartamentos";
import { ListDepartamentos } from "../components/listDepartamentos";
import { SideBar } from "../components/Navigation/sideBar";
import { DepartamentoType, UserType } from "@/lib/types/types";
import { removeDepartamento } from "../services/departamento";
import ButtonCriarSala from "../components/Button/buttonCriarSala";
import EnterDepartmentModal from "../components/modals/entrarSala";
import { CompartilharModal, MembrosModal, ConfiguracoesDepartamentoModal } from "../components/modals";
import { getMembrosPerDepartamento } from "../services/membros";
import { toast } from "sonner";

type Props = {
    departamentos: DepartamentoType[];
    departamento: DepartamentoType;
    userId: string;
    userName: string | null | undefined;
    userEmail: string | null | undefined;
};

export default function DepartamentosFront({ departamentos, departamento, userId, userName, userEmail }: Props) {
    const router = useRouter();
    const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [selectedDepartamento, setSelectedDepartamento] = useState<DepartamentoType | null>(null);
    const [departamentoMembros, setDepartamentoMembros] = useState<any[]>([]);
    const [buscaDepartamento, setBuscaDepartamento] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [departamentosLocal, setDepartamentosLocal] = useState<DepartamentoType[]>(departamentos);

    // Lista filtrada de departamentos
    const filteredDepartamentos = departamentosLocal.filter((d) =>
        d.titulo.toLowerCase().includes(buscaDepartamento.toLowerCase())
    );

    // Efeito para animação de carregamento da página
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Sincronizar departamentos locais com a prop
    useEffect(() => {
        setDepartamentosLocal(departamentos);
    }, [departamentos]);

    // Variantes de animação para os elementos
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const handleShareDepartamento = (dept: DepartamentoType) => {
        setSelectedDepartamento(dept);
        setIsShareModalOpen(true);
    };

    const handleViewMembers = (dept: DepartamentoType) => {
        setSelectedDepartamento(dept);
        setIsMembersModalOpen(true);
    };

    const handleSettings = async (dept: DepartamentoType) => {
        // Verificar se o usuário tem permissão (owner ou admin)
        const userRole = dept.role || 'member';
        if (userRole === 'member') {
            // Membros só podem visualizar
            return;
        }

        setSelectedDepartamento(dept);
        setIsSettingsModalOpen(true);

        // Carregar membros do departamento
        if (dept.id_departamentos) {
            try {
                const membros = await getMembrosPerDepartamento(dept.id_departamentos);
                setDepartamentoMembros(membros);
            } catch (error) {
                console.error('Erro ao carregar membros:', error);
                setDepartamentoMembros([]);
            }
        }
    };

    const handleDeleteDepartamento = async () => {
        if (selectedDepartamento) {
            try {
                await removeDepartamento(selectedDepartamento);
                toast.success('Departamento excluído com sucesso!');
                
                // Remover o departamento do array local
                setDepartamentosLocal(prev => 
                    prev.filter(d => d.id_departamentos !== selectedDepartamento.id_departamentos)
                );
                
                // Fechar modais e limpar seleção
                setIsSettingsModalOpen(false);
                setSelectedDepartamento(null);
                setDepartamentoMembros([]);
            } catch (error) {
                toast.error('Erro ao excluir departamento');
                console.error('Erro ao excluir departamento:', error);
                setIsSettingsModalOpen(false);
                setSelectedDepartamento(null);
            }
        }
    };

    return (
        <div className="bg-[#0F0F0F] h-screen flex overflow-hidden">
            <EnterDepartmentModal
                isOpen={isEnterModalOpen}
                onClose={() => setIsEnterModalOpen(false)}
            />

            <CompartilharModal
                isOpen={isShareModalOpen}
                onClose={() => {
                    setIsShareModalOpen(false);
                    setSelectedDepartamento(null);
                }}
                departamento={selectedDepartamento}
            />

            <MembrosModal
                isOpen={isMembersModalOpen}
                onClose={() => {
                    setIsMembersModalOpen(false);
                    setSelectedDepartamento(null);
                }}
                departamento={selectedDepartamento}
            />

            <ConfiguracoesDepartamentoModal
                isOpen={isSettingsModalOpen}
                onClose={() => {
                    setIsSettingsModalOpen(false);
                    setSelectedDepartamento(null);
                    setDepartamentoMembros([]);
                }}
                departamento={selectedDepartamento}
                membros={departamentoMembros}
                isAdmin={selectedDepartamento?.role === 'owner' || selectedDepartamento?.role === 'admin'}
                isOwner={selectedDepartamento?.role === 'owner'}
                onDelete={handleDeleteDepartamento}
                onSuccess={(departamentoAtualizado: DepartamentoType) => {
                    // Atualizar o departamento no array local
                    setDepartamentosLocal(prev => 
                        prev.map(d => 
                            d.id_departamentos === departamentoAtualizado.id_departamentos 
                                ? { ...d, ...departamentoAtualizado }
                                : d
                        )
                    );
                    
                    // Fechar modal e limpar seleção
                    setIsSettingsModalOpen(false);
                    setSelectedDepartamento(null);
                    setDepartamentoMembros([]);
                }}
            />

            {/* Sidebar */}
            <SideBar userEmail={userEmail} userName={userName} />

            {/* Conteúdo principal */}
            <motion.main
                className="flex-grow bg-[#0F0F0F] p-6 overflow-hidden"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {/* Cabeçalho */}
                <motion.div
                    className="flex justify-between items-center mb-6"
                    variants={itemVariants}
                >
                    <h1 className="text-2xl font-bold text-white relative">
                        Seus Departamentos
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#F6CF45] rounded-full"></span>
                    </h1>
                    <div className="flex gap-4 items-center">
                        <motion.button
                            onClick={() => setIsEnterModalOpen(true)}
                            className="bg-transparent text-[#F6CF45] flex items-center gap-2 border border-[#F6CF45] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#F6CF45]/10"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <TbLogin2 className="text-xl" /> Entrar no departamento
                        </motion.button>
                        <ButtonCriarSala userId={userId} departamento={departamento} />
                    </div>
                </motion.div>

                {/* Barra de pesquisa */}
                <motion.div
                    className="flex items-center justify-between mb-8 gap-6 pr-3"
                    variants={itemVariants}
                >
                    <div
                        className={`flex items-center bg-[#2C2C2C] w-[90%] px-4 rounded-full transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-[#F6CF45]/50' : ''}`}
                    >
                        <input
                            type="text"
                            placeholder="Pesquise por seu departamento"
                            className="flex-grow p-3 bg-[#2C2C2C] text-white rounded-lg outline-none placeholder:text-[#8C8888]"
                            value={buscaDepartamento}
                            onChange={(e) => setBuscaDepartamento(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <IoMdSearch className="text-[#8C8888] text-xl" />
                    </div>
                    <motion.button
                        className="flex items-center text-white group"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaFilter className="text-[#8C8888] group-hover:text-[#F6CF45] transition-colors duration-300" />
                        <span className="ml-2 text-[#8C8888] underline-offset-4 underline italic group-hover:text-[#F6CF45] transition-colors duration-300">Filtrar</span>
                    </motion.button>
                </motion.div>

                {/* Lista de departamentos */}
                <div className="overflow-y-auto h-[73vh] pr-4 hide-scrollbar">

                    {filteredDepartamentos.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                        >
                            {filteredDepartamentos.map((d, index) => (
                                <motion.div
                                    key={d.id_departamentos}
                                    variants={itemVariants}
                                    custom={index}
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <CardDepartamento
                                        departamento={d}
                                        id_departamento={d.id_departamentos}
                                        titulo={d.titulo}
                                        desc={d.descricao}
                                        cargo={d.role || 'member'}
                                        NParticipantes={d.num_participantes || 0}
                                        maximoParticipante={50}
                                        fotoDepartamento={d.fotoDepartamento || ""}
                                        userId={userId}
                                        onShare={handleShareDepartamento}
                                        onViewMembers={handleViewMembers}
                                        onSettings={handleSettings}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="flex flex-col items-center justify-center h-64 text-center"
                            variants={itemVariants}
                        >
                            <div className="bg-[#2C2C2C] p-8 rounded-xl mb-4 w-16 h-16 flex items-center justify-center">
                                <MdDashboard color="#F6CF45" />
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-2">Nenhum departamento encontrado</h3>
                            <p className="text-[#8C8888] max-w-md">
                                Não encontramos departamentos com esse nome. Tente outro termo ou crie um novo departamento.
                            </p>
                            <motion.button
                                onClick={() => setBuscaDepartamento("")}
                                className="mt-4 text-[#F6CF45] border border-[#F6CF45] px-4 py-2 rounded-full hover:bg-[#F6CF45]/10 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Limpar busca
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </motion.main>

            {/* Sidebar direita */}
            <motion.aside
                className="w-[20%] bg-[#1F1F1F] text-white p-6 h-[88.5vh] mt-[5.12rem] rounded-xl mr-7 overflow-y-auto hide-scrollbar"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Lista de departamento</h2>
                    <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                    >
                        <SlOptions className="text-[#8C8888] hover:text-white transition-colors duration-300" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    {departamentosLocal.length > 0 ? (
                        departamentosLocal.map((d, index) => (
                            <motion.div
                                key={d.id_departamentos}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * index, duration: 0.3 }}
                            >
                                <ListDepartamentos
                                    titulo={d.titulo}
                                    data={d.created_at ?? ""}
                                    onClick={() => router.push(`/departamentos/${d.id_departamentos}`)}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-[#8C8888]">
                            Nenhum departamento disponível
                        </div>
                    )}
                </div>
            </motion.aside>
        </div>
    );
}