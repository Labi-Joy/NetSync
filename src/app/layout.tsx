import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NetSync — Web3 Conference Networking Bot",
  description: "Connect. Network. Grow. Smart matches and a premium Web3 UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-[var(--dark-bg)] text-[var(--text-primary)]`}>
        {children}
      </body>
    </html>
  );
}
