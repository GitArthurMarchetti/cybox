import { DepartamentoType } from "@/lib/types/types";
import FrontDepartamentoTeste from "./frontDepartamentoPage";

type Props = {
    departamentos: DepartamentoType[];
    departamento: DepartamentoType;
    userId: string;
    userName: string | null | undefined;
    userEmail: string | null | undefined;
};

export default function DepartamentoPageTeste({ departamentos, departamento, userId, userName, userEmail }: Props) {
    return (
        <FrontDepartamentoTeste departamento={departamento} departamentos={departamentos} userEmail={userEmail} userId={userId} userName={userName} />
    )
}