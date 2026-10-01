import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SymNexus Team',
  description: 'SymNexus team messaging',
  robots: { index: false, follow: false },
  icons: { icon: '/brand/favicon.ico', apple: '/brand/symnexus-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
