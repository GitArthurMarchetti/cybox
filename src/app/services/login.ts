'use server'

import { signIn, signOut } from "@/auth"
import { CredentialsSignin } from "next-auth"

export async function DoLogout() {
  await signOut({ redirectTo: "/" })
}

export async function DoCredentialsLogin(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'credentials' };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {};
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      return { error: err.code };
    }

    console.error('Erro ao fazer login:', err);
    return { error: 'erro' };
  }
}
