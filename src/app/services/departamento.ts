"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation';
import { DepartamentoType } from "@/lib/types/types";


export async function getEmptyDepartamento(): Promise<DepartamentoType> {
    return { id_departamentos: null, titulo: "", descricao: "", totalMembros: 1, maximoMembros: 10, convite: "", localizacao: "" };
}

export async function getDepartamentos(): Promise<DepartamentoType[]> {
    try {
        return await db.execute<DepartamentoType>(sql`SELECT * FROM departamentos.departamentos ORDER BY titulo ASC`);
    } catch (error) {
        console.error('Erro ao buscar departamento do banco:', error);
        return [];
    }
}

export async function getDepartamentosByUser(userId: string): Promise<DepartamentoType[]> {
    try {
        const departamentos = await db.execute<DepartamentoType>(
            sql`SELECT d.*
                 FROM departamentos.departamentos AS d
                 JOIN chaves_estrangeiras.users_departamentos AS ud
                 ON d.id_departamentos = ud.id_departamentos
                 WHERE ud.id_users = ${userId}`
        );
        return departamentos;
    } catch (error) {
        console.error('Erro ao buscar departamentos do usuário:', error);
        return [];
    }
}


export async function saveDepartamento(formData: FormData, userId: string) {
    const id_departamentos = +(formData.get('id_departamentos') as string) as number;
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string || null;
    const totalMembros = Number(formData.get('totalMembros')) || 1;
    const maximoMembros = Number(formData.get('maximoMembros')) || 10;
    const convite = formData.get('convite') as string || null;
    const localizacao = formData.get('localizacao') as string || null;

    if (!titulo) {
        throw new Error('É necessário adicionar um título ao seu departamento.');
    }

    const departamento: DepartamentoType = {
        id_departamentos,
        titulo,
        descricao,
        totalMembros,
        maximoMembros,
        convite,
        localizacao,
    };

    if (!id_departamentos) {
        const [novoDepartamento] = await db.execute<DepartamentoType>(
            sql`INSERT INTO departamentos.departamentos (
                "titulo",
                "descricao",
                "totalMembros",
                "maximoMembros",
                "convite",
                "localizacao"
            ) VALUES (
                ${departamento.titulo},
                ${departamento.descricao},
                ${departamento.totalMembros},
                ${departamento.maximoMembros},
                ${departamento.convite},
                ${departamento.localizacao}
            ) RETURNING "id_departamentos"`
        );

        // Inserindo o relacionamento na tabela user_departamento
        if (novoDepartamento?.id_departamentos) {
            await db.execute(
                sql`INSERT INTO chaves_estrangeiras.users_departamentos (
                    id_users,
                    id_departamentos
                ) VALUES (
                    ${userId},  
                    ${novoDepartamento.id_departamentos} 
                )`
            );
        }

    } else {
        // Atualizando o departamento existente
        await db.execute(sql`UPDATE departamentos.departamentos SET
            "titulo" = ${departamento.titulo},
            "descricao" = ${departamento.descricao},
            "totalMembros" = ${departamento.totalMembros},
            "maximoMembros" = ${departamento.maximoMembros},
            "convite" = ${departamento.convite},
            "localizacao" = ${departamento.localizacao}
            WHERE "id_departamentos" = ${departamento.id_departamentos}`);
    }

    redirect("/departamentoTeste");
}


export async function removeDepartamento(departamento: DepartamentoType) {
    if (!departamento.id_departamentos) {
        throw new Error('O ID do departamento é necessário para deletar.');
    }

    await db.execute(sql`DELETE FROM departamentos.departamentos WHERE "id_departamentos" = ${departamento.id_departamentos}`);

    redirect('/departamentoTeste');
}
