import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VerifyX",
  description: "Document Verifier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  h-screen flex text-black bg-gray-100`}
      > 
      <Sidebar/>
      <main className="flex-1 overflow-y-auto p-0 sm:p-4">
        <div className=" h-full">
        {children}
        </div>
      
      </main>
       
      </body>
    </html>
  );
}
