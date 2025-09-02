'use server'

import { redirect } from "next/navigation";
import FrontHome from "./components/home/frontHome";
import { getUsersByEmail } from "./services/user";
import { auth } from "@/auth";

export default async function Home() {

  const session = await auth();
  if (session?.user) {
    redirect("/departamentos");
  }

  return <FrontHome />;
}