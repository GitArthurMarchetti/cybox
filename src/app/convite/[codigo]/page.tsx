import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/mysql";
import Link from "next/link";
import { MdErrorOutline, MdMarkEmailUnread, MdSwitchAccount } from "react-icons/md";
import ReenviarVerificacao from "@/app/components/Invite/ReenviarVerificacao";
import { PaginaStatus, classeBotaoPrimario, classeBotaoSecundario } from "@/app/components/PaginaStatus";

export default async function ConviteHandler({ params }: { params: { codigo: string } }) {
    const session = await auth();
    const { codigo } = params;

    const convitesExternos = await query(`
        SELECT ce.*, d.titulo as departamento_titulo, u.nome as remetente_nome
        FROM convites_externos ce
        JOIN departamentos d ON ce.id_departamentos = d.id_departamentos
        JOIN users u ON ce.id_remetente = u.id
        WHERE ce.codigo_convite = ? AND ce.status = 'pendente' AND ce.data_expiracao > NOW() AND d.status = 'ativo'
    `, [codigo]) as any[];

    let convitesInternos = [];
    if (convitesExternos.length === 0) {
        convitesInternos = await query(`
            SELECT c.*, d.titulo as departamento_titulo, u.nome as remetente_nome
            FROM convites c
            JOIN departamentos d ON c.id_departamentos = d.id_departamentos
            JOIN users u ON c.id_remetente = u.id
            WHERE c.codigo_convite = ? AND c.status = 'pendente' AND c.data_expiracao > NOW() AND d.status = 'ativo'
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
            <PaginaStatus
                icone={<MdErrorOutline size={28} />}
                tom="erro"
                titulo="Convite inválido"
                acoes={
                    <Link href={session?.user ? "/departamentos" : "/login"} className={classeBotaoPrimario}>
                        {session?.user ? "Ir para meus departamentos" : "Fazer login"}
                    </Link>
                }
            >
                Este convite não existe, já foi usado ou expirou. Peça um novo link a quem te convidou.
            </PaginaStatus>
        );
    }

    if (!session?.user) {
        redirect(`/login?callbackUrl=/convite/${codigo}`);
    }

    const userId = session.user.id as string;
    const conviteExterno = convitesExternos[0];
    const conviteInterno = convitesInternos[0];

    const usuarios = await query(
        `SELECT email, email_verificado_em FROM users WHERE id = ? AND status = 'ativo' LIMIT 1`,
        [userId]
    ) as { email: string; email_verificado_em: string | null }[];

    if (usuarios.length === 0) {
        redirect(`/login?callbackUrl=/convite/${codigo}`);
    }

    const usuario = usuarios[0];

    const pedirConfirmacaoEmail = () => (
        <PaginaStatus
            icone={<MdMarkEmailUnread size={28} />}
            titulo="Confirme seu email"
            acoes={<ReenviarVerificacao email={usuario.email} />}
        >
            Para aceitar este convite, confirme <strong className="text-white">{usuario.email}</strong> pelo
            link que enviamos no seu cadastro e depois abra este convite de novo.
        </PaginaStatus>
    );

    const pedirTrocaDeConta = (mensagem: React.ReactNode) => (
        <PaginaStatus
            icone={<MdSwitchAccount size={28} />}
            tom="erro"
            titulo="Este convite é para outra conta"
            acoes={
                <>
                    <Link href={`/login?callbackUrl=/convite/${codigo}`} className={classeBotaoPrimario}>
                        Entrar com outra conta
                    </Link>
                    <Link href="/departamentos" className={classeBotaoSecundario}>
                        Voltar aos meus departamentos
                    </Link>
                </>
            }
        >
            {mensagem}
        </PaginaStatus>
    );

    if (conviteExterno) {
        if (conviteExterno.email_destinatario.toLowerCase() !== usuario.email.toLowerCase()) {
            return pedirTrocaDeConta(
                <>
                    Este convite foi enviado para <strong className="text-white">{conviteExterno.email_destinatario}</strong>,
                    mas você está logado como <strong className="text-white">{usuario.email}</strong>.
                </>
            );
        }

        if (!usuario.email_verificado_em) {
            return pedirConfirmacaoEmail();
        }

        await query(`UPDATE convites_externos SET status = 'aceito' WHERE codigo_convite = ?`, [codigo]);
    } else if (conviteInterno) {
        if (conviteInterno.id_destinatario !== userId) {
            return pedirTrocaDeConta(
                <>Este convite foi enviado para outra pessoa. Entre com a conta que recebeu o convite.</>
            );
        }

        if (!usuario.email_verificado_em) {
            return pedirConfirmacaoEmail();
        }

        await query(`UPDATE convites SET status = 'aceito' WHERE codigo_convite = ?`, [codigo]);
    }

    await query(`
        INSERT INTO users_departamentos (id_users, id_departamentos, role, status)
        VALUES (?, ?, 'member', 'ativo')
        ON DUPLICATE KEY UPDATE
            role = IF(status = 'ativo', role, 'member'),
            status = 'ativo'
    `, [userId, convite.id_departamentos]);

    redirect(`/departamentos/${convite.id_departamentos}`);
}