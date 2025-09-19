import type { Metadata } from "next";
import Script from 'next/script'
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

// Simple client-side script injection to expose supabase for debugging
function DebugExpose() {
  return (
    <Script id="supabase-debug-expose" strategy="afterInteractive">
      {`try { if (typeof window !== 'undefined') { import('@@/lib/api').then(m => { window.supabase = m.supabase; console.log('[DEBUG] supabase client exposed on window'); }); } } catch(e){console.warn('Expose supabase failed', e); }`}
    </Script>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="envoyou-theme">
          <AuthProvider>
            <ToastProvider>
            <DebugExpose />
            {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
