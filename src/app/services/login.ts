'use server'

import { signIn, signOut } from "@/auth"

export async function doSocialLogin(formData: FormData) {

    const action = formData.get('action') as string;
    await signIn(action, { redirectTo: "/departamentosTeste" })

    console.log(action)

}


export async function DoLogout() {

    await signOut({redirectTo: "/"})


}

export async function DoCredentialsLogin(formData: FormData) {
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
  
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }
  
     
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false, 
      });
  
      return response; 
    } catch (err) {
      console.log(err)
    }
  }