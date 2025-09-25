import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { SocketProvider } from "@/context/SocketContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NetSync - Professional Networking Platform",
  description: "Connect with like-minded professionals, discover opportunities, and grow your network with AI-powered matching.",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: '60x60',
      }
    ],
    apple: {
      url: '/icon.svg',
      type: 'image/svg+xml',
    },
  },
  openGraph: {
    title: 'NetSync - Professional Networking Platform',
    description: 'Connect with like-minded professionals, discover opportunities, and grow your network with AI-powered matching.',
    type: 'website',
    siteName: 'NetSync',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NetSync - Professional Networking Platform',
    description: 'Connect with like-minded professionals, discover opportunities, and grow your network with AI-powered matching.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
