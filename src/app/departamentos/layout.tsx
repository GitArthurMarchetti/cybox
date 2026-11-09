import type { Metadata } from "next";
import { auth } from "@/auth";
import { DemoProvider } from "../components/demo/DemoContext";

export const metadata: Metadata = {
    title: "Rooms",
    robots: { index: false, follow: false },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return <DemoProvider demo={session?.provider === "demo"}>{children}</DemoProvider>;
}
