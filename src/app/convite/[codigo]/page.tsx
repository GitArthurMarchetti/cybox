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

    if (session?.provider === "demo") {
        return (
            <PaginaStatus
                icone={<MdSwitchAccount size={28} />}
                titulo="Joining rooms is off in the demo"
                acoes={
                    <>
                        <Link href="/cadastro" className={classeBotaoPrimario}>Create an account</Link>
                        <Link href="/departamentos" className={classeBotaoSecundario}>Back to the demo</Link>
                    </>
                }
            >
                The demo uses sample data, so invite codes don&apos;t work here. Create an account to join your team&apos;s rooms.
            </PaginaStatus>
        );
    }

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
                titulo="This invite isn't valid"
                acoes={
                    <Link href={session?.user ? "/departamentos" : "/login"} className={classeBotaoPrimario}>
                        {session?.user ? "Go to my rooms" : "Log in"}
                    </Link>
                }
            >
                This invite doesn&apos;t exist, was already used or has expired. Ask whoever invited you for a new link.
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
            titulo="Confirm your email first"
            acoes={<ReenviarVerificacao email={usuario.email} />}
        >
            To accept this invite, confirm <strong className="text-white">{usuario.email}</strong> pelo
            link we sent when you signed up, then open this invite again.
        </PaginaStatus>
    );

    const pedirTrocaDeConta = (mensagem: React.ReactNode) => (
        <PaginaStatus
            icone={<MdSwitchAccount size={28} />}
            tom="erro"
            titulo="This invite is for another account"
            acoes={
                <>
                    <Link href={`/login?callbackUrl=/convite/${codigo}`} className={classeBotaoPrimario}>
                        Log in with another account
                    </Link>
                    <Link href="/departamentos" className={classeBotaoSecundario}>
                        Back to my rooms
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
                    This invite was sent to <strong className="text-white">{conviteExterno.email_destinatario}</strong>,
                    but you&apos;re logged in as <strong className="text-white">{usuario.email}</strong>.
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
                <>This invite was sent to someone else. Log in with the account that received it.</>
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