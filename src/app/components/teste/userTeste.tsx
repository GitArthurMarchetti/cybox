'use client'
import UserType, { removeUser } from "@/app/services/user"
// import { saveUser, removeUser } from "@/app/services/user"
import { useState } from "react"

import { saveUser } from "@/app/services/user"

type Props = {
    users: UserType[]
    user: UserType
}

export default function UserTeste({ users, user: novoUser }: Props) {
    console.log(users)
    const [user, setUser] = useState<UserType>(novoUser)
    return (
        <>

            <section className="w-full flex flex-row h-full">


                <div className="flex flex-col bg-green-600 w-6/12 text-white h-44">

                    <form action={saveUser} className="flex flex-col w-6/12 text-center text-black m-auto justify-between h-full">

                        <h1>TESTE</h1>

                        <input type="hidden" name="id" value={`${user?.id}`} />
                        <input

                            type="text"

                            name="nome"

                            placeholder="Seu nome..."

                            value={user.nome}

                            onChange={(e) => setUser({ ...user, nome: e.target.value })}

                        />

                        <input

                            type="text"

                            name="email"

                            placeholder="Seu Email..."

                            value={user.email}

                            onChange={(e) => setUser({ ...user, email: e.target.value })}

                        />

                        <input

                            type="password"

                            name="senha"

                            placeholder="Sua Senha..."

                            value={user.senha}

                            onChange={(e) => setUser({ ...user, senha: e.target.value })}

                        />


                        <button>Cadastrar</button>

                    </form>

                </div>



                <div className="bg-yellow-600 w-6/12 flex flex-col ">

                    {users.map((user) => (

                        <div key={user.id} className="flex flex-col m-auto w-10/12 bg-black text-white h-max">

                            <p>Nome: {user.nome}</p>

                            <p>Email: {user.email}</p>

                            <p>Senha: {user.senha}</p>

                            <button onClick={() => removeUser(user)}>Delete</button>
                            <button onClick={() => setUser(user)}>Editar</button>
                        </div>

                    ))}

                </div>





            </section>
        </>
    )
}