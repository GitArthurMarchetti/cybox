import { DepartamentoType } from "@/lib/types/types";

type Props = {
    departamentos: DepartamentoType[];
    departamento: DepartamentoType;
    userId: string;
    userName: string | null | undefined;
    userEmail: string | null | undefined;
};

export default function FrontDepartamentoTeste({ departamentos, departamento, userId, userName, userEmail }: Props) {
    return(
        <>
        
        </>
    )
}