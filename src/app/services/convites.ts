'use server'

import { query } from '@/lib/mysql';
import { getUsersByEmail } from './user';

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

        // Gerar código de convite único
        const codigo_convite = `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        
        // Data de expiração: 7 dias a partir de agora
        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + 7);

        // Insere o convite na tabela
        await query(
            `INSERT INTO convites (
                id_departamentos, id_remetente, id_destinatario, codigo_convite, data_expiracao
            ) VALUES (?, ?, ?, ?, ?)`,
            [idDepartamento, idRemetente, idDestinatario, codigo_convite, dataExpiracao.toISOString().slice(0, 19).replace('T', ' ')]
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
             WHERE c.id_destinatario = ? AND d.status != 'deletado' AND u.status != 'deletado'
             AND (c.data_expiracao IS NULL OR c.data_expiracao > NOW())
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
             SET status = ?, updated_at = CURRENT_TIMESTAMP
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

            // Verifica se o usuário já não está no departamento
            const jaExiste = await query(
                `SELECT id FROM users_departamentos 
                 WHERE id_users = ? AND id_departamentos = ? AND status = 'ativo'
                 LIMIT 1`,
                [convite.id_destinatario, convite.id_departamentos]
            );

            if ((jaExiste as any[]).length === 0) {
                // Adiciona o usuário à tabela `users_departamentos` com role 'member'
                await query(
                    `INSERT INTO users_departamentos (id_users, id_departamentos, role, status)
                     VALUES (?, ?, 'member', 'ativo')`,
                    [convite.id_destinatario, convite.id_departamentos]
                );
            }
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
             WHERE c.id = ? AND d.status != 'deletado' AND u.status != 'deletado'
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

export async function enviarConvitesPorEmail(
    idDepartamento: number,
    idRemetente: string,
    emails: string[]
): Promise<{ success: boolean; message: string; enviados: number }> {
    try {
        let enviados = 0;
        const erros: string[] = [];

        for (const email of emails) {
            try {
                // Busca o usuário pelo email
                const usuario = await getUsersByEmail(email);
                
                if (!usuario) {
                    erros.push(`Usuário com email ${email} não encontrado no sistema`);
                    continue;
                }

                // Verifica se o usuário já está no departamento
                const jaEstaNoDepartamento = await query(
                    `SELECT * FROM users_departamentos 
                     WHERE id_users = ? AND id_departamentos = ? AND status = 'ativo'
                     LIMIT 1`,
                    [usuario.id, idDepartamento]
                );

                if ((jaEstaNoDepartamento as any[]).length > 0) {
                    erros.push(`${email} já é membro do departamento`);
                    continue;
                }

                // Envia o convite
                await enviarConvite(idDepartamento, idRemetente, usuario.id as string);
                enviados++;
            } catch (error) {
                console.error(`Erro ao enviar convite para ${email}:`, error);
                erros.push(`Erro ao enviar convite para ${email}`);
            }
        }

        if (enviados === 0) {
            return {
                success: false,
                message: erros.join(', '),
                enviados: 0
            };
        }

        return {
            success: true,
            message: erros.length > 0 
                ? `${enviados} convite(s) enviado(s). Erros: ${erros.join(', ')}` 
                : `${enviados} convite(s) enviado(s) com sucesso!`,
            enviados
        };
    } catch (error) {
        console.error("Erro ao enviar convites por email:", error);
        throw new Error("Não foi possível enviar os convites.");
    }
}