'use server'

import { query } from '@/lib/mysql';
import { getUsersByEmail } from './user';
import { ConviteDetalhadoType } from '@/lib/types/types';
import { sendEmail, createInviteEmailTemplate } from '@/lib/email';

export async function enviarConvite(
    idDepartamento: number,
    idRemetente: string,
    idDestinatario: string
): Promise<void> {
    try {
        const conviteExistente = await query(
            `SELECT * 
             FROM convites 
             WHERE id_departamentos = ? 
             AND id_destinatario = ? 
             AND status = 'pendente'
             LIMIT 1`,
            [idDepartamento, idDestinatario]
        );

        if ((conviteExistente as unknown[]).length > 0) {
            throw new Error("O usuário já foi convidado para este departamento.");
        }

        const codigo_convite = `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + 7);

        await query(
            `INSERT INTO convites (
                id_departamentos, id_remetente, id_destinatario, codigo_convite, data_expiracao
            ) VALUES (?, ?, ?, ?, ?)`,
            [idDepartamento, idRemetente, idDestinatario, codigo_convite, dataExpiracao.toISOString().slice(0, 19).replace('T', ' ')]
        );
    } catch (error) {
        throw new Error("Não foi possível enviar o convite.");
    }
}

export async function listarConvites(idUsuario: string): Promise<ConviteDetalhadoType[]> {
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

        return convites as ConviteDetalhadoType[];
    } catch (error) {
        return [];
    }
}

export async function responderConvite(idConvite: number, status: "aceito" | "recusado"): Promise<void> {
    try {
        await query(
            `UPDATE convites
             SET status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [status, idConvite]
        );

        if (status === "aceito") {
            const convites = await query(
                `SELECT id_departamentos, id_destinatario 
                 FROM convites 
                 WHERE id = ?
                 LIMIT 1`,
                [idConvite]
            );

            if ((convites as unknown[]).length === 0) {
                throw new Error("Convite não encontrado.");
            }

            const convite = (convites as { id_departamentos: number; id_destinatario: string }[])[0];

            const jaExiste = await query(
                `SELECT id FROM users_departamentos 
                 WHERE id_users = ? AND id_departamentos = ? AND status = 'ativo'
                 LIMIT 1`,
                [convite.id_destinatario, convite.id_departamentos]
            );

            if ((jaExiste as unknown[]).length === 0) {
                await query(
                    `INSERT INTO users_departamentos (id_users, id_departamentos, role, status)
                     VALUES (?, ?, 'member', 'ativo')`,
                    [convite.id_destinatario, convite.id_departamentos]
                );
            }
        }
    } catch (error) {
        throw new Error("Não foi possível responder ao convite.");
    }
}

export async function getConviteDetalhes(idConvite: number): Promise<ConviteDetalhadoType | null> {
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

        const conviteArray = convites as ConviteDetalhadoType[];
        return conviteArray.length > 0 ? conviteArray[0] : null;
    } catch (error) {
        return null;
    }
}

export async function enviarConvitesPorEmail(
    idDepartamento: number,
    idRemetente: string,
    emails: string[],
    departmentoNome: string,
    remetenteNome: string
): Promise<{ success: boolean; message: string; enviados: number }> {
    try {
        let enviados = 0;
        const erros: string[] = [];

        for (const email of emails) {
            try {
                const usuario = await getUsersByEmail(email);
                let codigo_convite;

                if (usuario) {
                    const jaEstaNoDepartamento = await query(
                        `SELECT * FROM users_departamentos 
                         WHERE id_users = ? AND id_departamentos = ? AND status = 'ativo'
                         LIMIT 1`,
                        [usuario.id, idDepartamento]
                    );

                    if ((jaEstaNoDepartamento as unknown[]).length > 0) {
                        erros.push(`${email} já é membro do departamento`);
                        continue;
                    }

                    codigo_convite = `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                    const dataExpiracao = new Date();
                    dataExpiracao.setDate(dataExpiracao.getDate() + 7);

                    await query(
                        `INSERT INTO convites (
                            id_departamentos, id_remetente, id_destinatario, codigo_convite, data_expiracao
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [idDepartamento, idRemetente, usuario.id, codigo_convite, dataExpiracao.toISOString().slice(0, 19).replace('T', ' ')]
                    );
                } else {
                    codigo_convite = `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                    const dataExpiracao = new Date();
                    dataExpiracao.setDate(dataExpiracao.getDate() + 7);

                    await query(
                        `INSERT INTO convites_externos (
                            id_departamentos, id_remetente, email_destinatario, codigo_convite, data_expiracao
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [idDepartamento, idRemetente, email, codigo_convite, dataExpiracao.toISOString().slice(0, 19).replace('T', ' ')]
                    );
                }

                const inviteLink = `${process.env.NEXTAUTH_URL}/convite/${codigo_convite}`;

                const emailHtml = createInviteEmailTemplate(
                    departmentoNome,
                    remetenteNome,
                    inviteLink
                );

                await sendEmail({
                    to: email,
                    subject: `Convite para o departamento ${departmentoNome} - Cybox`,
                    html: emailHtml
                });

                enviados++;
            } catch (error) {
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
        throw new Error("Não foi possível enviar os convites.");
    }
}