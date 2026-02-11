import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import Loader from '@/components/Loader/Loader';

const manrope = Manrope({
  variable: '--font-manrope-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Petlove',
  description: 'Take good care of your small pets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable}`}>
        <Header />
        <Suspense fallback={<Loader />}>{children}</Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
