'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MenuItem, ProductImage } from '@/types';
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

  const slides: ProductImage[] =
    item.images && item.images.length > 0
      ? item.images
      : item.image_url
      ? [{ id: 'main', product_id: item.id, image_url: item.image_url, display_order: 0 }]
      : [];

  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => setActive(i => (i - 1 + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => setActive(i => (i + 1) % slides.length), [slides.length]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  }

  const labelled = slides.filter(s => s.label);

  const imageBlock = (
    <div
      className={styles.imgWrap}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.length > 0 ? (
        slides.map((slide, i) => (
          <div key={slide.id} className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}>
            <Image
              src={slide.image_url}
              alt={slide.label || name}
              fill
              className={styles.img}
              sizes="280px"
              priority={priority && i === 0}
              loading={priority && i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))
      ) : (
        <div className={styles.imgPlaceholder}>🍽️</div>
      )}

      {!item.is_available && (
        <span className={styles.unavailable}>{t('Unavailable', 'غير متاح')}</span>
      )}

      {overlayActions && <div className={styles.actionsOverlay}>{overlayActions}</div>}

      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={e => { e.preventDefault(); setActive(i); }}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.card}>
      {href ? <Link href={href} className={styles.imgLink}>{imageBlock}</Link> : imageBlock}

      <div className={styles.body}>
        {labelled.length > 0 && (
          <div className={styles.labels}>
            {labelled.map((slide, i) => {
              const idx = slides.indexOf(slide);
              return (
                <button
                  key={slide.id}
                  className={`${styles.labelBtn} ${idx === active ? styles.labelBtnActive : ''}`}
                  onClick={() => setActive(idx)}
                >
                  {slide.label}
                </button>
              );
            })}
          </div>
        )}

        {href ? (
          <Link href={href}><p className={styles.name}>{name}</p></Link>
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