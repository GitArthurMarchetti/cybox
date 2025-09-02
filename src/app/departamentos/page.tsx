'use server';

import { auth } from "@/auth";
import DepartamentosFront from "./departamentosFront";
import { redirect } from "next/navigation";
import { getDepartamentosByUser, getEmptyDepartamento } from "../services/departamento";

export default async function Departamento() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const userId = session.user.id as string;
    const departamento = await getEmptyDepartamento();
    const departamentosUserData = await getDepartamentosByUser(userId);

    return (
        <DepartamentosFront
            departamentos={departamentosUserData}
            departamento={departamento}
            userId={userId}
            userName={session.user.name}
            userEmail={session.user.email}
        />
    );
}