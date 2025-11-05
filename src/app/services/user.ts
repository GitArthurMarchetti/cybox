"use server"

import { query } from '@/lib/mysql';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { UserType } from "@/lib/types/types";
import { v4 as uuidv4 } from 'uuid';

export async function getEmptyUser(): Promise<UserType> {
    return { id: null, nome: "", email: "", senha: "", google_id: null };
}

export async function getUsers(): Promise<UserType[]> {
    try {
        const users = await query('SELECT * FROM users');
        return users as UserType[];
    } catch (error) {
        console.error('Erro ao buscar usuários do banco:', error);
        return [];
    }
}

export async function getUsersByEmail(email: string): Promise<UserType | null> {
    try {
        const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        const userArray = users as UserType[];
        return userArray.length > 0 ? userArray[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email no banco:', error);
        return null;
    }
}

export async function saveUser(formData: FormData, googleId?: string) {
    try {
        const nome = formData.get('nome') as string;
        const email = formData.get('email') as string;
        const senha = formData.get('senha') as string;
        const confirmarSenha = formData.get('confirmarSenha') as string;

        if (!nome || !email || !senha) {
            throw new Error('Todos os campos (nome, email, senha) devem estar preenchidos.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('O email fornecido não é válido.');
        }

        if (senha !== confirmarSenha) {
            throw new Error('A confirmação da senha não corresponde à senha.');
        }

        const existingUser = await getUsersByEmail(email);
        if (existingUser) {
            throw new Error('Este email já está em uso.');
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        const userId = uuidv4();

        await query(
            'INSERT INTO users (id, nome, email, senha, google_id, status) VALUES (?, ?, ?, ?, ?, "ativo")',
            [userId, nome, email, hashedSenha, googleId || null]
        );

        return { success: true, userId };
    } catch (error: unknown) {
        console.error('Erro ao salvar usuário:', error);
        throw new Error((error as Error).message || 'Erro ao processar o cadastro.');
    }
}

export async function removeUser(user: UserType) {
    try {
        if (!user.id) {
            throw new Error('ID do usuário é necessário para deletar.');
        }

        // TODO: Adicionar coluna status antes de usar esta query
        // await query('UPDATE users SET status = "deletado", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
        await query('DELETE FROM users WHERE id = ?', [user.id]);
        redirect('/');
    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        throw error;
    }
}

export async function getUsersByDepartamento(departamentoId: number): Promise<UserType[]> {
    try {
        if (!departamentoId || departamentoId <= 0) {
            throw new Error("ID do departamento inválido.");
        }

        const users = await query(`
            SELECT u.*, ud.role
            FROM users AS u
            JOIN users_departamentos AS ud ON u.id = ud.id_users
            WHERE ud.id_departamentos = ?
            ORDER BY
                CASE ud.role
                    WHEN 'owner' THEN 1
                    WHEN 'admin' THEN 2
                    WHEN 'member' THEN 3
                END,
                u.nome ASC
        `, [departamentoId]);

        return users as UserType[];
    } catch (error) {
        console.error("Erro ao buscar usuários do departamento:", error);
        return [];
    }
}

export async function getHostByDepartamento(departamentoId: number): Promise<UserType | null> {
    try {
        if (!departamentoId || departamentoId <= 0) {
            throw new Error("ID do departamento inválido.");
        }

        const users = await query(`
            SELECT u.*
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

export async function updateUser(userId: string, data: {
    nome?: string;
    email?: string;
    senhaAtual?: string;
    novaSenha?: string;
    avatar_url?: string;
}) {
    try {
        if (!userId) {
            throw new Error('ID do usuário é necessário.');
        }

        const user = await query('SELECT * FROM users WHERE id = ?', [userId]) as UserType[];
        if (!user || user.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        const currentUser = user[0];
        const updates: string[] = [];
        const values: any[] = [];

        if (data.nome && data.nome !== currentUser.nome) {
            updates.push('nome = ?');
            values.push(data.nome);
        }

        if (data.email && data.email !== currentUser.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Email inválido.');
            }

            const existingUser = await getUsersByEmail(data.email);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Este email já está em uso.');
            }

            updates.push('email = ?');
            values.push(data.email);
        }

        if (data.novaSenha) {
            if (!data.senhaAtual) {
                throw new Error('Senha atual é necessária para alterar a senha.');
            }

            if (!currentUser.senha) {
                throw new Error('Não é possível alterar senha para usuários de login social.');
            }

            const senhaValida = await bcrypt.compare(data.senhaAtual, currentUser.senha);
            if (!senhaValida) {
                throw new Error('Senha atual incorreta.');
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
            return { success: true, message: 'Nenhuma alteração detectada.' };
        }

        values.push(userId);
        const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

        await query(sql, values);

        return { success: true, message: 'Dados atualizados com sucesso!' };
    } catch (error: unknown) {
        console.error('Erro ao atualizar usuário:', error);
        throw new Error((error as Error).message || 'Erro ao atualizar dados.');
    }
}