'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Globe, LogOut, Package, ShieldAlert, Search, Utensils } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSearch } from '@/context/SearchContext';
import { supabase } from '@/lib/supabaseClient';
import IconButton from '@/components/shared/IconButton/IconButton';
import styles from './Navbar.module.css';

interface NavbarProps {
  onOpenCart: () => void;
}

function Navbar({ onOpenCart }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const { t, toggleLanguage, language } = useLanguage();
  const { search, setSearch } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setIsAdmin(data?.role === 'admin'));
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setDropdownOpen(false);
    router.push('/');
  }, [signOut, router]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    [setSearch]
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.row}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <Utensils size={18} strokeWidth={2.2} />
          <span>FoodApp</span>
        </Link>

        <div className={styles.searchDesktop}>
          <Search size={16} className={styles.searchIcon} />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder={t('Search products...', 'ابحث عن المنتجات...')}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actions}>
          <button onClick={toggleLanguage} className={styles.langBtn}>
            <Globe size={16} />
            {language === 'en' ? 'EN' : 'ع'}
          </button>

          <div className={styles.profileWrap} ref={dropdownRef}>
            <IconButton onClick={() => (user ? setDropdownOpen((p) => !p) : router.push('/login'))} title="profile">
              <User size={19} />
            </IconButton>

            {user && dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownGreeting}>{t('Hello,', 'مرحباً،')}</span>
                  <p className={styles.dropdownName}>{user.user_metadata?.full_name || user.email}</p>
                </div>
                <hr className={styles.dropdownDivider} />
                <Link href="/orders" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <Package size={16} />
                  {t('My Orders', 'طلباتي')}
                </Link>
                {isAdmin && (
                  <Link href="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <ShieldAlert size={16} />
                    {t('Admin Panel', 'لوحة التحكم')}
                  </Link>
                )}
                <hr className={styles.dropdownDivider} />
                <button onClick={handleSignOut} className={styles.dropdownItemDanger}>
                  <LogOut size={16} />
                  {t('Sign Out', 'تسجيل الخروج')}
                </button>
              </div>
            )}
          </div>

          <button onClick={onOpenCart} className={styles.cartBtn}>
            <ShoppingCart size={19} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>

          <button onClick={toggleMenu} className={styles.hamburger} aria-label="menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={styles.searchMobileRow}>
        <Search size={15} className={styles.searchIcon} />
        <input
          value={search}
          onChange={handleSearchChange}
          placeholder={t('Search products...', 'ابحث عن المنتجات...')}
          className={styles.searchInput}
        />
      </div>

      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <Link href="/" className={styles.drawerItem} onClick={closeMenu}>
          {t('Menu', 'القائمة')}
        </Link>
        {user && (
          <Link href="/orders" className={styles.drawerItem} onClick={closeMenu}>
            {t('My Orders', 'طلباتي')}
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin" className={styles.drawerItem} onClick={closeMenu}>
            {t('Admin Panel', 'لوحة التحكم')}
          </Link>
        )}
        {!user && (
          <Link href="/login" className={styles.drawerItem} onClick={closeMenu}>
            {t('Sign in', 'تسجيل الدخول')}
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;