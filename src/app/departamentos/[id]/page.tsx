import { notFound, redirect } from "next/navigation";
import { getDepartamentosById, verificarAcessoDepartamento } from "@/app/services/departamento";
import CategoriaFront from "./front";
import { auth } from "@/auth";
import { UserType } from "@/lib/types/types";
import { getHostByDepartamento } from "@/app/services/user";
import { getMembrosPerDepartamento } from "@/app/services/membros";
import { getCategoriasComTotalPatrimonios } from "@/app/services/categoria";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import { PaginaStatus, classeBotaoPrimario } from "@/app/components/PaginaStatus";



export default async function DepartamentoDetalhes({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const user = {
        id: session.user.id,
        nome: session.user.name || '',
        email: session.user.email || '',
        senha: ''
    } as UserType;
    const departamentoId = Number(params.id);

    if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
        notFound();
    }

    const temAcesso = await verificarAcessoDepartamento(departamentoId);

    if (!temAcesso) {
        return (
            <PaginaStatus
                icone={<FiLock size={24} />}
                tom="erro"
                titulo="You don't have access to this room"
                acoes={
                    <Link href="/departamentos" className={classeBotaoPrimario}>
                        Back to my rooms
                    </Link>
                }
            >
                Ask the room&apos;s owner or an admin to send you an invite code.
            </PaginaStatus>
        );
    }

    const departamentoEscolhido = await getDepartamentosById(departamentoId);

    if (!departamentoEscolhido) {
        notFound();
    }

    const host = await getHostByDepartamento(departamentoId);

    const membros = await getMembrosPerDepartamento(departamentoId);

    const categorias = await getCategoriasComTotalPatrimonios(departamentoId);

    return <CategoriaFront departamento={departamentoEscolhido} user={user} host={host} membros={membros} categorias={categorias} />;
}

