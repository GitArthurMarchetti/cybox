"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TbLogin2 } from "react-icons/tb";
import { motion } from "framer-motion";
import { SideBar } from "../components/Navigation/sideBar";
import SearchBar from "../components/SearchBar";
import DepartmentGrid from "../components/DepartmentGrid";
import DepartmentSidebar from "../components/DepartmentSidebar";
import { DepartamentoType } from "@/lib/types/types";
import { removeDepartamento } from "../services/departamento";
import ButtonCriarSala from "../components/Button/buttonCriarSala";
import EnterDepartmentModal from "../components/modals/entrarSala";
import { CompartilharModal, MembrosModal, ConfiguracoesDepartamentoModal } from "../components/modals";
import { getMembrosPerDepartamento, MembroDepartamento } from "../services/membros";
import { enviarConvitesPorEmail } from "../services/convites";
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
    const [departamentoMembros, setDepartamentoMembros] = useState<MembroDepartamento[]>([]);
    const [buscaDepartamento, setBuscaDepartamento] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [departamentosLocal, setDepartamentosLocal] = useState<DepartamentoType[]>(departamentos);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        setDepartamentosLocal(departamentos);
    }, [departamentos]);

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
        const userRole = dept.role || 'member';
        if (userRole === 'member') {
            return;
        }

        setSelectedDepartamento(dept);
        setIsSettingsModalOpen(true);

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
                setDepartamentosLocal(prev => 
                    prev.filter(d => d.id_departamentos !== selectedDepartamento.id_departamentos)
                );
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

    const handleInviteEmails = async (emails: string[]) => {
        if (!selectedDepartamento) return;

        try {
            const resultado = await enviarConvitesPorEmail(
                Number(selectedDepartamento.id_departamentos),
                userId,
                emails,
                selectedDepartamento.titulo,
                userName || 'Usuário'
            );

            if (resultado.success) {
                toast.success(resultado.message);
            } else {
                toast.error(resultado.message);
            }
        } catch (error) {
            console.error('Erro ao enviar convites:', error);
            toast.error('Erro ao enviar convites');
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
                onInvite={handleInviteEmails}
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
                    setDepartamentosLocal(prev => 
                        prev.map(d => 
                            d.id_departamentos === departamentoAtualizado.id_departamentos 
                                ? { ...d, ...departamentoAtualizado }
                                : d
                        )
                    );
                    setIsSettingsModalOpen(false);
                    setSelectedDepartamento(null);
                    setDepartamentoMembros([]);
                }}
            />

            <SideBar userEmail={userEmail} userName={userName} />

            <motion.main
                className="flex-grow bg-[#0F0F0F] p-6 overflow-hidden"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
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

                <SearchBar
                    value={buscaDepartamento}
                    onChange={setBuscaDepartamento}
                    isSearchFocused={isSearchFocused}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    itemVariants={itemVariants}
                />

                <div className="overflow-y-auto h-[73vh] pr-4 hide-scrollbar">
                    <DepartmentGrid
                        departamentos={departamentosLocal}
                        searchTerm={buscaDepartamento}
                        onSetSearchTerm={setBuscaDepartamento}
                        onShare={handleShareDepartamento}
                        onViewMembers={handleViewMembers}
                        onSettings={handleSettings}
                        containerVariants={containerVariants}
                        itemVariants={itemVariants}
                    />
                </div>
            </motion.main>

            <DepartmentSidebar
                departamentos={departamentosLocal}
                onDepartmentClick={(id) => router.push(`/departamentos/${id}`)}
            />
        </div>
    );
}