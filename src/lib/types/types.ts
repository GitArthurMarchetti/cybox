export type UserType = {
    id: number | null | string,
    nome: string,
    email: string,
    senha: string,
    google_id?: string | null // Adicionado o campo google_id
};



export type DepartamentoType = {
    id_departamentos: number | null | string,
    titulo: string,
    descricao: string | null,
    totalMembros: number,
    maximoMembros: number,
    convite: string | null,
    localizacao: string | null,
};


export type ConviteType = {
    id_convite: number | null | string,
}