import type { Metadata } from "next";
import { Inter } from "next/font/google";
import logo from "../img/logo-branca.png"
import "./globals.css";
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cybox",
  description: "Pensando dentro e fora da caixa ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" type="image/png" href="/cyboxFavicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/cyboxFavicon/favicon.svg" />
        <link rel="shortcut icon" href="/cyboxFavicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/cyboxFavicon/apple-touch-icon.png" />
        <link rel="manifest" href="/cyboxFavicon/site.webmanifest" />
      </head>
      <body className={`${inter.className} flex flex-col h-screen scrollbar-thin scrollbar-thumb-yellow-700`}>
        <Toaster position="top-right" richColors />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
