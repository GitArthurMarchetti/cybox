export interface PatrimonioDetalhes {
    id?: number;
    name: string;
    codigo?: string;
    finalValue: number;
    especificacoes?: string | null;
    data_aquisicao?: string;
    local?: string | null;
    preco_inicial?: number;
    valor_atual?: number;
    depreciacao_percentual?: number;
    depreciacao_valor?: number;
    gastos_totais?: number;
    status?: number;
    gastos?: PatrimonioGasto[];
    depreciacao_historico?: DepreciacaoHistorico[];
    gastos_mensais?: GastoMensal[];
}

export interface PatrimonioGasto {
    id: number;
    tipo: string;
    descricao: string;
    valor: number;
    data: string;
}

export interface DepreciacaoHistorico {
    data: string;
    valor: number;
}

export interface GastoMensal {
    mes: string;
    valor: number;
}