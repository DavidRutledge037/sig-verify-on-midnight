'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { WalletProvider } from '@/contexts/WalletContext';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sig Verify on Midnight</title>
        <meta name="description" content="Secure document signing powered by Midnight Network" />
        <Script src="/inject-lace.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ThemeProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
