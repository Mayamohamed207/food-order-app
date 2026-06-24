'use client';

import { useState, useCallback } from 'react';
import Hero from '@/components/layout/Hero/Hero';
import Categories from '@/components/menu/Categories/Categories';
import ProductCard from '@/components/shared/ProductCard/ProductCard';
import { FavoriteAction, AddToCartAction } from '@/components/menu/MenuCardActions';
import MenuFilter from '@/components/menu/MenuFilter/MenuFilter';
import CartDrawer from '@/components/layout/CartDrawer/CartDrawer';
import { useMenu } from '@/hooks/useMenu';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import useFilteredMenu from '@/hooks/useFilteredMenu';
import { ShoppingCart } from 'lucide-react';
import styles from './page.module.css';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, categories, loading, error } = useMenu(selectedCategory);
  const { t } = useLanguage();
  const { cartCount } = useCart();
  const { filtered, filters, setFilters, isLoggedIn } = useFilteredMenu(items);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const handleFilterChange = useCallback((key: 'sort' | 'favoritesOnly', value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, [setFilters]);

  return (
    <>
      <Hero />

      <div className={styles.page}>
        <Categories categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

        <section id="menu-section" className={styles.menuSection}>
          <div className={styles.menuHeader}>
            <h2 className={styles.sectionTitle}>{t('Menu', 'القائمة')}</h2>
            <MenuFilter
              sort={filters.sort}
              favoritesOnly={filters.favoritesOnly}
              isLoggedIn={isLoggedIn}
              onChange={handleFilterChange}
            />
          </div>

          {loading && (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className={styles.empty}>{t('No items found.', 'لا توجد عناصر.')}</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className={styles.grid}>
              {filtered.map((item) => (
               <ProductCard
                key={item.id}
                item={item}
                href={`/product/${item.id}`}
                overlayActions={<FavoriteAction item={item} />}
                footerAction={<AddToCartAction item={item} />}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {cartCount > 0 && (
        <button className={styles.floatingCart} onClick={openCart}>
          <ShoppingCart size={20} />
          <span className={styles.floatingBadge}>{cartCount}</span>
        </button>
      )}

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
};

export default HomePage;