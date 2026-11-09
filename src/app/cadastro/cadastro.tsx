"use client"

import { Suspense } from "react";
import { UserType } from "@/lib/types/types";
import RegisterForm from "../components/auth/RegisterForm";
import { AuthShell } from "../components/auth/AuthShell";

type Props = {
    user: UserType;
};

export default function Cadastro({ user }: Props) {
    return (
        <AuthShell
            title="Every asset,"
            accent="in its box."
            text="Create a room for each department, invite your team and see what everything is worth today, with depreciation done for you."
        >
            <Suspense>
                <RegisterForm user={user} />
            </Suspense>
        </AuthShell>
    );
}
