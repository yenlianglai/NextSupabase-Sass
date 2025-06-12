import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ReactQueryProviders from "@/context/ReactQueryContext";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ReactQueryProviders>
          <ReactQueryDevtools initialIsOpen={false} />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-b-foreground/10 bg-background">
              <Navbar />
            </nav>
            <div className="flex flex-col h-screen pt-16 pb-8">
              <main className="flex-1 overflow-auto">{children}</main>

              <footer className="h-8 flex items-center justify-center border-t">
                <p className="text-xs flex gap-2">
                  Powered by
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold hover:underline"
                  >
                    Supabase
                  </a>
                </p>
              </footer>
            </div>
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
