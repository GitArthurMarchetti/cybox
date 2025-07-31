// types.ts
export type UserType = {
    id: string | null;
    nome: string;
    email: string;
    senha: string;
    google_id?: string | null;
    avatar_url?: string | null;
    status?: 'ativo' | 'inativo' | 'suspenso' | 'deletado';
    ultimo_login?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type DepartamentoType = {
    id_departamentos: number | null | string;
    titulo: string;
    descricao?: string | null;
    convite?: string | null;
    codigo_convite?: string | null;
    localizacao?: string | null;
    fotoDepartamento?: string | null;
    status?: 'ativo' | 'inativo' | 'deletado';
    created_at?: string | null;
    updated_at?: string | null;
    role?: 'member' | 'admin' | 'owner';
    num_participantes?: number;
};

export type ConviteType = {
    id: number;
    id_departamentos: number;
    id_remetente: string;
    id_destinatario: string;
    status: "pendente" | "aceito" | "recusado";
    codigo_convite?: string | null;
    data_expiracao?: string | null;
    criado_em: string;
    updated_at?: string | null;
    departamento_titulo?: string;
    remetente_nome?: string;
};

export type CategoriaType = {
    id: number;
    id_departamento: number;
    nome: string;
    descricao?: string | null;
    padrao_depreciacao_id?: number | null;
    status?: 'ativo' | 'inativo' | 'deletado';
    created_at?: string | null;
    updated_at?: string | null;
};

export type PatrimonioType = {
    id: number;
    id_categoria: number;
    nome: string;
    descricao?: string | null;
    codigo_patrimonio?: string | null;
    localizacao?: string | null;
    valor_inicial: number;
    valor_atual: number;
    data_aquisicao: string;
    tempo_depreciacao: number;
    status?: 'ativo' | 'inativo' | 'manutencao' | 'baixado' | 'deletado';
    created_at?: string | null;
    updated_at?: string | null;
};

export type UserDepartamentoType = {
    id: number;
    id_users: string;
    id_departamentos: number;
    role: 'member' | 'admin' | 'owner';
    status?: 'ativo' | 'inativo' | 'deletado';
    created_at?: string | null;
    updated_at?: string | null;
};

export type PadraoDepreciacaoType = {
    id: number;
    categoria: string;
    descricao?: string | null;
    taxa_anual_percent: number;
    vida_util_anos: number;
    observacoes?: string | null;
    ativo?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type GastoType = {
    id: number;
    patrimonio_id: number;
    tipo: 'manutencao' | 'reparo' | 'upgrade' | 'seguro' | 'licenca' | 'outros';
    descricao: string;
    valor: number;
    data_gasto: string;
    fornecedor?: string | null;
    numero_nota_fiscal?: string | null;
    observacoes?: string | null;
    comprovante_url?: string | null;
    usuario_id: string;
    status?: 'pendente' | 'aprovado' | 'pago' | 'cancelado';
    created_at?: string | null;
    updated_at?: string | null;
};

export type NotificacaoType = {
    id: number;
    usuario_id: string;
    titulo: string;
    mensagem: string;
    tipo: 'info' | 'warning' | 'success' | 'error' | 'depreciacao' | 'manutencao' | 'vencimento' | 'convite';
    lida?: boolean;
    acao_url?: string | null;
    acao_texto?: string | null;
    data_expiracao?: string | null;
    metadados?: any;
    created_at?: string | null;
};