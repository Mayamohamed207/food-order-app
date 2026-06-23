'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // Make sure this is imported
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const { t, toggleLanguage, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Add admin state

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setIsAdmin(data?.role === 'admin');
        });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const toggleMenu  = useCallback(() => setMenuOpen(p => !p), []);
  const closeMenu   = useCallback(() => setMenuOpen(false), []);
  const handleSignOut = useCallback(async () => {
    await signOut();
    closeMenu();
  }, [signOut, closeMenu]);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <Utensils size={17} strokeWidth={2.2} />
          <span>FoodApp</span>
        </Link>

        <div className={styles.actions}>
          <button onClick={toggleLanguage} className={styles.langBtn} aria-label="toggle language">
            {language === 'en' ? 'ع' : 'EN'}
          </button>

          <Link href="/cart" className={styles.cartBtn} onClick={closeMenu} aria-label="cart">
            <ShoppingCart size={20} strokeWidth={1.8} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          <button onClick={toggleMenu} className={styles.hamburger} aria-label="toggle menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <div className={`${styles.drawer} ${menuOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.item} onClick={closeMenu}>
          {t('Menu', 'القائمة')}
        </Link>
        {user && (
          <Link href="/orders" className={styles.item} onClick={closeMenu}>
            {t('My Orders', 'طلباتي')}
          </Link>
        )}
        
        {isAdmin && (
          <Link href="/admin" className={styles.item} onClick={closeMenu}>
            {t('Admin Panel', 'لوحة التحكم')}
          </Link>
        )}
        
        <hr className={styles.hr} />
        {user ? (
          <button onClick={handleSignOut} className={styles.item}>
            <LogOut size={14} />
            {t('Sign out', 'تسجيل الخروج')}
          </button>
        ) : (
          <Link href="/login" className={styles.item} onClick={closeMenu}>
            <User size={14} />
            {t('Sign in', 'تسجيل الدخول')}
          </Link>
        )}
      </div>
    </nav>
  );
}