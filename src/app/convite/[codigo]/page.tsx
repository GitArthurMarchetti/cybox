'use server';

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/mysql";

export default async function ConviteHandler({ params }: { params: { codigo: string } }) {
    const session = await auth();
    const { codigo } = params;

    const convitesExternos = await query(`
        SELECT ce.*, d.titulo as departamento_titulo, u.nome as remetente_nome
        FROM convites_externos ce
        JOIN departamentos d ON ce.id_departamentos = d.id_departamentos
        JOIN users u ON ce.id_remetente = u.id
        WHERE ce.codigo_convite = ? AND ce.status = 'pendente' AND ce.data_expiracao > NOW()
    `, [codigo]) as any[];

    let convitesInternos = [];
    if (convitesExternos.length === 0) {
        convitesInternos = await query(`
            SELECT c.*, d.titulo as departamento_titulo, u.nome as remetente_nome
            FROM convites c
            JOIN departamentos d ON c.id_departamentos = d.id_departamentos
            JOIN users u ON c.id_remetente = u.id
            WHERE c.codigo_convite = ? AND c.status = 'pendente' AND c.data_expiracao > NOW()
        `, [codigo]) as any[];
    }

    let departamentoDireto = [];
    if (convitesExternos.length === 0 && convitesInternos.length === 0) {
        departamentoDireto = await query(`
            SELECT d.*, d.titulo as departamento_titulo
            FROM departamentos d
            WHERE d.codigo_convite = ? AND d.status = 'ativo'
        `, [codigo]) as any[];
    }

    const convite = convitesExternos[0] || convitesInternos[0] || departamentoDireto[0];

    if (!convite) {
        return (
            <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
                <div className="bg-[#1F1F1F] p-8 rounded-xl text-center max-w-md">
                    <h1 className="text-white text-xl mb-4">Convite Inválido</h1>
                    <p className="text-[#8C8888] mb-6">Este convite não existe, já foi utilizado ou expirou.</p>
                    <a href="/login" className="bg-[#F6CF45] text-black px-6 py-3 rounded-lg font-medium">
                        Fazer Login
                    </a>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        redirect(`/login?callbackUrl=/convite/${codigo}`);
    }

    const userId = session.user.id as string;
    const conviteExterno = convitesExternos[0];
    const departamentoDirecto = departamentoDireto[0];

    if (conviteExterno) {
        if (conviteExterno.email_destinatario !== session.user.email) {
            return (
                <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
                    <div className="bg-[#1F1F1F] p-8 rounded-xl text-center max-w-md">
                        <h1 className="text-white text-xl mb-4">Email Incorreto</h1>
                        <p className="text-[#8C8888] mb-6">
                            Este convite foi enviado para {conviteExterno.email_destinatario}, 
                            mas você está logado como {session.user.email}.
                        </p>
                        <a href="/login" className="bg-[#F6CF45] text-black px-6 py-3 rounded-lg font-medium">
                            Trocar Conta
                        </a>
                    </div>
                </div>
            );
        }

        await query(`UPDATE convites_externos SET status = 'aceito' WHERE codigo_convite = ?`, [codigo]);
    } else if (convitesInternos[0]) {
        await query(`UPDATE convites SET status = 'aceito' WHERE codigo_convite = ?`, [codigo]);
    }

    const jaExiste = await query(`
        SELECT id FROM users_departamentos 
        WHERE id_users = ? AND id_departamentos = ? AND status = 'ativo'
    `, [userId, convite.id_departamentos]) as any[];

    if (jaExiste.length === 0) {
        await query(`
            INSERT INTO users_departamentos (id_users, id_departamentos, role, status)
            VALUES (?, ?, 'member', 'ativo')
        `, [userId, convite.id_departamentos]);
    }

    redirect(`/departamentos/${convite.id_departamentos}`);
}