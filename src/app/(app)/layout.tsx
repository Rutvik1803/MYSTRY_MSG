import type { Metadata } from 'next';
import '../globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p6 bg-white rounder w-full max-w-6xl">
          {children}
        </div>
      </body>
    </html>
  );
}
