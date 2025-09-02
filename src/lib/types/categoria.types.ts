export interface Category {
    id: number;
    name: string;
    observation: string;
    total: number;
    notebooks?: PatrimonioDetalhadoType[];
    padrao_depreciacao_id?: number | null;
}

export interface PatrimonioDetalhadoType {
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
    gastos?: GastoType[];
    depreciacao_historico?: { data: string; valor: number }[];
    gastos_mensais?: { mes: string; valor: number }[];
}

export interface GastoType {
    id: number;
    tipo: string;
    descricao: string;
    valor: number;
    data: string;
}

export interface CategoriasProps {
    departamento: import('./types').DepartamentoType;
    user: import('./types').UserType;
    host: import('./types').UserType | null;
    membros: import('@/app/services/membros').MembroDepartamento[];
    categorias: import('./types').CategoriaComPatrimoniosType[];
}