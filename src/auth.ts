import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";
import { getUsersByEmail, saveUser } from "./app/services/user"; // Importa suas funções

export const authOptions: AuthOptions = {
  providers: [
    // Provider do Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Provider para login com credenciais (e-mail e senha)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credenciais não fornecidas.");
        }

        const { email, password } = credentials;

        // Busca o usuário no banco de dados
        const user = await getUsersByEmail(email);

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        // Verifica a senha usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.senha);

        if (!isPasswordValid) {
          throw new Error("Senha incorreta.");
        }

        return { id: user.id, email: user.email, nome: user.nome };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Verifica se o usuário já existe no banco
        const existingUser = await getUsersByEmail(user.email!);
        if (!existingUser) {
          // Salva o usuário no banco de dados
          await saveUser(
            new FormData({
              nome: user.name!,
              email: user.email!,
              senha: "", // Google não retorna senha, então poderia ser vazio
            })
          );
        }
      }
      return true;
    },
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Página de login personalizada
  },
};
