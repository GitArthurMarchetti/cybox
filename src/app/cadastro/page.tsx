'use server'
import CadastroComponent from "./cadastro";
import { getEmptyUser } from "../services/user";


export default async function Cadastro() {
     const user = await getEmptyUser()

     return <CadastroComponent user={user}    />
}