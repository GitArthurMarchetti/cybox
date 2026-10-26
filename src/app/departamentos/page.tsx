import { auth } from "@/auth";
import DepartamentosFront from "./departamentosFront";
import { redirect } from "next/navigation";
import { getDepartamentosByUser } from "../services/departamento";

export default async function Departamento() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const userId = session.user.id as string;
    const departamentosUserData = await getDepartamentosByUser();

    return (
        <DepartamentosFront
            departamentos={departamentosUserData}
            userId={userId}
            userName={session.user.name}
            userEmail={session.user.email}
        />
    );
}