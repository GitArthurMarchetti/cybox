'use client'
import DoSocialLogin from "./socialLogin"

import { DoCredentialsLogin } from "../services/login"
import { useRouter } from "next/navigation"

export default function LoginTeste() {
    const router = useRouter();
  
    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
  
      try {
        const formData = new FormData(event.currentTarget);
  
        const response = await DoCredentialsLogin(formData);
  
        if (response?.error) {
          // Exiba o erro para o usuário
          console.error('Erro ao fazer login:', response.error);
        } else {
          // Redireciona o usuário após o login bem-sucedido
          router.push('/departamentosTeste');
        }
  
      } catch (e) {
        console.error(e);
      }
    }

  
    return (
      <>
        <h1>Login Teste</h1>
  
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="email">Email adress</label>
            <input type="email" name="email" id="email" required className="text-black"/>
          </div>
  
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required className="text-black"/>
          </div>
  
          <button type="submit">Entrar</button>
        </form>
  
        <DoSocialLogin />
      </>
    );
  }
  