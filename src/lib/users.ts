import { query } from "@/lib/mysql";
import { UserType } from "@/lib/types/types";
import { gerarToken } from "@/lib/codigos";
import { sendEmail, createResetPasswordEmailTemplate, createVerificationEmailTemplate } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export const MAX_TENTATIVAS_LOGIN = 5;
export const MINUTOS_BLOQUEIO_LOGIN = 15;
const SEGUNDOS_ENTRE_REENVIOS = 120;

export interface PerfilGoogle {
    sub: string;
    email: string;
    nome: string;
}

export async function findUserByEmail(email: string): Promise<UserType | null> {
    try {
        const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.trim()]);
        const userArray = users as UserType[];
        return userArray.length > 0 ? userArray[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email no banco:', error);
        return null;
    }
}

export async function findUserByGoogleId(googleId: string): Promise<UserType | null> {
    const users = await query('SELECT * FROM users WHERE google_id = ? LIMIT 1', [googleId]) as UserType[];
    return users.length > 0 ? users[0] : null;
}

export async function enviarEmailVerificacao(user: { id: string; nome: string; email: string }): Promise<void> {
    const { token, hash } = gerarToken();

    await query(`
        UPDATE users
        SET token_verificacao = ?, token_verificacao_expira = DATE_ADD(NOW(), INTERVAL 24 HOUR)
        WHERE id = ?
    `, [hash, user.id]);

    await sendEmail({
        to: user.email,
        subject: 'Confirme seu email - Cybox',
        html: createVerificationEmailTemplate(user.nome, `${process.env.NEXTAUTH_URL}/verificar-email/${token}`)
    });
}

export async function enviarEmailRedefinicao(user: { id: string; nome: string; email: string }): Promise<void> {
    const { token, hash } = gerarToken();

    await query(`
        UPDATE users
        SET token_redefinicao = ?, token_redefinicao_expira = DATE_ADD(NOW(), INTERVAL 1 HOUR)
        WHERE id = ?
    `, [hash, user.id]);

    await sendEmail({
        to: user.email,
        subject: 'Redefinir senha - Cybox',
        html: createResetPasswordEmailTemplate(user.nome, `${process.env.NEXTAUTH_URL}/redefinir-senha/${token}`)
    });
}

export async function podeEnviarRedefinicao(userId: string): Promise<boolean> {
    const result = await query(`
        SELECT 1 FROM users
        WHERE id = ? AND (
            token_redefinicao_expira IS NULL
            OR token_redefinicao_expira < DATE_ADD(NOW(), INTERVAL ${3600 - SEGUNDOS_ENTRE_REENVIOS} SECOND)
        )
    `, [userId]);

    return (result as unknown[]).length > 0;
}

export async function podeReenviarVerificacao(userId: string): Promise<boolean> {
    const result = await query(`
        SELECT 1 FROM users
        WHERE id = ? AND (
            token_verificacao_expira IS NULL
            OR token_verificacao_expira < DATE_ADD(NOW(), INTERVAL ${24 * 3600 - SEGUNDOS_ENTRE_REENVIOS} SECOND)
        )
    `, [userId]);

    return (result as unknown[]).length > 0;
}

export async function estaBloqueado(userId: string): Promise<boolean> {
    const result = await query(
        'SELECT 1 FROM users WHERE id = ? AND bloqueado_ate > NOW()',
        [userId]
    );
    return (result as unknown[]).length > 0;
}

export async function registrarFalhaLogin(userId: string): Promise<void> {
    await query(`
        UPDATE users
        SET bloqueado_ate = IF(tentativas_login + 1 >= ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), bloqueado_ate),
            tentativas_login = IF(tentativas_login + 1 >= ?, 0, tentativas_login + 1)
        WHERE id = ?
    `, [MAX_TENTATIVAS_LOGIN, MINUTOS_BLOQUEIO_LOGIN, MAX_TENTATIVAS_LOGIN, userId]);
}

export async function registrarLoginComSucesso(userId: string): Promise<void> {
    await query(`
        UPDATE users
        SET tentativas_login = 0, bloqueado_ate = NULL, ultimo_login = NOW()
        WHERE id = ?
    `, [userId]);
}

// Vincula ou cria a conta de um login Google. Retorna null quando o login deve ser negado.
export async function resolverUsuarioGoogle(perfil: PerfilGoogle): Promise<UserType | null> {
    const porGoogleId = await findUserByGoogleId(perfil.sub);
    if (porGoogleId) {
        return porGoogleId.status === 'ativo' ? porGoogleId : null;
    }

    const porEmail = await findUserByEmail(perfil.email);

    if (!porEmail) {
        const userId = uuidv4();
        await query(`
            INSERT INTO users (id, nome, email, senha, google_id, status, email_verificado_em)
            VALUES (?, ?, ?, NULL, ?, 'ativo', NOW())
        `, [userId, perfil.nome, perfil.email, perfil.sub]);
        return findUserByGoogleId(perfil.sub);
    }

    if (porEmail.status !== 'ativo' || porEmail.google_id) {
        return null;
    }

    // Sem email verificado, ninguém provou ser dono da conta: a senha pode ter sido
    // definida por outra pessoa antes do dono real, então ela é descartada junto com
    // as sessões abertas com ela.
    await query(`
        UPDATE users
        SET google_id = ?,
            senha = IF(email_verificado_em IS NULL, NULL, senha),
            sessao_minima_em = IF(email_verificado_em IS NULL, NOW(), sessao_minima_em),
            email_verificado_em = COALESCE(email_verificado_em, NOW()),
            token_verificacao = NULL,
            token_verificacao_expira = NULL
        WHERE id = ?
    `, [perfil.sub, porEmail.id]);

    return findUserByGoogleId(perfil.sub);
}
