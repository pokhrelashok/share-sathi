import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import GlobalHandler from "./_components/GlobalHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Share Sathi",
  description: "Handle you share needs with Share Sathi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " relative"}>
        <Toaster position="top-right" />
        <GlobalHandler />
        {children}
        <div
          id="globalLoader"
          className="w-screen h-screen z-[1111111111] bg-white absolute top-0 left-0 flex justify-center items-center flex-col gap-2"
        >
          <img height={100} width={100} src="/logo.png" />
          <h2 className="text-xl text-slate-600 font-bold">Share Sathi</h2>
        </div>
      </body>
    </html>
  );
}
