import { Inter } from 'next/font/google';
import './globals.css';
import { ModeProvider } from '@/lib/context/ModeContext';
import Navbar from '@/components/Navbar.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DBMS Project',
  description: 'Time Slot Reservation System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModeProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 pt-6">
            {children}
          </main>
        </ModeProvider>
      </body>
    </html>
  );
}
