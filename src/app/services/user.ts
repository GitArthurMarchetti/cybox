"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { UserType } from "@/lib/types/types";




export async function getEmptyUser(): Promise<UserType> {
    return { id: null, nome: "", email: "", senha: "", google_id: null }; // Incluído google_id como null no usuário vazio
}

export async function getUsers(): Promise<UserType[]> {
    try {
        return await db.execute<UserType>(sql`SELECT * FROM next_auth.users`); // Inclua o schema "next_auth"
    } catch (error) {
        console.error('Erro ao buscar usuários do banco:', error);
        return [];
    }
}

export async function getUsersByEmail(email: string): Promise<UserType | null> {
    try {
        const [user] = await db.execute<UserType>(
            sql`SELECT * FROM next_auth.users WHERE email = ${email} LIMIT 1`
        ); // Incluído LIMIT 1
        return user || null; // Retorna o usuário ou null se não encontrado
    } catch (error) {
        console.error('Erro ao buscar usuário por email no banco:', error);
        return null;
    }
}



export async function saveUser(formData: FormData, googleId?: string) {
    const id = +(formData.get('id') as string) as number;
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

    const confirmedSenha = senha == confirmarSenha;
    if (!confirmarSenha) {
        throw new Error('A confirmação da senha não corresponde à senha.');
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const user: UserType = {
        id,
        nome,
        email,

        senha: hashedSenha,
        google_id: googleId || null // Incluído o google_id na criação do usuário

    };

    if (!id) {
        await db.execute(sql`INSERT INTO next_auth.users (nome, email, senha, google_id) VALUES (${user.nome}, ${user.email}, ${user.senha}, ${user.google_id})`); // Incluído o campo google_id
    } else {

        await db.execute(sql`UPDATE next_auth.users SET nome=${user.nome}, email=${user.email}, senha=${user.senha}, google_id=${user.google_id} WHERE id_users=${user.id}`); // Incluído o campo google_id

    }

    redirect('/login');
}

export async function removeUser(user: UserType) {
    await db.execute(sql`DELETE FROM next_auth.users WHERE id=${user.id}`); // Inclua o schema "next_auth"

    redirect('/');
}


export async function getUsersByDepartamento(departamentoId: number): Promise<UserType[]> {
    try {
        // Valida o ID do departamento
        if (!departamentoId || departamentoId <= 0) {
            throw new Error("ID do departamento inválido.");
        }

        // Consulta os usuários associados ao departamento
        const users = await db.execute<UserType>(
            sql`
                SELECT u.*
                FROM next_auth.users AS u
                JOIN chaves_estrangeiras.users_departamentos AS ud
                ON u.id = ud.id_users
                WHERE ud.id_departamentos = ${departamentoId}
            `
        );

        return users;
    } catch (error) {
        console.error("Erro ao buscar usuários do departamento:", error);
        return [];
    }
}


export async function getHostByDepartamento(departamentoId: number): Promise<UserType | null> {
    try {
        console.log("ID recebido na função getHostByDepartamento:", departamentoId);
        if (!departamentoId || departamentoId <= 0) {
            throw new Error("ID do departamento inválido.");
        }

        const [host] = await db.execute<UserType>(
            sql`
                SELECT u.*
                FROM next_auth.users AS u
                JOIN chaves_estrangeiras.users_departamentos AS ud
                ON u.id = ud.id_users
                WHERE ud.id_departamentos = ${departamentoId}
                AND ud.is_host = TRUE
            `
        );

        console.log("Host retornado:", host);

        return host || null;
    } catch (error) {
        console.error("Erro ao buscar host do departamento:", error);
        return null;
    }
}
