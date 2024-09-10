"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation'


type UserType = {
    id: number | null
    nome: string
    email: string
    senha: string
}

export default UserType


export async function getEmptyUser(): Promise<UserType> {
    return { id: null, nome: "", email: "", senha: "" }
}

export async function getUsers(): Promise<UserType[]> {
    try {
        return await db.execute<UserType>(sql`SELECT * FROM "user"`);
    } catch (error) {
        console.error('Erro ao buscar usuários do banco:', error);
        return [];
    }
}

export async function saveUser(formData: FormData) {

    const id = +(formData.get('id') as string) as number
    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string

    if (!nome || !email || !senha) {
        throw new Error('Todos os campos (nome, email, senha) devem estar preenchidos.');
    }

    // Verificar se o email existe (formato básico de email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('O email fornecido não é válido.');
    }

    const senhaRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!senhaRegex.test(senha)) {
        throw new Error('A senha deve conter mais de 5 caracteres e pelo menos 1 caractere especial.');
    }

    const user: UserType = {
        id,
        nome,
        email,
        senha
    }


    if (!id) {
        await db.execute(sql`INSERT INTO "user" (nome, email, senha) VALUES (${user.nome}, ${user.email}, ${user.senha} )`)
    } else {
        await db.execute(sql`UPDATE "user" SET nome=${user.nome}, email=${user.email}, senha=${user.senha} `)
    }


    redirect('/')
}

export async function removeUser(user: UserType) {
    await db.execute(sql`DELETE FROM "user" WHERE id=${user.id}`)

    redirect('/')
}

//LOGIN

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;

    if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios para o login.');
    }

    const [user] = await db.execute<UserType>(sql`SELECT * FROM "user" WHERE email = ${email}`);

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    if (user.senha !== senha) {
        throw new Error('Senha incorreta.');
    }

    //Página depois do login
    redirect('/');
}