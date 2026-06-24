'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MenuItem } from '@/types';
import styles from './ProductCard.module.css';

interface Props {
  item: MenuItem;
  href?: string;
  overlayActions?: React.ReactNode;
  footerAction?: React.ReactNode;
  priority?: boolean;
}

function ProductCard({ item, href, overlayActions, footerAction, priority = false }: Props) {
  const { t } = useLanguage();
  const name = t(item.name_en, item.name_ar);

  const image = (
    <div className={styles.imgWrap}>
      {item.image_url ? (
        <Image
          src={item.image_url}
          alt={name}
          fill
          className={styles.img}
          sizes="280px"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className={styles.imgPlaceholder}>🍽️</div>
      )}

      {!item.is_available && <span className={styles.unavailable}>{t('Unavailable', 'غير متاح')}</span>}

      {overlayActions && <div className={styles.actionsOverlay}>{overlayActions}</div>}
    </div>
  );

  return (
    <div className={styles.card}>
      {href ? <Link href={href} className={styles.imgLink}>{image}</Link> : image}

      <div className={styles.body}>
       

        {href ? (
          <Link href={href}>
            <p className={styles.name}>{name}</p>
          </Link>
        ) : (
          <p className={styles.name}>{name}</p>
        )}

        {(item.description_en || item.description_ar) && (
          <p className={styles.desc}>{t(item.description_en ?? '', item.description_ar ?? '')}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>{item.price.toFixed(2)} EGP</span>
          {footerAction}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;