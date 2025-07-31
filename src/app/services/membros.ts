"use server"

import { query } from '@/lib/mysql';

export interface MembroDepartamento {
    id: string | null;
    nome: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    avatar_url?: string | null;
    ultimo_login?: string | null;
    created_at?: string | null;
}

export async function getMembrosPerDepartamento(departamentoId: number | string): Promise<MembroDepartamento[]> {
    try {
        const membros = await query(`
            SELECT 
                u.id,
                u.nome,
                u.email,
                ud.role,
                u.avatar_url,
                u.ultimo_login,
                ud.created_at
            FROM users u
            INNER JOIN users_departamentos ud ON u.id = ud.id_users
            WHERE ud.id_departamentos = ? 
            AND ud.status = 'ativo'
            ORDER BY 
                CASE ud.role 
                    WHEN 'owner' THEN 1 
                    WHEN 'admin' THEN 2 
                    WHEN 'member' THEN 3 
                END,
                u.nome ASC
        `, [departamentoId]);

        return membros as MembroDepartamento[];
    } catch (error) {
        console.error('Erro ao buscar membros do departamento:', error);
        return [];
    }
}