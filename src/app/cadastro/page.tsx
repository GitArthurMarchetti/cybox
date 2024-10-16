'use server'
import CadastroComponent from "./cadastro";
import { getEmptyUser, getUsers } from "../services/user";


export default async function BackCadastro() {
     const user = await getEmptyUser()
     const users = await getUsers()

     console.log("***********************",users)

     return <CadastroComponent user={user}/>
}