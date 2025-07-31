'use server';

import { redirect } from "next/navigation";

import { getDepartamentosById, verificarAcessoDepartamento } from "@/app/services/departamento";
import CategoriaFront from "./front";
import { auth } from "@/auth";
import { UserType } from "@/lib/types/types";
import { getHostByDepartamento } from "@/app/services/user";
import { getMembrosPerDepartamento } from "@/app/services/membros";
import { getCategoriasComTotalPatrimonios } from "@/app/services/categoria";
import { MdBlock } from "react-icons/md";
import { IoArrowBack, IoHome } from "react-icons/io5";



export default async function DepartamentoDetalhes({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const user = {
        id: session.user.id,
        nome: session.user.name || '',
        email: session.user.email || '',
        senha: ''
    } as UserType;
    const departamentoId = parseInt(params.id);

    const temAcesso = await verificarAcessoDepartamento(user.id, departamentoId);

    if (!temAcesso) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Ícone animado */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                                <MdBlock className="w-12 h-12 text-white" />
                            </div>
                            {/* Círculos animados */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Conteúdo principal */}
                    <div className="bg-[#1F1F1F] rounded-2xl  p-8 shadow-2xl border border-[#2c2c2c] ">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white mb-4">
                                Acesso Negado
                            </h1>
                            <p className="text-[#b4b4b4] text-lg mb-6 leading-relaxed">
                                Você não tem permissão para acessar este departamento.
                            </p>
                            <p className="text-[#8c8888] text-sm mb-8">
                                Entre em contato com o administrador do departamento para solicitar acesso.
                            </p>

                            {/* Botões de ação */}
                            <div className="flex flex-col w-full justify-center sm:flex-row gap-3">
                                <a
                                    href="/departamentos"
                                    className="flex items-center justify-center gap-2 bg-[#F6CF45] text-black font-medium px-6 py-3 rounded-lg hover:bg-[#F6CF45]/90 transition-all duration-300 transform hover:scale-105"
                                >
                                    <IoArrowBack className="w-4 h-4" />
                                    Voltar aos Departamentos
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Decoração de fundo */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-400/5 rounded-full blur-2xl -z-10"></div>
                </div>
            </div>
        );
    }

    const departamentoEscolhido = await getDepartamentosById(departamentoId);

    if (!departamentoEscolhido) {
        return <div>Departamento não encontrado. ID: {departamentoId}</div>;
    }

    // Busca o host do departamento
    const host = await getHostByDepartamento(departamentoId);

    // Busca todos os membros do departamento
    const membros = await getMembrosPerDepartamento(departamentoId);

    // Busca as categorias com total de patrimônios
    const categorias = await getCategoriasComTotalPatrimonios(departamentoId);

    // Renderiza o componente com os dados do departamento
    return <CategoriaFront departamento={departamentoEscolhido} user={user} host={host} membros={membros} categorias={categorias} />;
}

