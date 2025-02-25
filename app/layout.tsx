import type React from "react"
import type { Metadata } from "next"
import { Inter, Lexend } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ["latin"],
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Choose the perfect plan for your agency's needs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lexend.variable} font-inter`}>{children}</body>
    </html>
  )
}

