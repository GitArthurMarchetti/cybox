import { query } from "@/lib/mysql";

export { calcularValorDepreciado, mesesDesde } from "@/lib/depreciacao-calculo";

// A coluna patrimonios.tempo_depreciacao guarda a TAXA ANUAL de depreciação em %
// (ex.: 20 = 20% ao ano, depreciação linear). O valor atual é sempre derivado dela.

export function sqlValorAtual(alias = 'p'): string {
    return `ROUND(GREATEST(0, ${alias}.valor_inicial * (1 - ${alias}.tempo_depreciacao / 100 * GREATEST(0, TIMESTAMPDIFF(MONTH, ${alias}.data_aquisicao, CURDATE())) / 12)), 2)`;
}

export async function atualizarDepreciacaoTodos(): Promise<void> {
    await query(`
        UPDATE patrimonios AS p
        SET p.valor_atual = ${sqlValorAtual('p')}, p.updated_at = CURRENT_TIMESTAMP
        WHERE p.status != 'deletado'
    `);
}
