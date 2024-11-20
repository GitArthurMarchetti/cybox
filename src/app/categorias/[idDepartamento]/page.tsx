'use server';

import { useParams } from "next/navigation";

import { getDepartamentosById } from "@/app/services/departamento";
import CategoriaFront from "./front";
import { auth } from "@/auth";
import { UserType } from "@/lib/types/types";
import { getHostByDepartamento, getUsersByDepartamento } from "@/app/services/user";



export default async function Categorias({ params }: { params: { idDepartamento: number } }) {

    const session = await auth();



    if (!session?.user) return (<>
        <h1>Ops... Algo não está certo, confira se já fez o seu login.</h1>
        {/* Preciso que monte a página de erro do usuário, caso ele não tenha feito login ou algo do tipo, sugiro fazer um componente, porque usará várias vezes */}
    </>)

    const departamentoEscolhido = await getDepartamentosById(params.idDepartamento);

    if (!departamentoEscolhido) {
        return <div>Departamento não encontrado. ID: {params.idDepartamento}</div>;
    }


    const user = session.user as UserType;

    const host = await getHostByDepartamento(params.idDepartamento)
    console.log(host)

    return <CategoriaFront departamento={departamentoEscolhido} user={user} host={host}/>
}


