'use client';

import { useState } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SearchProvider } from '@/context/SearchContext';
import Navbar from '@/components/layout/Navbar/Navbar';
import CartDrawer from '@/components/layout/CartDrawer/CartDrawer';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <FavoritesProvider>
                <SearchProvider>
                  <Navbar onOpenCart={() => setCartOpen(true)} />
                  <main>{children}</main>
                  <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
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