"use client"

import { Suspense } from "react";
import { motion } from "framer-motion";
import LoginBranding from "../components/auth/LoginBranding";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-page via-[#1a1a1a] to-page flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
            </div>

            <motion.div 
                className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <LoginBranding />
                <Suspense>
                    <LoginForm />
                </Suspense>
            </motion.div>
        </div>
    );
}