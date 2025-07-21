import './globals.css';
import Navbar from './components/Navbar';

import { AuthProvider } from '@/context/AuthContext';
import Footer from './components/Footer';
export const metadata = {
  title: 'My App',
  description: 'Protected App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}