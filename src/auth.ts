import { getUsersByEmail } from "@/app/services/user";
import { hash } from "crypto";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

const bcrypt = require('bcrypt');


type UserData = {
  name: string;
  email: string;
  id: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [

    Credentials({
      name: 'Credentials',


      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },




      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {

          throw new Error("Por favor preencha seu email e senha!");

        }


        const user = await getUsersByEmail(email)

        if (!user) {

          throw new Error('Email ou senha inválidos');

        }

        if (!user.passwordHashed) {

          throw new Error('Email ou senha inválidos')

        }


        const senhaValida = await bcrypt.compare(password, user.passwordHashed)

        if (!senhaValida) {

          throw new Error('Email ou senha inválidos')

        }


        const userData: UserData = {
          id: user.id as string,
          name: user.name,
          email: user.email,
        }


        return userData;

      },




    })

  ],

  pages: {

    signIn: "/login"

  }


})