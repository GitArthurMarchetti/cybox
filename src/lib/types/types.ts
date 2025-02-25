// types.ts
export type UserType = {
    id: string | null;
    nome: string;
    email: string;
    senha: string;
    google_id?: string | null;
    created_at?: string | null;
};

export type DepartamentoType = {
    id_departamentos: number | null | string;
    titulo: string;
    descricao?: string | null;
    totalMembros: number;
    maximoMembros: number;
    convite: string | null;
    localizacao: string | null;
    fotoDepartamento?: string | null;
    created_at?: string | null;
};

export type ConviteType = {
    id: number;
    id_departamentos: number;
    id_remetente: string;
    id_destinatario: string;
    status: "pendente" | "aceito" | "recusado";
    criado_em: string;
    departamento_titulo?: string;
    remetente_nome?: string;
};

export type CategoriaType = {
    id: number;
    id_departamento: number;
    nome: string;
    descricao?: string | null;
    created_at?: string | null;
};

export type PatrimonioType = {
    id: number;
    id_categoria: number;
    nome: string;
    descricao?: string | null;
    valor_inicial: number;
    valor_atual: number;
    data_aquisicao: string;
    tempo_depreciacao: number;
    created_at?: string | null;
};