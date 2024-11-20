'use server'

import { sql } from "drizzle-orm";
import db from "./db";

export async function enviarConvite(
    idDepartamento: number,
    idRemetente: string,
    idDestinatario: string
): Promise<void> {
    try {
        // Verifica se já existe um convite pendente
        const [conviteExistente] = await db.execute(
            sql`
                SELECT * 
                FROM chaves_estrangeiras.convites 
                WHERE id_departamentos = ${idDepartamento} 
                AND id_destinatario = ${idDestinatario} 
                AND status = 'pendente'
            `
        );

        if (conviteExistente) {
            throw new Error("O usuário já foi convidado para este departamento.");
        }

        // Insere o convite na tabela
        await db.execute(
            sql`
                INSERT INTO chaves_estrangeiras.convites (
                    id_departamentos, id_remetente, id_destinatario
                ) VALUES (
                    ${idDepartamento}, ${idRemetente}, ${idDestinatario}
                )
            `
        );
    } catch (error) {
        console.error("Erro ao enviar convite:", error);
        throw new Error("Não foi possível enviar o convite.");
    }
}


export async function listarConvites(idUsuario: string): Promise<any[]> {
    try {
        const convites = await db.execute(
            sql`
                SELECT c.*, d.titulo AS departamento_titulo, u.nome AS remetente_nome
                FROM chaves_estrangeiras.convites AS c
                JOIN departamentos.departamentos AS d ON c.id_departamentos = d.id_departamentos
                JOIN next_auth.users AS u ON c.id_remetente = u.id
                WHERE c.id_destinatario = ${idUsuario}
                ORDER BY c.criado_em DESC
            `
        );

        return convites;
    } catch (error) {
        console.error("Erro ao listar convites:", error);
        return [];
    }
}

export async function responderConvite(idConvite: number, status: "aceito" | "recusado"): Promise<void> {
    try {
        // Atualiza o status do convite
        await db.execute(
            sql`
                UPDATE chaves_estrangeiras.convites
                SET status = ${status}
                WHERE id = ${idConvite}
            `
        );

        if (status === "aceito") {
            // Busca os dados do convite aceito
            const [convite] = await db.execute(
                sql`
                    SELECT id_departamentos, id_destinatario 
                    FROM chaves_estrangeiras.convites 
                    WHERE id = ${idConvite}
                `
            );

            // Adiciona o usuário à tabela `users_departamentos`
            await db.execute(
                sql`
                    INSERT INTO chaves_estrangeiras.users_departamentos (id_users, id_departamentos)
                    VALUES (${convite.id_destinatario}, ${convite.id_departamentos})
                `
            );
        }
    } catch (error) {
        console.error("Erro ao responder convite:", error);
        throw new Error("Não foi possível responder ao convite.");
    }
}





export async function getConviteDetalhes(idConvite: number): Promise<any | null> {
    try {
        const [convite] = await db.execute(
            sql`
                SELECT c.*, d.titulo AS departamento_titulo, u.nome AS remetente_nome
                FROM chaves_estrangeiras.convites AS c
                JOIN departamentos.departamentos AS d ON c.id_departamentos = d.id_departamentos
                JOIN next_auth.users AS u ON c.id_remetente = u.id
                WHERE c.id = ${idConvite}
            `
        );

        return convite || null;
    } catch (error) {
        console.error("Erro ao buscar detalhes do convite:", error);
        return null;
    }
}
