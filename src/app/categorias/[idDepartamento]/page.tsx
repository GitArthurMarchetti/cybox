'use server';

import { useParams } from "next/navigation";

import { getDepartamentosById } from "@/app/services/departamento";



export default async function Categorias({ params }: { params: { idDepartamento: number } }) {
    console.log("ID recebido nos params:", params.idDepartamento); // Debug

    const departamentoEscolhido = await getDepartamentosById(params.idDepartamento);

    if (!departamentoEscolhido) {
        return <div>Departamento não encontrado. ID: {params.idDepartamento}</div>;
    }

    return
}
