import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Namaene - IPA Vocalizer</title>
        <meta property="og:title" content="Namaene - IPA Vocalizer" />
        <meta property="og:description" content="A web app that helps you tell the world how to pronounce your name or whatever." />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://namaene.vercel.app" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
