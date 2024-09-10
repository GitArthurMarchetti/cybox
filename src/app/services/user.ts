"use server"

import { sql } from "drizzle-orm";
import db from "./db";
import { redirect } from 'next/navigation'


type UserType = {
    id: number | null
    nome: string
    email: string
    senha: string
    resetPasswordToken: string | null
}

export default UserType

// export async function getEmptyUser(): Promise<UserType> {
//     return { id: null, nome: "", email: "", senha: "", resetPasswordToken: "" }
// }
export async function getUsers(): Promise<UserType[]> {
    try {
        return await db.execute<UserType>(sql`SELECT * FROM "user"`);
    } catch (error) {
        console.error('Erro ao buscar usuários do banco:', error);
        return [];
    }
}

// export async function saveUser(formData: FormData) {
//     const id = +(formData.get('id') as string) as number
//     const nome = formData.get('nome') as string
//     const email = formData.get('email') as string
//     const senha = formData.get('senha') as string
//     const resetPasswordToken  = formData.get('resetPasswordToken') as string

//     const user: UserType = {
//         id,
//         nome,
//         email,
//         senha,
//         resetPasswordToken  
//     }

//     if(!id){
//         await db.execute(sql`INSERT INTO user (nome) VALUES (${user.nome})`)
//     }else{
//         await db.execute(sql`UPDATE user SET nome=${user.nome} WHERE id=${user.id}`)
//     }

//     redirect('/')
// }

// export async function removeUser(user: UserType) {

//     await db.execute(sql`DELETE FROM user WHERE id=${user.id}`)

//     redirect('/')
// }