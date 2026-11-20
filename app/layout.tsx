import type { Metadata } from 'next';
import { Great_Vibes, Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dev & Vishakha | Wedding Invitation',
  description:
    'With love and blessings, we invite you to celebrate the wedding of Dev & Vishakha.',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${cormorant.variable} ${montserrat.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-ivory text-deep-burgundy font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
