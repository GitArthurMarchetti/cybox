
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
     {/* Preciso que monte a página de erro do usuário, caso ele não tenha feito login ou algo do tipo, sugiro fazer um componente, porque usará várias vezes */}
    </>)

    const userId = session.user.id as string;
 

    const departamento = await getEmptyDepartamento();
    const departamentosUserData = await getDepartamentosByUser(userId);

    return <DepartamentosFront
    
    departamentos={departamentosUserData} 
    departamento={departamento} 
    userId={userId} 
    userName={session.user.name}
    userEmail={session.user.email} 

    />
}
