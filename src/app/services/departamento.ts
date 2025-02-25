"use server"

import { query } from '@/lib/mysql';
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
        fotoDepartamento: "placeholderImage.jpg"
    };
}

export async function getDepartamentos(): Promise<DepartamentoType[]> {
    try {
        const departamentos = await query(`
            SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at 
            FROM departamentos 
            ORDER BY titulo ASC
        `);
        return departamentos as DepartamentoType[];
    } catch (error) {
        console.error('Erro ao buscar departamentos do banco:', error);
        return [];
    }
}

export async function getDepartamentosByUser(userId: string): Promise<DepartamentoType[]> {
    try {
        const departamentos = await query(`
            SELECT d.*, DATE_FORMAT(d.created_at, '%Y-%m-%d') as created_at
            FROM departamentos AS d
            JOIN users_departamentos AS ud ON d.id_departamentos = ud.id_departamentos
            WHERE ud.id_users = ?
        `, [userId]);

        return departamentos as DepartamentoType[];
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

        const departamentos = await query(`
            SELECT d.*, DATE_FORMAT(d.created_at, '%Y-%m-%d') as created_at
            FROM departamentos AS d
            WHERE d.id_departamentos = ?
        `, [idDepartamento]);

        const departamentoArray = departamentos as DepartamentoType[];
        return departamentoArray.length > 0 ? departamentoArray[0] : null;
    } catch (error) {
        console.error("Erro ao buscar departamento por ID:", error);
        return null;
    }
}

export async function saveDepartamento(formData: FormData, userId: string) {
    try {
        // Coleta os dados do formulário
        const id_departamentos = +(formData.get('id_departamentos') as string) || null;
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

        if (!id_departamentos) {
            // Criação de um novo departamento
            const result = await query(`
                INSERT INTO departamentos (
                    titulo,
                    descricao,
                    totalMembros,
                    maximoMembros,
                    convite,
                    localizacao,
                    fotoDepartamento
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [titulo, descricao, totalMembros, maximoMembros, convite, localizacao, fotoDepartamento]);

            const insertId = (result as any).insertId;

            // Insere o criador do departamento na tabela de relacionamento como host
            await query(`
                INSERT INTO users_departamentos (
                    id_users,
                    id_departamentos,
                    is_host
                ) VALUES (?, ?, ?)
            `, [userId, insertId, true]);
        } else {
            // Atualização de um departamento existente
            await query(`
                UPDATE departamentos SET
                    titulo = ?,
                    descricao = ?,
                    totalMembros = ?,
                    maximoMembros = ?,
                    convite = ?,
                    localizacao = ?,
                    fotoDepartamento = ?
                WHERE id_departamentos = ?
            `, [titulo, descricao, totalMembros, maximoMembros, convite, localizacao, fotoDepartamento, id_departamentos]);

            // Garante que o usuário continua como host (para consistência)
            await query(`
                UPDATE users_departamentos
                SET is_host = true
                WHERE id_departamentos = ? AND id_users = ?
            `, [id_departamentos, userId]);
        }

        redirect("/departamentos");
    } catch (error) {
        console.error("Erro ao salvar departamento:", error);
        throw error;
    }
}

export async function removeDepartamento(departamento: DepartamentoType) {
    try {
        if (!departamento.id_departamentos) {
            throw new Error('O ID do departamento é necessário para deletar.');
        }

        await query('DELETE FROM departamentos WHERE id_departamentos = ?', [departamento.id_departamentos]);
        redirect('/departamentos');
    } catch (error) {
        console.error("Erro ao remover departamento:", error);
        throw error;
    }
}

export async function irParaEndereco(idDepartamento: number | null | string) {
    if (!idDepartamento) {
        throw new Error("O ID do departamento é necessário para redirecionar.");
    }

    redirect(`/categorias/${idDepartamento}`);
}

export async function verificarAcessoDepartamento(userId: string | number | null, departamentoId: number): Promise<boolean> {
    try {
        const result = await query(`
            SELECT 1
            FROM users_departamentos
            WHERE id_users = ? AND id_departamentos = ?
            LIMIT 1
        `, [userId, departamentoId]);

        return (result as any[]).length > 0;
    } catch (error) {
        console.error("Erro ao verificar acesso ao departamento:", error);
        return false;
    }
}