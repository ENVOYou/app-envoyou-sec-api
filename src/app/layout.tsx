import type { Metadata } from "next";
import { SupabaseDebugExpose } from '@/components/SupabaseDebugExpose'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Envoyou Dashboard",
  description: "Modern environmental data dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider defaultTheme="system" storageKey="envoyou-theme">
          <AuthProvider>
            <ToastProvider>
              <SupabaseDebugExpose />
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
