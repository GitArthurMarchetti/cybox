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
import { CompartilharModal } from "../components/modals/CompartilharModal";
import MembrosModal from "../components/modals/MembrosModal";
import ConfiguracoesDepartamentoModal from "../components/modals/ConfiguracoesDepartamentoModal";
import ConfirmarExclusaoModal from "../components/modals/ConfirmarExclusaoModal";
import { getMembrosPerDepartamento, MembroDepartamento } from "../services/membros";
import { enviarConvitesPorEmail } from "../services/convites";
import { toast } from "sonner";
import { Backdrop } from "../components/home/landing/Backdrop";
import { useDemo } from "../components/demo/DemoContext";

type Props = {
    departamentos: DepartamentoType[];
    userId: string;
    userName: string | null | undefined;
    userEmail: string | null | undefined;
};

export default function DepartamentosFront({ departamentos, userId, userName, userEmail }: Props) {
    const { blockIfDemo } = useDemo();
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
                console.error('Error loading members:', error);
            }
        }
    };

    const handleDeleteDepartamento = async () => {
        if (blockIfDemo()) return;
        if (selectedDepartamento) {
            try {
                await removeDepartamento(selectedDepartamento);
                toast.success('Room deleted');
                setDepartamentosLocal(prev => 
                    prev.filter(d => d.id_departamentos !== selectedDepartamento.id_departamentos)
                );
                setIsSettingsModalOpen(false);
                setSelectedDepartamento(null);
                setDepartamentoMembros([]);
            } catch (error) {
                toast.error("Couldn't delete the room");
                console.error('Error deleting room:', error);
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
            console.error('Error sending invites:', error);
            toast.error("Couldn't send the invites");
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
        <div className="relative flex h-screen overflow-hidden">
            <Backdrop />
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
                titulo="Delete room"
                descricao="Every category and asset in this room will be deleted too."
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
                className="relative flex min-h-0 flex-1 flex-col p-4 sm:p-8"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="mb-8 flex flex-wrap items-end justify-between gap-5"
                    variants={itemVariants}
                >
                    <div>
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">Workspace</p>
                        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {userName ? `Hi, ${userName.split(' ')[0]}` : 'Your rooms'}
                        </h1>
                        <p className="mt-1.5 text-sm text-white/50">
                            {departamentosLocal.length} {departamentosLocal.length === 1 ? 'room' : 'rooms'} · one for each department you manage
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:items-center">
                        <button
                            onClick={() => setIsEnterModalOpen(true)}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm font-medium text-white/90 transition-colors hover:border-primary/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <TbLogin2 className="text-lg" aria-hidden /> <span className="sm:hidden">Join</span><span className="hidden sm:inline">Join with code</span>
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

                <div className="hide-scrollbar -mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-8 pt-1">
                    <DepartmentGrid
                        departamentos={departamentosFiltrados}
                        searchTerm={buscaDepartamento}
                        onSetSearchTerm={setBuscaDepartamento}
                        onShare={handleShareDepartamento}
                        onViewMembers={handleViewMembers}
                        onSettings={handleSettings}
                        emptyAction={<ButtonCriarSala />}
                        containerVariants={containerVariants}
                        itemVariants={itemVariants}
                    />
                </div>
            </motion.main>
            </div>
        </div>
    );
}