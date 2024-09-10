import db from "./services/db";
import UserTeste from "./components/teste/userTeste";
import { getUsers } from "@/app/services/user";

export const dynamic = "force-dynamic"

export default async function Home() {
  const users = await getUsers();
  // const user = await getEmptyUser();


  return <UserTeste users={users}/>
}
