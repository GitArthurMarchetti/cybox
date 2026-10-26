"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import { TbLogin2 } from "react-icons/tb";
import { motion } from "framer-motion";
import { SideBar } from "../components/Navigation/sideBar";
import { BarraTopoMobile, GavetaLateral } from "../components/Navigation/GavetaMobile";
import SearchBar from "../components/SearchBar";
import DepartmentGrid from "../components/DepartmentGrid";
import { DepartamentoType } from "@/lib/types/types";
import { removeDepartamento } from "../services/departamento";
import ButtonCriarSala from "../components/Button/buttonCriarSala";
import EnterDepartmentModal from "../components/modals/entrarSala";
import { CompartilharModal, MembrosModal, ConfiguracoesDepartamentoModal, ConfirmarExclusaoModal } from "../components/modals";
import { getMembrosPerDepartamento, MembroDepartamento } from "../services/membros";
import { enviarConvitesPorEmail } from "../services/convites";
import { toast } from "sonner";

type Props = {
    departamentos: DepartamentoType[];
    userId: string;
    userName: string | null | undefined;
    userEmail: string | null | undefined;
};

export default function DepartamentosFront({ departamentos, userId, userName, userEmail }: Props) {
    const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
    const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const departamentoEmConfiguracao = useRef<DepartamentoType['id_departamentos']>(null);
    const fecharMenuMobile = useCallback(() => setIsMenuMobileOpen(false), []);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [selectedDepartamento, setSelectedDepartamento] = useState<DepartamentoType | null>(null);
    const [departamentoMembros, setDepartamentoMembros] = useState<MembroDepartamento[]>([]);
    const [buscaDepartamento, setBuscaDepartamento] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [departamentosLocal, setDepartamentosLocal] = useState<DepartamentoType[]>(departamentos);
    const [filtroSelecionado, setFiltroSelecionado] = useState<string | null>(null);

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
        setDepartamentoMembros([]);
        setIsSettingsModalOpen(true);
        departamentoEmConfiguracao.current = dept.id_departamentos;

        if (dept.id_departamentos) {
            try {
                const membros = await getMembrosPerDepartamento(dept.id_departamentos);
                if (departamentoEmConfiguracao.current === dept.id_departamentos) {
                    setDepartamentoMembros(membros);
                }
            } catch (error) {
                console.error('Erro ao carregar membros:', error);
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
        if (!selectedDepartamento) return false;

        try {
            const resultado = await enviarConvitesPorEmail(
                Number(selectedDepartamento.id_departamentos),
                emails
            );

            if (resultado.success) {
                toast.success(resultado.message);
            } else {
                toast.error(resultado.message);
            }
            return resultado.success;
        } catch (error) {
            console.error('Erro ao enviar convites:', error);
            toast.error('Erro ao enviar convites');
            return false;
        }
    };

    const aplicarFiltros = (deps: DepartamentoType[]) => {
        let resultado = [...deps];

        if (!filtroSelecionado) return resultado;

        switch (filtroSelecionado) {
            case 'a-z':
                resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'z-a':
                resultado.sort((a, b) => b.titulo.localeCompare(a.titulo));
                break;
            case 'mais-recentes':
                resultado.sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA;
                });
                break;
            case 'mais-antigos':
                resultado.sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateA - dateB;
                });
                break;
            case 'mais-membros':
                resultado.sort((a, b) => (b.num_participantes || 0) - (a.num_participantes || 0));
                break;
            case 'menos-membros':
                resultado.sort((a, b) => (a.num_participantes || 0) - (b.num_participantes || 0));
                break;
            case 'owner':
                resultado = resultado.filter(dep => dep.role === 'owner');
                break;
            case 'admin':
                resultado = resultado.filter(dep => dep.role === 'admin');
                break;
            case 'member':
                resultado = resultado.filter(dep => dep.role === 'member');
                break;
            case 'ativo':
                resultado = resultado.filter(dep => dep.status === 'ativo' || !dep.status);
                break;
            case 'inativo':
                resultado = resultado.filter(dep => dep.status === 'inativo');
                break;
        }

        return resultado;
    };

    const departamentosFiltrados = aplicarFiltros(departamentosLocal);

    return (
        <div className="bg-page h-screen flex overflow-hidden">
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
                onDelete={() => {
                    setIsSettingsModalOpen(false);
                    setIsConfirmDeleteOpen(true);
                }}
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

            <ConfirmarExclusaoModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={async () => {
                    await handleDeleteDepartamento();
                    setIsConfirmDeleteOpen(false);
                }}
                titulo="Excluir departamento"
                descricao="Todas as categorias e patrimônios do departamento também serão excluídos."
                itemNome={selectedDepartamento?.titulo}
                tipo="departamento"
            />

            <GavetaLateral aberta={isMenuMobileOpen} onFechar={fecharMenuMobile}>
                <SideBar
                    userEmail={userEmail}
                    userName={userName}
                    user={{
                        id: userId,
                        nome: userName || '',
                        email: userEmail || '',
                        senha: ''
                    }}
                />
            </GavetaLateral>

            <div className="flex min-w-0 flex-1 flex-col">
            <BarraTopoMobile onAbrirMenu={() => setIsMenuMobileOpen(true)} />

            <motion.main
                className="flex min-h-0 flex-1 flex-col bg-page p-4 sm:p-6"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="flex flex-wrap justify-between items-center gap-4 mb-6"
                    variants={itemVariants}
                >
                    <h1 className="text-2xl font-bold text-white relative">
                        Seus Departamentos
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                    </h1>
                    <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:items-center">
                        <button
                            onClick={() => setIsEnterModalOpen(true)}
                            className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-primary text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                        >
                            <TbLogin2 className="text-lg" aria-hidden /> Entrar no departamento
                        </button>
                        <ButtonCriarSala />
                    </div>
                </motion.div>

                <SearchBar
                    value={buscaDepartamento}
                    onChange={setBuscaDepartamento}
                    isSearchFocused={isSearchFocused}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    itemVariants={itemVariants}
                    filtroSelecionado={filtroSelecionado}
                    onFilterChange={setFiltroSelecionado}
                />

                <div className="min-h-0 flex-1 overflow-y-auto pb-6 sm:pr-4 hide-scrollbar">
                    <DepartmentGrid
                        departamentos={departamentosFiltrados}
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
            </div>
        </div>
    );
}