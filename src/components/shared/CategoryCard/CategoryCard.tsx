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

const BADGE_VARS = ['--brand', '--success', '--star', '--error'];

function getBadgeVar(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `var(${BADGE_VARS[Math.abs(hash) % BADGE_VARS.length]})`;
}

function CategoryCard({ nameEn, nameAr, imageUrl, active, onClick, rightSlot }: Props) {
  const { t } = useLanguage();
  const label = t(nameEn, nameAr);
  const hasImage = Boolean(imageUrl);

  return (
    <div
      className={`${styles.card} ${active ? styles.cardActive : ''} ${onClick ? styles.clickable : ''}`}
      style={hasImage ? { backgroundImage: `url(${imageUrl})` } : { background: getBadgeVar(nameEn) }}
      onClick={onClick}
    >
      <div className={styles.overlay} />
      <span className={styles.label}>{label}</span>
      {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
    </div>
  );
}

export default CategoryCard;