import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snoot Booper: Idle Wuxia Cat Sanctuary',
  description: 'Boop the snoots. Cultivate the cats. Walk the path of the Celestial Snoot Sect.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a2e] text-white min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
