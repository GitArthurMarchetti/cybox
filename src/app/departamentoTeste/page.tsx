"use server"

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "../components/Button/buttonLogOut";
import { getDepartamentos, getDepartamentosByUser, getEmptyDepartamento } from "../services/departamento";
import Departamento from "./departamentos";

export default async function DepartamentosTeste() {

    const session = await auth();

    console.log("Sessão recuperada:", session)

    if (!session?.user) redirect("/login")

    const userId = session.user?.id as string;

    const departamentos = await getDepartamentos() // NECESSARIO FILTRAR 
    const departamento = await getEmptyDepartamento()
    const departamentosUserData = await getDepartamentosByUser(userId)

    return (<>
        <div>
            <h1>{userId}</h1>
            <h1>Olá: {session?.user?.name}</h1>
            <h2>cujo o email é: {session?.user?.email}</h2>
            <Logout />
        </div>

        <Departamento departamentos={departamentosUserData} departamento={departamento} userId={userId} userEmail={session?.user?.email}/>

    </>

    )
}