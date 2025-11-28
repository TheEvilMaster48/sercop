import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Analytics } from '@vercel/analytics/next';

// Fuentes (solo afectan al server layout)
const geist = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SERCOP - Módulo Facilitador de Contratación Pública',
  description: 'Sistema Oficial de Contratación Pública del Ecuador',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-gray-50 antialiased`}>

        {/* PROVIDER GLOBAL */}
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* ANALYTICS */}
        <Analytics />

      </body>
    </html>
  );
}
