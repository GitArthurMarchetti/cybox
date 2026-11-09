import { redirect } from "next/navigation";
import FrontHome from "./components/home/frontHome";
import { auth } from "@/auth";

export default async function Home() {

  const session = await auth();
  // Signed-in users go straight to their rooms. Demo visitors can still browse the landing.
  if (session?.user && session.provider !== "demo") {
    redirect("/departamentos");
  }

  return <FrontHome />;
}