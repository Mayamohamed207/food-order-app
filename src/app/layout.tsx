import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SearchProvider } from '@/context/SearchContext';
import Navbar from '@/components/layout/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'FoodApp — Order food online',
  description: "Cairo's best kitchens, delivered fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <FavoritesProvider>
                <SearchProvider>
                  <Navbar />
                  <main>{children}</main>
                  <Toaster
                    position="bottom-center"
                    toastOptions={{
                      style: {
                        borderRadius: '12px',
                        background: '#1C1C1C',
                        color: '#fff',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </SearchProvider>
              </FavoritesProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}