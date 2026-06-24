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
import Toast from '@/components/shared/ToastMessages/ToastMessages'

function RootLayout({ children }: { children: React.ReactNode }) {
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
                  <Toast />
                </SearchProvider>
              </FavoritesProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
export default RootLayout