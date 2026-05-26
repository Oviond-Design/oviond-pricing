import type React from "react";
import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Oviond Agency Pricing",
  description:
    "One simple Oviond plan for agency reporting. Use the pricing slider to see monthly and annual pricing by client count, with API and MCP access included.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${lexend.variable} font-inter antialiased bg-background min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
