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

        // Verifica se o usuário já existe
        const existingUser = await getUsersByEmail(email);
        if (existingUser) {
            throw new Error('Este email já está em uso.');
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        const userId = uuidv4(); // Gera um UUID para o novo usuário

        await query(
            'INSERT INTO users (id, nome, email, senha, google_id) VALUES (?, ?, ?, ?, ?)',
            [userId, nome, email, hashedSenha, googleId || null]
        );

        // Em vez de redirecionar, retorna sucesso
        return { success: true, userId };
    } catch (error: any) {
        console.error('Erro ao salvar usuário:', error);
        throw new Error(error.message || 'Erro ao processar o cadastro.');
    }
}

export async function removeUser(user: UserType) {
    try {
        if (!user.id) {
            throw new Error('ID do usuário é necessário para deletar.');
        }

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
            SELECT u.*
            FROM users AS u
            JOIN users_departamentos AS ud ON u.id = ud.id_users
            WHERE ud.id_departamentos = ?
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
            WHERE ud.id_departamentos = ? AND ud.is_host = true
            LIMIT 1
        `, [departamentoId]);

        const userArray = users as UserType[];
        return userArray.length > 0 ? userArray[0] : null;
    } catch (error) {
        console.error("Erro ao buscar host do departamento:", error);
        return null;
    }
}