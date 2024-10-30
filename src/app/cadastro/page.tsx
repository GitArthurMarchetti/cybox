'use server'
import CadastroComponent from "./cadastro";
import { getEmptyUser, getUsers } from "../services/user";


export default async function BackCadastro() {
     const user = await getEmptyUser()

     return <CadastroComponent user={user}/>
}