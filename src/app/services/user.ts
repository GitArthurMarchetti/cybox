"use server"

import { demo, isDemoSession, DEMO_READ_ONLY } from "@/lib/demo";
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import { UserType } from "@/lib/types/types";
import { v4 as uuidv4 } from 'uuid';
import { enviarEmailRedefinicao, enviarEmailVerificacao, findUserByEmail, podeEnviarRedefinicao, podeReenviarVerificacao } from '@/lib/users';
import { hashToken } from '@/lib/codigos';
import { requireDepartamentoRole, requireUserId } from '@/lib/authz';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_SENHA = 8;

class ErroUsuario extends Error {}

export async function getEmptyUser(): Promise<UserType> {
    return { id: null, nome: "", email: "", senha: "", google_id: null };
}

export async function saveUser(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const nome = (formData.get('nome') as string || '').trim();
        const email = (formData.get('email') as string || '').trim().toLowerCase();
        const senha = formData.get('senha') as string || '';
        const confirmarSenha = formData.get('confirmarSenha') as string;

        if (!nome || !email || !senha) {
            return { success: false, error: 'Fill in your name, email and password.' };
        }

        if (!EMAIL_REGEX.test(email)) {
            return { success: false, error: "That email isn't valid." };
        }

        if (senha.length < TAMANHO_MINIMO_SENHA) {
            return { success: false, error: `Your password needs at least ${TAMANHO_MINIMO_SENHA} characters.` };
        }

        if (senha !== confirmarSenha) {
            return { success: false, error: "Passwords don't match." };
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return { success: false, error: 'That email is already in use.' };
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        const userId = uuidv4();

        await query(
            'INSERT INTO users (id, nome, email, senha, google_id, status) VALUES (?, ?, ?, ?, NULL, "ativo")',
            [userId, nome, email, hashedSenha]
        );

        try {
            await enviarEmailVerificacao({ id: userId, nome, email });
        } catch (error) {
            console.error('Erro ao enviar email de verificação:', error);
        }

        return { success: true };
    } catch (error: unknown) {
        console.error('Erro ao salvar usuário:', error);
        return { success: false, error: "Couldn't create your account." };
    }
}

export async function reenviarVerificacao(emailInformado: string): Promise<{ success: boolean }> {
    try {
        const user = await findUserByEmail(emailInformado);

        if (user?.id && user.senha && !user.email_verificado_em && user.status === 'ativo'
            && await podeReenviarVerificacao(user.id)) {
            await enviarEmailVerificacao({ id: user.id, nome: user.nome, email: user.email });
        }
    } catch (error) {
        console.error('Erro ao reenviar verificação:', error);
    }

    return { success: true };
}

export async function getHostByDepartamento(departamentoId: number): Promise<UserType | null> {
    if (await isDemoSession()) return demo.host(departamentoId);
    try {
        if (!departamentoId || departamentoId <= 0) {
            throw new Error("ID do departamento inválido.");
        }

        await requireDepartamentoRole(departamentoId);

        const users = await query(`
            SELECT u.id, u.nome, u.email, u.avatar_url
            FROM users AS u
            JOIN users_departamentos AS ud ON u.id = ud.id_users
            WHERE ud.id_departamentos = ? AND ud.role = "owner"
            LIMIT 1
        `, [departamentoId]);

        const userArray = users as UserType[];
        return userArray.length > 0 ? userArray[0] : null;
    } catch (error) {
        console.error("Erro ao buscar host do departamento:", error);
        return null;
    }
}

export async function updateUser(data: {
    nome?: string;
    email?: string;
    senhaAtual?: string;
    novaSenha?: string;
    avatar_url?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
    if (await isDemoSession()) return { success: false, error: DEMO_READ_ONLY };
    try {
        const userId = await requireUserId();

        const user = await query('SELECT * FROM users WHERE id = ?', [userId]) as UserType[];
        if (!user || user.length === 0) {
            throw new ErroUsuario('Account not found.');
        }

        const currentUser = user[0];
        const updates: string[] = [];
        const values: string[] = [];

        if (data.nome && data.nome !== currentUser.nome) {
            updates.push('nome = ?');
            values.push(data.nome);
        }

        const novoEmail = data.email?.trim().toLowerCase();
        const emailAlterado = !!novoEmail && novoEmail !== currentUser.email.toLowerCase();

        if (novoEmail && emailAlterado) {
            if (!EMAIL_REGEX.test(novoEmail)) {
                throw new ErroUsuario("That email isn't valid.");
            }

            const existingUser = await findUserByEmail(novoEmail);
            if (existingUser && existingUser.id !== userId) {
                throw new ErroUsuario('That email is already in use.');
            }

            updates.push('email = ?', 'email_verificado_em = NULL');
            values.push(novoEmail);
        }

        if (data.novaSenha) {
            if (!data.senhaAtual) {
                throw new ErroUsuario('Enter your current password to set a new one.');
            }

            if (data.novaSenha.length < TAMANHO_MINIMO_SENHA) {
                throw new ErroUsuario(`Your new password needs at least ${TAMANHO_MINIMO_SENHA} characters.`);
            }

            if (!currentUser.senha) {
                throw new ErroUsuario("Accounts that sign in with Google can't change a password here.");
            }

            const senhaValida = await bcrypt.compare(data.senhaAtual, currentUser.senha);
            if (!senhaValida) {
                throw new ErroUsuario('Your current password is incorrect.');
            }

            const hashedNovaSenha = await bcrypt.hash(data.novaSenha, 10);
            updates.push('senha = ?');
            values.push(hashedNovaSenha);
        }

        if (data.avatar_url !== undefined) {
            updates.push('avatar_url = ?');
            values.push(data.avatar_url);
        }

        if (updates.length === 0) {
            return { success: true, message: 'Nothing changed.' };
        }

        values.push(userId);
        const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

        await query(sql, values);

        if (novoEmail && emailAlterado) {
            await enviarEmailVerificacao({ id: userId, nome: data.nome || currentUser.nome, email: novoEmail });
            return { success: true, message: 'Saved! Confirm your new email with the link we just sent.' };
        }

        return { success: true, message: 'Your details were saved.' };
    } catch (error: unknown) {
        if (error instanceof ErroUsuario) {
            return { success: false, error: error.message };
        }
        console.error('Erro ao atualizar usuário:', error);
        return { success: false, error: "Couldn't update your details." };
    }
}

export async function getMinhaConta(): Promise<{ nome: string; email: string; temSenha: boolean; temGoogle: boolean; emailVerificado: boolean } | null> {
    if (await isDemoSession()) return demo.account();
    try {
        const userId = await requireUserId();
        const users = await query(
            'SELECT nome, email, senha, google_id, email_verificado_em FROM users WHERE id = ? LIMIT 1',
            [userId]
        ) as UserType[];

        if (users.length === 0) return null;

        const user = users[0];
        return {
            nome: user.nome,
            email: user.email,
            temSenha: !!user.senha,
            temGoogle: !!user.google_id,
            emailVerificado: !!user.email_verificado_em,
        };
    } catch (error) {
        console.error('Erro ao buscar conta:', error);
        return null;
    }
}

export async function solicitarRedefinicaoSenha(emailInformado: string): Promise<{ success: boolean }> {
    try {
        const user = await findUserByEmail(emailInformado);

        if (user?.id && user.status === 'ativo' && await podeEnviarRedefinicao(user.id)) {
            await enviarEmailRedefinicao({ id: user.id, nome: user.nome, email: user.email });
        }
    } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error);
    }

    return { success: true };
}

export async function redefinirSenha(token: string, novaSenha: string, confirmacao: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!novaSenha || novaSenha.length < TAMANHO_MINIMO_SENHA) {
            return { success: false, error: `Your password needs at least ${TAMANHO_MINIMO_SENHA} characters.` };
        }

        if (novaSenha !== confirmacao) {
            return { success: false, error: "Passwords don't match." };
        }

        const hash = await bcrypt.hash(novaSenha, 10);
        const result = await query(`
            UPDATE users
            SET senha = ?,
                token_redefinicao = NULL,
                token_redefinicao_expira = NULL,
                email_verificado_em = COALESCE(email_verificado_em, NOW()),
                tentativas_login = 0,
                bloqueado_ate = NULL,
                sessao_minima_em = NOW()
            WHERE token_redefinicao = ? AND token_redefinicao_expira > NOW() AND status = 'ativo'
        `, [hash, hashToken(token)]);

        if ((result as { affectedRows: number }).affectedRows === 0) {
            return { success: false, error: 'This link has expired or was already used. Request a new one.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        return { success: false, error: "Couldn't reset your password." };
    }
}
