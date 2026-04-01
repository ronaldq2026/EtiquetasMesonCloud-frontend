import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Impresión de Etiquetas - Farmacias Ahumada',
  description: 'Sistema de impresión de etiquetas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} antialiased bg-slate-100`}>
        {children}
      </body>
    </html>
  );
}