export type UserType = {
    id: number | null | string,
    nome: string,
    email: string,
    senha: string,
    google_id?: string | null // Adicionado o campo google_id
};



    export type DepartamentoType = {
        id_departamentos: number | null | string;
        titulo: string;
        descricao?: string | null;
        totalMembros: number;
        maximoMembros: number;
        convite: string | null;
        localizacao: string | null;
        fotoDepartamento?: string | null; // Adicione o campo de imagem como opcional
        created_at?: string | null;
    };




export type ConviteType = {
    id: number; 
    id_departamentos: number;
    id_remetente: string; 
    id_destinatario: string; 
    status: "pendente" | "aceito" | "recusado"; 
    criado_em: string;
};
