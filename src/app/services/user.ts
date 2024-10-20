"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

type UserType = {
    id: number | null | string,
    nome: string,
    email: string,
    senha: string
};

export default UserType;

export async function getEmptyUser(): Promise<UserType> {
    return { id: null, nome: "", email: "", senha: "" };
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
        const users = await db.execute<UserType>(sql`SELECT * FROM next_auth.users WHERE email = ${email}`); // Inclua o schema "next_auth"
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email no banco:', error);
        return null;
    }
}

export async function saveUser(formData: FormData) {
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

    const confirmedSenha = senha == confirmarSenha
    if (!confirmarSenha) {
        throw new Error('A confirmação da senha não corresponde à senha.');
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const user: UserType = {
        id,
        nome,
        email,
        senha: hashedSenha
    };


    if (!id) {
        await db.execute(sql`INSERT INTO next_auth.users (nome, email, senha) VALUES (${user.nome}, ${user.email}, ${user.senha})`); // Inclua o schema "next_auth"
    } else {
        await db.execute(sql`UPDATE next_auth.users SET nome=${user.nome}, email=${user.email}, senha=${user.senha} WHERE id_users=${user.id}`); // Inclua o schema "next_auth"
    }

    redirect('/login');
}

export async function removeUser(user: UserType) {
    await db.execute(sql`DELETE FROM next_auth.users WHERE id=${user.id}`); // Inclua o schema "next_auth"

    redirect('/');
}
