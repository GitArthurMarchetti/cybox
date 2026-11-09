"use client"

import { Suspense } from "react";
import LoginForm from "../components/auth/LoginForm";
import { AuthShell } from "../components/auth/AuthShell";

export default function Login() {
    return (
        <AuthShell
            title="Everything you own,"
            accent="accounted for."
            text="Your rooms, categories and assets, with their value updated every month. Log in and see what everything is worth today."
        >
            <Suspense>
                <LoginForm />
            </Suspense>
        </AuthShell>
    );
}
