'use server'

import { auth } from "@/auth";
import DepartamentosFront from "./departamentoFront"
import { redirect } from "next/navigation";
import { getUsers } from "../services/user";
import { getDepartamentosByUser, getEmptyDepartamento } from "../services/departamento";



export default async function Departamento() {
    
    const session = await auth();

    console.log("Sessão recuperada:", session)

    if (!session?.user) return (<>
     <h1>Ops... Algo não está certo, confira se já fez o seu login.</h1>
    </>)

    const userId = session.user.id as string;
    const users = await getUsers()

    const departamento = await getEmptyDepartamento();
    const departamentosUserData = await getDepartamentosByUser(userId);

    return <DepartamentosFront
    
    departamentos={departamentosUserData} 
    departamento={departamento} 
    userId={userId} 
    userName={session.user.name}
    userEmail={session.user.email} 
    users={users}

    />
}