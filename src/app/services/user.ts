"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation'
import { startTransition } from "react";
import toast from "react-hot-toast";
import Error from "next/error";
import { signIn } from "@/auth";

const bcrypt = require('bcrypt');

// Ajuste para refletir a estrutura com UUID
type UserType = {
    id: string | null,
    name: string,
    email: string,
    emailVerified: string | null,
    passwordHashed: string  // Mantido para corresponder ao banco de dados
}

export default UserType;


export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if(!email || !password){
        console.error("Coloque suas credenciais")
    }

    try {
        const result = await signIn('Credentials', {

            redirect: false,
            callbackUrl: "/departamentos",
            email,
            password,

        })

        if(!result){
            console.error("Erro no signIn: ", result)
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error; // Lança o erro para ser tratado no componente
    }
}


export async function getEmptyUser(): Promise<UserType> {
    return { id: null, name: "", email: "", emailVerified: null, passwordHashed: "" };
}

export async function getUsers(): Promise<UserType[]> {
    try {
        return await db.execute<UserType>(sql`SELECT * FROM "next_auth"."users"`);
    } catch (error) {
        console.error('Erro ao buscar usuários do banco:', error);
        return [];
    }
}

export async function getUsersByEmail(email: string | null): Promise<UserType | null> {
    try {
        const users = await db.execute<UserType>(sql`SELECT * FROM "next_auth"."users" WHERE email = ${email}`);
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email no banco:', error);
        return null;
    }
}

export async function saveUser(formData: FormData) {

    const id = formData.get('id') as string | null; // UUID é string
    const name = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;
    const confirmarSenha = formData.get('confirmarSenha') as string;

    if (!name || !email || !senha) {
        console.error("As credenciais precisam estar completas")
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('O email fornecido não é válido.');
    }

    // Validação da senha
    const senhaRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!senhaRegex.test(senha)) {
        console.error('A senha deve conter mais de 5 caracteres e pelo menos 1 caractere especial.');
    }

    if (senha !== confirmarSenha) {
        console.error('A confirmação da senha não corresponde à senha.');
    }

    // Fazer o hash da senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    const user: UserType = {
        id,
        name,
        email,
        emailVerified: null,
        passwordHashed: hashedSenha  // Use passwordHashed instead of senha
    };

    if (!id) {
        // Inserção de novo usuário com UUID gerado automaticamente pelo banco
        await db.execute(sql`INSERT INTO "next_auth"."users" (name, email, "passwordHashed") VALUES (${user.name}, ${user.email}, ${user.passwordHashed})`);
    } else {
        // Atualização de um usuário existente
        await db.execute(sql`UPDATE "next_auth"."users" SET name=${user.name}, email=${user.email}, "passwordHashed"=${user.passwordHashed} WHERE id=${user.id}`);
    }
    redirect('/login');

}


export async function removeUser(user: UserType) {
    await db.execute(sql`DELETE FROM "next_auth"."users" WHERE id=${user.id}`);

    redirect('/');
}
