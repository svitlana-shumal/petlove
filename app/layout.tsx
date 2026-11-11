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

  openGraph: {
    title: 'Petlove 🐾',
    description: 'Take good care of your small pets. Find love, care and happiness for your pets.',
    url: 'https://your-petlove-site.vercel.app/',
    siteName: 'Petlove',
    images: [
      {
        url: 'https://your-petlove-site.vercel.app/tablet1x.webp',
        width: 1200,
        height: 630,
        alt: 'Petlove preview',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Petlove 🐾',
    description: 'Take good care of your small pets.',
    images: ['https://your-petlove-site.vercel.app/tablet1x.webp'],
  },

  alternates: {
    canonical: 'https://your-petlove-site.vercel.app/',
  },
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
        <div id="modal-root"></div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
