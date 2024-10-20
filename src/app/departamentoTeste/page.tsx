"use server"

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "../components/Button/buttonLogOut";
import { getDepartamentos, getEmptyDepartamento } from "../services/departamento";
import Departamento from "./departamentos";

export default async function DepartamentosTeste() {

    const session = await auth();

    console.log("Sessão recuperada:", session)

    if (!session?.user) redirect("/login")

    const userId = session.user?.id as string;

    const departamentos = await getDepartamentos()
    const departamento = await getEmptyDepartamento()


    return (<>
        <div>
            <h1>{userId}</h1>
            <h1>Olá: {session?.user?.name}</h1>
            <h2>cujo o email é: {session?.user?.email}</h2>
            <Logout />
        </div>

        <Departamento departamentos={departamentos} departamento={departamento} userId={userId}/>

    </>

    )
}