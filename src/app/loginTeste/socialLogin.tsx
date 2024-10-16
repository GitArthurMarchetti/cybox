'use client'

import { doSocialLogin } from "../services/login"

export default function DoSocialLogin() {
    return (
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google">Sign in with Google</button>
            </form>
    )
}