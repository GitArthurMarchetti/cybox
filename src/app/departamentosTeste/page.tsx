"use server"

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "../components/Button/buttonLogOut";

export default async function DepartamentosTeste() {

    const session = await auth();

    if (!session?.user) redirect("/loginTeste")

    return (<>
        <h1>Olá: {session?.user?.name}</h1>
        <h2>cujo o email é: {session?.user?.email}</h2>
        <Logout />
    </>

    )
}