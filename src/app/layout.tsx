import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Namaene - IPA Vocalizer',
  description: 'A web app that helps you tell the world how to pronounce your name or whatever.',
  openGraph: {
    title: 'Namaene - IPA Vocalizer',
    description: 'A web app that helps you tell the world how to pronounce your name or whatever.',
    url: 'https://namaene.vercel.app',
    siteName: 'Namaene',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Namaene',
      },
    ],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
