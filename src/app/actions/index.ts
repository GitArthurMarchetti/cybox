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