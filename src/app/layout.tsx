import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ZenithSkill | AI-Powered Universal Resume Analyzer",
  description: "Analyze your resume across industries using advanced semantic vector matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                Z
              </div>
              <span className="font-bold text-xl tracking-tight">ZenithSkill</span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
