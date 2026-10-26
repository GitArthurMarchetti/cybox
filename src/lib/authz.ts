import { auth } from "@/auth";
import { query } from "@/lib/mysql";

export type DepartamentoRole = 'owner' | 'admin' | 'member';

const TODOS_OS_PAPEIS: DepartamentoRole[] = ['owner', 'admin', 'member'];

export interface AcessoDepartamento {
    userId: string;
    role: DepartamentoRole;
    departamentoId: number;
}

export async function requireUserId(): Promise<string> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("Não autorizado.");
    }

    const valida = await query(`
        SELECT 1 FROM users
        WHERE id = ? AND status = 'ativo'
        AND (sessao_minima_em IS NULL OR ? >= UNIX_TIMESTAMP(sessao_minima_em))
        LIMIT 1
    `, [userId, session.emitidaEm ?? 0]);

    if ((valida as unknown[]).length === 0) {
        throw new Error("Não autorizado.");
    }

    return userId;
}

export async function getRoleNoDepartamento(userId: string, departamentoId: number): Promise<DepartamentoRole | null> {
    const result = await query(`
        SELECT ud.role
        FROM users_departamentos ud
        JOIN departamentos d ON ud.id_departamentos = d.id_departamentos
        WHERE ud.id_users = ? AND ud.id_departamentos = ?
        AND ud.status = 'ativo' AND d.status != 'deletado'
        LIMIT 1
    `, [userId, departamentoId]);

    const roleArray = result as { role: DepartamentoRole }[];
    return roleArray.length > 0 ? roleArray[0].role : null;
}

export async function requireDepartamentoRole(
    departamentoId: number,
    papeis: DepartamentoRole[] = TODOS_OS_PAPEIS
): Promise<AcessoDepartamento> {
    const userId = await requireUserId();

    if (!departamentoId) {
        throw new Error("Departamento inválido.");
    }

    const role = await getRoleNoDepartamento(userId, departamentoId);

    if (!role || !papeis.includes(role)) {
        throw new Error("Você não tem permissão para esta ação.");
    }

    return { userId, role, departamentoId };
}

export async function requireCategoriaRole(
    categoriaId: number,
    papeis: DepartamentoRole[] = TODOS_OS_PAPEIS
): Promise<AcessoDepartamento> {
    const result = await query(`
        SELECT id_departamento FROM categorias WHERE id = ? AND status != 'deletado' LIMIT 1
    `, [categoriaId]);

    const categoriaArray = result as { id_departamento: number }[];

    if (categoriaArray.length === 0) {
        throw new Error("Categoria não encontrada.");
    }

    return requireDepartamentoRole(categoriaArray[0].id_departamento, papeis);
}

export async function requirePatrimonioRole(
    patrimonioId: number,
    papeis: DepartamentoRole[] = TODOS_OS_PAPEIS
): Promise<AcessoDepartamento> {
    const result = await query(`
        SELECT c.id_departamento
        FROM patrimonios p
        JOIN categorias c ON p.id_categoria = c.id
        WHERE p.id = ? AND p.status != 'deletado' AND c.status != 'deletado'
        LIMIT 1
    `, [patrimonioId]);

    const patrimonioArray = result as { id_departamento: number }[];

    if (patrimonioArray.length === 0) {
        throw new Error("Patrimônio não encontrado.");
    }

    return requireDepartamentoRole(patrimonioArray[0].id_departamento, papeis);
}
