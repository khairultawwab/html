import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'Mini-CMS & HTML Hosting',
    template: '%s | Mini-CMS & HTML Hosting',
  },
  description: 'Aplikasi Mini-CMS dan hosting laman web HTML statik berasaskan Next.js 15, Prisma ORM, dan PostgreSQL.',
  openGraph: {
    title: 'Mini-CMS & HTML Hosting',
    description: 'Aplikasi Mini-CMS dan hosting laman web HTML statik berasaskan Next.js 15, Prisma ORM, dan PostgreSQL.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
