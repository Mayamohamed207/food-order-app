'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './CategoryCard.module.css';

interface Props {
  nameEn: string;
  nameAr: string;
  imageUrl?: string | null;
  active?: boolean;
  onClick?: () => void;
  rightSlot?: React.ReactNode;
}

function CategoryCard({ nameEn, nameAr, imageUrl, active, onClick, rightSlot }: Props) {
  const { t } = useLanguage();
  const label = t(nameEn, nameAr);
  const hasImage = Boolean(imageUrl);

  return (
    <div
      className={`${styles.card} ${active ? styles.cardActive : ''} ${onClick ? styles.clickable : ''}`}
      style={hasImage ? { backgroundImage: `url(${imageUrl})` } : { background: 'var(--brand-soft)' }}
      onClick={onClick}
    >
      <div className={styles.overlay} />
      <div className={styles.labelWrap}>
        <span className={styles.label}>{label}</span>
      </div>
      {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
    </div>
  );
}

export default CategoryCard;