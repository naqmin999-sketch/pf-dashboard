import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DL이앤씨 재무솔루션팀 Market Intelligence",
  description: "DL이앤씨 재무솔루션팀 Market Intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={`${mono.variable} bg-zinc-950 text-zinc-100 antialiased font-mono`}>
        {children}
      </body>
    </html>
  );
}
