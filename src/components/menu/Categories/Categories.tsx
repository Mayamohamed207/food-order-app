'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import CategoryCard from '@/components/shared/CategoryCard/CategoryCard';
import { Category } from '@/types';
import styles from './Categories.module.css';

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function Categories({ categories, selected, onSelect }: Props) {
  const { t } = useLanguage();

  const handleAll = useCallback(() => onSelect(null), [onSelect]);
  const handleSelect = useCallback((id: string) => onSelect(id), [onSelect]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('Category', 'الفئات')}</h2>
        <button className={styles.viewAll} onClick={handleAll}>
          {t('View all', 'عرض الكل')} ›
        </button>
      </div>

      <div className={styles.cards}>
        {categories.slice(0, 3).map((cat) => (
          <CategoryCard
            key={cat.id}
            nameEn={cat.name_en}
            nameAr={cat.name_ar}
            imageUrl={cat.image_url}
            active={selected === cat.id}
            onClick={() => handleSelect(cat.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default Categories;