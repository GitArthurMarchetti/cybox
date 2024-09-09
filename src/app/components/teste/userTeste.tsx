import UserType from "@/app/services/user"
// import { saveUser, removeUser } from "@/app/services/user"
import { useState } from "react"

type Props = {
    users: UserType[]
}

export default function UserTeste({ users}: Props) {
    return (
        <>
            <h1>TESTE</h1>
            <p>{}</p>
        </>
    )
}