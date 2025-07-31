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
        convite: "",
        codigo_convite: "",
        localizacao: "",
        fotoDepartamento: "placeholderImage.jpg",
        status: "ativo"
    };
}

export async function getDepartamentos(): Promise<DepartamentoType[]> {
    try {
        const departamentos = await query(`
            SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at 
            FROM departamentos 
            WHERE status != 'deletado'
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
            SELECT d.*, DATE_FORMAT(d.created_at, '%Y-%m-%d') as created_at, ud.role,
                   (SELECT COUNT(*) FROM users_departamentos WHERE id_departamentos = d.id_departamentos AND status = 'ativo') as num_participantes
            FROM departamentos AS d
            JOIN users_departamentos AS ud ON d.id_departamentos = ud.id_departamentos
            WHERE ud.id_users = ? AND d.status != 'deletado' AND ud.status = 'ativo'
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
            WHERE d.id_departamentos = ? AND d.status != 'deletado'
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
        const convite = formData.get('convite') as string || null;
        const localizacao = formData.get('localizacao') as string || null;
        const fotoDepartamento = formData.get('fotoDepartamento') as string || null;

        if (!titulo) {
            throw new Error('É necessário adicionar um título ao seu departamento.');
        }

        if (!id_departamentos) {
            // Criação de um novo departamento
            // Gerar código de convite único
            const codigo_convite = `DEPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            
            const result = await query(`
                INSERT INTO departamentos (
                    titulo,
                    descricao,
                    convite,
                    codigo_convite,
                    localizacao,
                    fotoDepartamento,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, 'ativo')
            `, [titulo, descricao, convite, codigo_convite, localizacao, fotoDepartamento]);

            const insertId = (result as any).insertId;

            // Insere o criador do departamento na tabela de relacionamento como owner
            await query(`
                INSERT INTO users_departamentos (
                    id_users,
                    id_departamentos,
                    role,
                    status
                ) VALUES (?, ?, 'owner', 'ativo')
            `, [userId, insertId]);
        } else {
            // Atualização de um departamento existente
            await query(`
                UPDATE departamentos SET
                    titulo = ?,
                    descricao = ?,
                    convite = ?,
                    localizacao = ?,
                    fotoDepartamento = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id_departamentos = ? AND status != 'deletado'
            `, [titulo, descricao, convite, localizacao, fotoDepartamento, id_departamentos]);
        }

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

        // Soft delete - marcar como deletado ao invés de remover
        await query(`
            UPDATE departamentos 
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP 
            WHERE id_departamentos = ?
        `, [departamento.id_departamentos]);
        
        // Marcar relacionamentos como deletados também
        await query(`
            UPDATE users_departamentos 
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP 
            WHERE id_departamentos = ?
        `, [departamento.id_departamentos]);
    } catch (error) {
        console.error("Erro ao remover departamento:", error);
        throw error;
    }
}

export async function irParaEndereco(idDepartamento: number | null | string) {
    if (!idDepartamento) {
        throw new Error("O ID do departamento é necessário para redirecionar.");
    }

    redirect(`/departamentos/${idDepartamento}`);
}

export async function verificarAcessoDepartamento(userId: string | number | null, departamentoId: number): Promise<boolean> {
    try {
        const result = await query(`
            SELECT 1
            FROM users_departamentos ud
            JOIN departamentos d ON ud.id_departamentos = d.id_departamentos
            WHERE ud.id_users = ? AND ud.id_departamentos = ? 
            AND ud.status = 'ativo' AND d.status != 'deletado'
            LIMIT 1
        `, [userId, departamentoId]);

        return (result as any[]).length > 0;
    } catch (error) {
        console.error("Erro ao verificar acesso ao departamento:", error);
        return false;
    }
}

export async function obterRoleUsuarioDepartamento(userId: string, departamentoId: number): Promise<'owner' | 'admin' | 'member' | null> {
    try {
        const result = await query(`
            SELECT role
            FROM users_departamentos
            WHERE id_users = ? AND id_departamentos = ? AND status = 'ativo'
            LIMIT 1
        `, [userId, departamentoId]);

        const roleArray = result as any[];
        return roleArray.length > 0 ? roleArray[0].role : null;
    } catch (error) {
        console.error("Erro ao obter role do usuário:", error);
        return null;
    }
}