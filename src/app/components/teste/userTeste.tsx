import UserType from "@/app/services/user"
// import { saveUser, removeUser } from "@/app/services/user"
import { useState } from "react"

type Props = {
    users: UserType[]
}

export default function UserTeste({ users }: Props) {
    console.log(users)
    return (
        <>
            <div className="text-white">
                <h1>TESTE</h1>
                {users.map((user) => (
                    <div key={user.id}>
                        <p>Nome: {user.nome}</p>
                        <p>Email: {user.email}</p>
                    </div>
                ))}
            </div>

        </>
    )
}