import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: "Envoyou Dashboard",
  description: "SEC Climate Disclosure Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system" storageKey="envoyou-theme">
          <AuthProvider>
            <ToastProvider>
              <div className="min-h-screen bg-background">
                <Sidebar />
                <Header />
                <main className="ml-64 pt-16">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
