import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayAgent Sentinel | Autonomous Agentic Commerce Firewall & PayPal Ledger",
  description: "Protecting autonomous AI agents from budget overflows, adversarial prompt injections, and unverified merchant fraud using PayPal Sandbox v2 and AG Grid real-time audit ledger.",
  keywords: ["PayPal", "AI Agent", "Agentic Commerce", "AG Grid", "Hackathon", "Fintech", "Security Firewall"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} antialiased bg-[#080C14] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
