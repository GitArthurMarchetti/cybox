'use server'

import { query } from '@/lib/mysql';
import { ConviteDetalhadoType } from '@/lib/types/types';
import { sendEmail, createInviteEmailTemplate } from '@/lib/email';
import { findUserByEmail } from '@/lib/users';
import { requireDepartamentoRole, requireUserId } from '@/lib/authz';
import { gerarCodigo } from '@/lib/codigos';

const MAX_CONVITES_POR_ENVIO = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function gerarCodigoConvite(): string {
    return gerarCodigo('INV');
}

function dataExpiracaoConvite(): string {
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 7);
    return dataExpiracao.toISOString().slice(0, 19).replace('T', ' ');
}

export async function enviarConvite(idDepartamento: number, idDestinatario: string): Promise<void> {
    try {
        const { userId: idRemetente } = await requireDepartamentoRole(idDepartamento);

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

        await query(
            `INSERT INTO convites (
                id_departamentos, id_remetente, id_destinatario, codigo_convite, data_expiracao
            ) VALUES (?, ?, ?, ?, ?)`,
            [idDepartamento, idRemetente, idDestinatario, gerarCodigoConvite(), dataExpiracaoConvite()]
        );
    } catch (error) {
        throw new Error("Não foi possível enviar o convite.");
    }
}

export async function listarConvites(): Promise<ConviteDetalhadoType[]> {
    try {
        const idUsuario = await requireUserId();

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
        if (status !== "aceito" && status !== "recusado") {
            throw new Error("Status inválido.");
        }

        const idUsuario = await requireUserId();

        const convites = await query(
            `SELECT id_departamentos, id_destinatario
             FROM convites
             WHERE id = ? AND id_destinatario = ? AND status = 'pendente'
             AND id_destinatario IN (SELECT id FROM users WHERE email_verificado_em IS NOT NULL)
             AND (data_expiracao IS NULL OR data_expiracao > NOW())
             AND id_departamentos IN (SELECT id_departamentos FROM departamentos WHERE status = 'ativo')
             LIMIT 1`,
            [idConvite, idUsuario]
        );

        if ((convites as unknown[]).length === 0) {
            throw new Error("Convite não encontrado.");
        }

        const convite = (convites as { id_departamentos: number; id_destinatario: string }[])[0];

        await query(
            `UPDATE convites
             SET status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [status, idConvite]
        );

        if (status === "aceito") {
            await query(
                `INSERT INTO users_departamentos (id_users, id_departamentos, role, status)
                 VALUES (?, ?, 'member', 'ativo')
                 ON DUPLICATE KEY UPDATE
                     role = IF(status = 'ativo', role, 'member'),
                     status = 'ativo'`,
                [convite.id_destinatario, convite.id_departamentos]
            );
        }
    } catch (error) {
        throw new Error("Não foi possível responder ao convite.");
    }
}

export async function getConviteDetalhes(idConvite: number): Promise<ConviteDetalhadoType | null> {
    try {
        const idUsuario = await requireUserId();

        const convites = await query(
            `SELECT c.*, d.titulo AS departamento_titulo, u.nome AS remetente_nome
             FROM convites AS c
             JOIN departamentos AS d ON c.id_departamentos = d.id_departamentos
             JOIN users AS u ON c.id_remetente = u.id
             WHERE c.id = ? AND (c.id_destinatario = ? OR c.id_remetente = ?)
             AND d.status != 'deletado' AND u.status != 'deletado'
             LIMIT 1`,
            [idConvite, idUsuario, idUsuario]
        );

        const conviteArray = convites as ConviteDetalhadoType[];
        return conviteArray.length > 0 ? conviteArray[0] : null;
    } catch (error) {
        return null;
    }
}

export async function enviarConvitesPorEmail(
    idDepartamento: number,
    emails: string[]
): Promise<{ success: boolean; message: string; enviados: number }> {
    try {
        const { userId: idRemetente } = await requireDepartamentoRole(idDepartamento);

        const dados = await query(
            `SELECT d.titulo AS departamento_nome, u.nome AS remetente_nome
             FROM departamentos AS d, users AS u
             WHERE d.id_departamentos = ? AND u.id = ?
             LIMIT 1`,
            [idDepartamento, idRemetente]
        ) as { departamento_nome: string; remetente_nome: string }[];

        if (dados.length === 0) {
            throw new Error("Departamento não encontrado.");
        }

        const { departamento_nome: departamentoNome, remetente_nome: remetenteNome } = dados[0];

        const emailsNormalizados = Array.from(new Set(emails.map(email => email.trim().toLowerCase())));
        const erros: string[] = [];

        if (emailsNormalizados.length > MAX_CONVITES_POR_ENVIO) {
            return {
                success: false,
                message: `Envie no máximo ${MAX_CONVITES_POR_ENVIO} convites por vez.`,
                enviados: 0
            };
        }

        let enviados = 0;

        for (const email of emailsNormalizados) {
            if (!EMAIL_REGEX.test(email)) {
                erros.push(`${email} não é um email válido`);
                continue;
            }

            try {
                const usuario = await findUserByEmail(email);
                const codigo_convite = gerarCodigoConvite();

                const convitePendente = await query(
                    `SELECT 1 FROM convites c
                     JOIN users u ON c.id_destinatario = u.id
                     WHERE c.id_departamentos = ? AND u.email = ? AND c.status = 'pendente' AND c.data_expiracao > NOW()
                     UNION
                     SELECT 1 FROM convites_externos
                     WHERE id_departamentos = ? AND email_destinatario = ? AND status = 'pendente' AND data_expiracao > NOW()
                     LIMIT 1`,
                    [idDepartamento, email, idDepartamento, email]
                );

                if ((convitePendente as unknown[]).length > 0) {
                    erros.push(`${email} já tem um convite pendente`);
                    continue;
                }

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

                    await query(
                        `INSERT INTO convites (
                            id_departamentos, id_remetente, id_destinatario, codigo_convite, data_expiracao
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [idDepartamento, idRemetente, usuario.id, codigo_convite, dataExpiracaoConvite()]
                    );
                } else {
                    await query(
                        `INSERT INTO convites_externos (
                            id_departamentos, id_remetente, email_destinatario, codigo_convite, data_expiracao
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [idDepartamento, idRemetente, email, codigo_convite, dataExpiracaoConvite()]
                    );
                }

                const inviteLink = `${process.env.NEXTAUTH_URL}/convite/${codigo_convite}`;

                const emailHtml = createInviteEmailTemplate(
                    departamentoNome,
                    remetenteNome,
                    inviteLink
                );

                await sendEmail({
                    to: email,
                    subject: `Convite para o departamento ${departamentoNome} - Cybox`,
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
