'use client';

import { useState, useCallback } from 'react';
import Hero from '@/components/layout/Hero/Hero';
import Categories from '@/components/menu/Categories/Categories';
import ProductCard from '@/components/shared/ProductCard/ProductCard';
import FavoriteAction from '@/components/menu/FavoriteAction/FavoriteAction';
import AddToCartAction from '@/components/menu/AddToCartAction/AddToCartAction';
import MenuFilter from '@/components/menu/MenuFilter/MenuFilter';
import { useMenu } from '@/hooks/useMenu';
import { useLanguage } from '@/context/LanguageContext';
import useFilteredMenu from '@/hooks/useFilteredMenu';
import styles from './page.module.css';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { items, categories, loading, error } = useMenu(selectedCategory);
  const { t } = useLanguage();
  const { filtered, filters, setFilters, isLoggedIn } = useFilteredMenu(items);

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
                <div key={item.id} id={`product-target-${item.id}`} style={{ transition: 'all 0.4s ease' }}>
                  <ProductCard
                    item={item}
                    href={`/product/${item.id}`}
                    overlayActions={<FavoriteAction item={item} />}
                    footerAction={<AddToCartAction item={item} />}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

    </>
  );
};

export default HomePage;