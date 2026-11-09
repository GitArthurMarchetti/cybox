import Link from "next/link";
import { MdErrorOutline, MdMarkEmailRead } from "react-icons/md";
import { PaginaStatus, classeBotaoPrimario } from "@/app/components/PaginaStatus";
import { query } from "@/lib/mysql";
import { hashToken } from "@/lib/codigos";

async function confirmarEmail(token: string): Promise<boolean> {
    const result = await query(`
        UPDATE users
        SET email_verificado_em = NOW(), token_verificacao = NULL, token_verificacao_expira = NULL
        WHERE token_verificacao = ? AND token_verificacao_expira > NOW()
    `, [hashToken(token)]);

    return (result as { affectedRows: number }).affectedRows > 0;
}

export default async function VerificarEmail({ params }: { params: { token: string } }) {
    const confirmado = await confirmarEmail(params.token);

    return (
        <PaginaStatus
            icone={confirmado ? <MdMarkEmailRead size={28} /> : <MdErrorOutline size={28} />}
            tom={confirmado ? "sucesso" : "erro"}
            titulo={confirmado ? "Email confirmed" : "This link is invalid or expired"}
            acoes={
                <Link href="/departamentos" className={classeBotaoPrimario}>
                    Go to my rooms
                </Link>
            }
        >
            {confirmado
                ? "You can now accept invites to rooms."
                : "This link was already used or has expired. Open the invite you received to request a new one."}
        </PaginaStatus>
    );
}
