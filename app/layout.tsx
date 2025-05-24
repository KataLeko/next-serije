import React, { ReactNode } from "react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "TV Series",
  description: "Najbolje TV serije na jednom mjestu.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="hr" className="min-h-screen">
      <head>
        <title>TV Series</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Najbolje TV serije na jednom mjestu." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="flex flex-col min-h-screen bg-black text-white">
        <header className="bg-black text-red-600">
          <Navbar />
        </header>

        <main className="bg-black flex-grow p-4 max-w-3xl mx-auto">
          {children}
        </main>

        <footer className="bg-black text-red-700 text-center py-4">
          <p>&copy; {new Date().getFullYear()} TV Series. Sva prava zadržana.</p>
        </footer>
      </body>
    </html>
  );
}
