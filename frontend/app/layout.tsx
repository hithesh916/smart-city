import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or standard font
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import { IntelligenceProvider } from "@/components/providers/IntelligenceContext";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Smart City Geospatial Intelligence",
  description: "Dashboard for monitoring smart city metrics",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IntelligenceProvider>
            <div className="flex min-h-screen overflow-hidden">
              <Sidebar className="hidden md:block w-64 fixed inset-y-0" />
              <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                  {children}
                </main>
              </div>
            </div>
          </IntelligenceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
