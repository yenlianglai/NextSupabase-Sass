import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ReactQueryProviders from "@/context/ReactQueryContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
      <body
        className={`${geistSans.className} antialiased min-h-screen gradient-bg`}
      >
        <ReactQueryProviders>
          <ReactQueryDevtools initialIsOpen={false} />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <nav className="fixed top-0 left-0 right-0 h-20 glass-effect border-b border-border z-20">
                <Navbar />
              </nav>

              <main className="h-screen overflow-auto pt-20 pb-16">
                {children}
              </main>

              <footer
                className="fixed bottom-0 left-0 right-0
              h-16 flex items-center justify-between border-t border-border"
              >
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <div className="h-8 w-8 rounded-lg bg-primary"></div>
                  <span className="text-lg font-semibold text-foreground">
                    Essay Auditor
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Essay Auditor. All rights
                  reserved.
                </p>
              </footer>
            </ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
