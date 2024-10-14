'use client'

import { doSocialLogin } from "../actions"

export default function LoginTeste() {
    return (
        <>
            <h1>
                Login teste
            </h1>
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google">Sign in with Google</button>
            </form>
        </>
    )
}