"use server"

import { query, transaction } from '@/lib/mysql';
import { DepartamentoType } from "@/lib/types/types";
import { getRoleNoDepartamento, requireDepartamentoRole, requireUserId, DepartamentoRole } from "@/lib/authz";
import { gerarCodigo } from "@/lib/codigos";

export async function getDepartamentosByUser(): Promise<DepartamentoType[]> {
    try {
        const userId = await requireUserId();

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

        await requireDepartamentoRole(Number(idDepartamento));

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

export async function saveDepartamento(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const userId = await requireUserId();
        const id_departamentos = +(formData.get('id_departamentos') as string) || null;
        const titulo = (formData.get('titulo') as string || '').trim();
        const descricao = (formData.get('descricao') as string || '').trim() || null;
        const localizacao = (formData.get('localizacao') as string || '').trim() || null;

        if (!titulo) {
            return { success: false, error: 'Informe o nome do departamento.' };
        }

        if (titulo.length > 255 || (localizacao && localizacao.length > 255)) {
            return { success: false, error: 'Nome ou localização muito longos (máximo de 255 caracteres).' };
        }

        if (!id_departamentos) {
            await transaction(async (executar) => {
                const result = await executar(`
                    INSERT INTO departamentos (titulo, descricao, codigo_convite, localizacao, fotoDepartamento, status)
                    VALUES (?, ?, ?, ?, ?, 'ativo')
                `, [titulo, descricao, gerarCodigo('DEPT'), localizacao, "/placeholderImage.jpg"]);

                await executar(`
                    INSERT INTO users_departamentos (id_users, id_departamentos, role, status)
                    VALUES (?, ?, 'owner', 'ativo')
                `, [userId, (result as { insertId: number }).insertId]);
            });
        } else {
            await requireDepartamentoRole(id_departamentos, ['owner', 'admin']);

            await query(`
                UPDATE departamentos SET
                    titulo = ?,
                    descricao = ?,
                    localizacao = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id_departamentos = ? AND status != 'deletado'
            `, [titulo, descricao, localizacao, id_departamentos]);
        }

        return { success: true };
    } catch (error) {
        console.error("Erro ao salvar departamento:", error);
        return { success: false, error: 'Não foi possível salvar o departamento.' };
    }
}

export async function removeDepartamento(departamento: DepartamentoType) {
    try {
        if (!departamento.id_departamentos) {
            throw new Error('O ID do departamento é necessário para deletar.');
        }

        await requireDepartamentoRole(Number(departamento.id_departamentos), ['owner']);

        await transaction(async (executar) => {
            await executar(`
            UPDATE departamentos 
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP 
            WHERE id_departamentos = ?
        `, [departamento.id_departamentos]);
            await executar(`
            UPDATE users_departamentos 
            SET status = 'deletado', updated_at = CURRENT_TIMESTAMP 
            WHERE id_departamentos = ?
        `, [departamento.id_departamentos]);
        });
    } catch (error) {
        console.error("Erro ao remover departamento:", error);
        throw error;
    }
}

export async function regenerarCodigoConvite(departamentoId: number): Promise<string> {
    await requireDepartamentoRole(departamentoId, ['owner', 'admin']);

    const codigo = gerarCodigo('DEPT');

    await query(`
        UPDATE departamentos SET codigo_convite = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id_departamentos = ? AND status != 'deletado'
    `, [codigo, departamentoId]);

    return codigo;
}

export async function verificarAcessoDepartamento(departamentoId: number): Promise<boolean> {
    try {
        const userId = await requireUserId();
        return (await getRoleNoDepartamento(userId, departamentoId)) !== null;
    } catch (error) {
        console.error("Erro ao verificar acesso ao departamento:", error);
        return false;
    }
}

export async function obterRoleUsuarioDepartamento(departamentoId: number): Promise<DepartamentoRole | null> {
    try {
        const userId = await requireUserId();
        return await getRoleNoDepartamento(userId, departamentoId);
    } catch (error) {
        console.error("Erro ao obter role do usuário:", error);
        return null;
    }
}
