'use server'

import { query } from '@/lib/mysql';

export async function enviarConvite(
    idDepartamento: number,
    idRemetente: string,
    idDestinatario: string
): Promise<void> {
    try {
        // Verifica se já existe um convite pendente
        const conviteExistente = await query(
            `SELECT * 
             FROM convites 
             WHERE id_departamentos = ? 
             AND id_destinatario = ? 
             AND status = 'pendente'
             LIMIT 1`,
            [idDepartamento, idDestinatario]
        );

        if ((conviteExistente as any[]).length > 0) {
            throw new Error("O usuário já foi convidado para este departamento.");
        }

        // Insere o convite na tabela
        await query(
            `INSERT INTO convites (
                id_departamentos, id_remetente, id_destinatario
            ) VALUES (?, ?, ?)`,
            [idDepartamento, idRemetente, idDestinatario]
        );
    } catch (error) {
        console.error("Erro ao enviar convite:", error);
        throw new Error("Não foi possível enviar o convite.");
    }
}

export async function listarConvites(idUsuario: string): Promise<any[]> {
    try {
        const convites = await query(
            `SELECT c.*, d.titulo AS departamento_titulo, u.nome AS remetente_nome
             FROM convites AS c
             JOIN departamentos AS d ON c.id_departamentos = d.id_departamentos
             JOIN users AS u ON c.id_remetente = u.id
             WHERE c.id_destinatario = ?
             ORDER BY c.criado_em DESC`,
            [idUsuario]
        );

        return convites as any[];
    } catch (error) {
        console.error("Erro ao listar convites:", error);
        return [];
    }
}

export async function responderConvite(idConvite: number, status: "aceito" | "recusado"): Promise<void> {
    try {
        // Atualiza o status do convite
        await query(
            `UPDATE convites
             SET status = ?
             WHERE id = ?`,
            [status, idConvite]
        );

        if (status === "aceito") {
            // Busca os dados do convite aceito
            const convites = await query(
                `SELECT id_departamentos, id_destinatario 
                 FROM convites 
                 WHERE id = ?
                 LIMIT 1`,
                [idConvite]
            );

            if ((convites as any[]).length === 0) {
                throw new Error("Convite não encontrado.");
            }

            const convite = (convites as any[])[0];

            // Adiciona o usuário à tabela `users_departamentos`
            await query(
                `INSERT INTO users_departamentos (id_users, id_departamentos)
                 VALUES (?, ?)`,
                [convite.id_destinatario, convite.id_departamentos]
            );

            // Atualiza o total de membros no departamento
            await query(
                `UPDATE departamentos
                 SET totalMembros = totalMembros + 1
                 WHERE id_departamentos = ?`,
                [convite.id_departamentos]
            );
        }
    } catch (error) {
        console.error("Erro ao responder convite:", error);
        throw new Error("Não foi possível responder ao convite.");
    }
}

export async function getConviteDetalhes(idConvite: number): Promise<any | null> {
    try {
        const convites = await query(
            `SELECT c.*, d.titulo AS departamento_titulo, u.nome AS remetente_nome
             FROM convites AS c
             JOIN departamentos AS d ON c.id_departamentos = d.id_departamentos
             JOIN users AS u ON c.id_remetente = u.id
             WHERE c.id = ?
             LIMIT 1`,
            [idConvite]
        );

        const conviteArray = convites as any[];
        return conviteArray.length > 0 ? conviteArray[0] : null;
    } catch (error) {
        console.error("Erro ao buscar detalhes do convite:", error);
        return null;
    }
}