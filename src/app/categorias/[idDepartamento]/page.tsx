'use server';

import { useParams } from "next/navigation";

import { getDepartamentosById, verificarAcessoDepartamento } from "@/app/services/departamento";
import CategoriaFront from "./front";
import { auth } from "@/auth";
import { UserType } from "@/lib/types/types";
import { getHostByDepartamento, getUsersByDepartamento } from "@/app/services/user";



export default async function Categorias({ params }: { params: { idDepartamento: number } }) {
    const session = await auth();

    if (!session?.user) {
        return (
            <>
                <h1>Ops... Algo não está certo, confira se já fez o seu login.</h1>
            </>
        );
    }

    const user = session.user as UserType;
    const departamentoId = params.idDepartamento;

    const temAcesso = await verificarAcessoDepartamento(user.id, departamentoId);

    if (!temAcesso) {
        return (
            <>
                <h1>Você não tem permissão para acessar este departamento.</h1>
            </>
        );
    }

    const departamentoEscolhido = await getDepartamentosById(departamentoId);

    if (!departamentoEscolhido) {
        return <div>Departamento não encontrado. ID: {departamentoId}</div>;
    }

    // Busca o host do departamento
    const host = await getHostByDepartamento(departamentoId);
    console.log("Host do Departamento:", host);

    // Renderiza o componente com os dados do departamento
    return <CategoriaFront departamento={departamentoEscolhido} user={user} host={host} />;
}

