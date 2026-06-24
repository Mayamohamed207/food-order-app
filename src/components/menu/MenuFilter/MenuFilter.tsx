'use client';

import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Heart, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './MenuFilter.module.css';

interface Props {
  sort: 'default' | 'asc' | 'desc';
  favoritesOnly: boolean;
  isLoggedIn: boolean;
  onChange: (key: 'sort' | 'favoritesOnly', value: any) => void;
}

const MenuFilter = ({ sort, favoritesOnly, isLoggedIn, onChange }: Props) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCount = (sort !== 'default' ? 1 : 0) + (favoritesOnly ? 1 : 0);

  return (
    <div className={styles.wrap} ref={ref}>
      <button className={`${styles.trigger} ${activeCount > 0 ? styles.triggerActive : ''}`} onClick={() => setOpen(p => !p)}>
        <SlidersHorizontal size={14} />
        {t('Filter', 'تصفية')}
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {isLoggedIn && (
            <button
              className={`${styles.option} ${favoritesOnly ? styles.optionActive : ''}`}
              onClick={() => onChange('favoritesOnly', !favoritesOnly)}
            >
              <Heart size={14} fill={favoritesOnly ? 'currentColor' : 'none'} />
              {t('Favorites', 'المفضلة')}
              {favoritesOnly && <Check size={13} className={styles.check} />}
            </button>
          )}

          <div className={styles.divider} />

          <button className={`${styles.option} ${sort === 'asc' ? styles.optionActive : ''}`} onClick={() => onChange('sort', sort === 'asc' ? 'default' : 'asc')}>
            <ArrowUp size={14} />
            {t('Price: Low to High', 'السعر: من الأقل')}
            {sort === 'asc' && <Check size={13} className={styles.check} />}
          </button>

          <button className={`${styles.option} ${sort === 'desc' ? styles.optionActive : ''}`} onClick={() => onChange('sort', sort === 'desc' ? 'default' : 'desc')}>
            <ArrowDown size={14} />
            {t('Price: High to Low', 'السعر: من الأعلى')}
            {sort === 'desc' && <Check size={13} className={styles.check} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuFilter;