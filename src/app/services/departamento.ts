"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation';
import { DepartamentoType } from "@/lib/types/types";
import { format } from "date-fns";


export async function getEmptyDepartamento(): Promise<DepartamentoType> {
    return {
        id_departamentos: null,
        titulo: "",
        descricao: "",
        totalMembros: 1,
        maximoMembros: 10,
        convite: "",
        localizacao: "",
        fotoDepartamento: "placeholderImage.jpg" // Inicialmente vazio
    };
}

export async function getDepartamentos(): Promise<DepartamentoType[]> {
    try {
        return await db.execute<DepartamentoType>(
            sql`SELECT *, TO_CHAR(created_at, 'YYYY-MM-DD') as created_at FROM departamentos.departamentos ORDER BY titulo ASC`
        );
    } catch (error) {
        console.error('Erro ao buscar departamento do banco:', error);
        return [];
    }
}

export async function getDepartamentosByUser(userId: string): Promise<DepartamentoType[]> {
    try {
        const departamentos = await db.execute<DepartamentoType>(
            sql`SELECT d.*, TO_CHAR(d.created_at, 'YYYY-MM-DD') as created_at
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


export async function getDepartamentosById(idDepartamento: string | number): Promise<DepartamentoType | null> {
    try {
        if (!idDepartamento) {
            throw new Error("ID do departamento inválido ou ausente.");
        }

        const [departamento] = await db.execute<DepartamentoType>(
            sql`SELECT d.*, TO_CHAR(d.created_at, 'YYYY-MM-DD') as created_at
                 FROM departamentos.departamentos AS d
                 WHERE d.id_departamentos = ${idDepartamento}`
        );

        return departamento || null; // Retorna o departamento ou null se não encontrado
    } catch (error) {
        console.error("Erro ao buscar departamento por ID:", error);
        return null;
    }
}



export async function saveDepartamento(formData: FormData, userId: string) {
    // Coleta e valida os dados do formulário
    const id_departamentos = +(formData.get('id_departamentos') as string) as number;
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string || null;
    const totalMembros = Number(formData.get('totalMembros')) || 1;
    const maximoMembros = Number(formData.get('maximoMembros')) || 10;
    const convite = formData.get('convite') as string || null;
    const localizacao = formData.get('localizacao') as string || null;
    const fotoDepartamento = formData.get('fotoDepartamento') as string || null;

    if (!titulo) {
        throw new Error('É necessário adicionar um título ao seu departamento.');
    }

    // Cria o objeto do departamento
    const departamento: DepartamentoType = {
        id_departamentos,
        titulo,
        descricao,
        totalMembros,
        maximoMembros,
        convite,
        localizacao,
        fotoDepartamento,
    };

    if (!id_departamentos) {
        // Criação de um novo departamento
        const [novoDepartamento] = await db.execute<DepartamentoType>(
            sql`INSERT INTO departamentos.departamentos (
                "titulo",
                "descricao",
                "totalMembros",
                "maximoMembros",
                "convite",
                "localizacao",
                "fotoDepartamento"
            ) VALUES (
                ${departamento.titulo},
                ${departamento.descricao},
                ${departamento.totalMembros},
                ${departamento.maximoMembros},
                ${departamento.convite},
                ${departamento.localizacao},
                ${departamento.fotoDepartamento}
            ) RETURNING "id_departamentos"`
        );

        if (novoDepartamento?.id_departamentos) {
            // Insere o criador do departamento na tabela de relacionamento como host
            await db.execute(
                sql`INSERT INTO chaves_estrangeiras.users_departamentos (
                    id_users,
                    id_departamentos,
                    is_host
                ) VALUES (
                    ${userId},  
                    ${novoDepartamento.id_departamentos},
                    TRUE -- Define como host
                )`
            );
        }
    } else {
        // Atualização de um departamento existente
        await db.execute(sql`UPDATE departamentos.departamentos SET
            "titulo" = ${departamento.titulo},
            "descricao" = ${departamento.descricao},
            "totalMembros" = ${departamento.totalMembros},
            "maximoMembros" = ${departamento.maximoMembros},
            "convite" = ${departamento.convite},
            "localizacao" = ${departamento.localizacao},
            "fotoDepartamento" = ${departamento.fotoDepartamento}
            WHERE "id_departamentos" = ${departamento.id_departamentos}`);

        // Atualização do criador como host (garantia de consistência)
        await db.execute(
            sql`UPDATE chaves_estrangeiras.users_departamentos
                SET is_host = TRUE
                WHERE id_departamentos = ${id_departamentos}
                AND id_users = ${userId}`
        );
    }

    redirect("/departamentos");
}



export async function removeDepartamento(departamento: DepartamentoType) {
    if (!departamento.id_departamentos) {
        throw new Error('O ID do departamento é necessário para deletar.');
    }

    await db.execute(sql`DELETE FROM departamentos.departamentos WHERE "id_departamentos" = ${departamento.id_departamentos}`);

    redirect('/departamentos');
}


export async function irParaEndereco(idDepartamento: number | null | string) {
    if (!idDepartamento) {
        throw new Error("O ID do departamento é necessário para redirecionar.");
    }

    // Converte o ID para string, se necessário, e redireciona
    redirect(`/categorias/${idDepartamento}`);
}