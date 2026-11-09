import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ["latin"] });
const display = Unbounded({ subsets: ["latin"], weight: ["600"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Cybox",
    title: "Cybox — Know what you own. Know what it's worth.",
    description: "Track every asset across every department and know what it's worth today, with automatic depreciation.",
  },
  twitter: { card: "summary_large_image" },
  title: {
    default: "Cybox — Know what you own. Know what it's worth.",
    template: "%s | Cybox",
  },
  description: "Track every asset across every department and know what it's worth today, with automatic depreciation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/cyboxFavicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/cyboxFavicon/favicon.svg" />
        <link rel="shortcut icon" href="/cyboxFavicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/cyboxFavicon/apple-touch-icon.png" />
        <link rel="manifest" href="/cyboxFavicon/site.webmanifest" />
      </head>
      <body className={`${inter.className} flex flex-col h-screen scrollbar-thin scrollbar-thumb-yellow-700`}>
        <Toaster position="bottom-right" richColors closeButton theme="dark" toastOptions={{ style: { borderRadius: 16 } }} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
