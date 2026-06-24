'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import useFavorites from '@/hooks/useFavorites';
import { MenuItem } from '@/types';
import styles from './product.module.css';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { addToCart, cart } = useCart();
  const { isFavorite, toggle } = useFavorites(id);

  const [product, setProduct] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => { setProduct(data); setLoading(false); });
  }, [id]);

  const handleAdd = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        price: product.price,
        image_url: product.image_url,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [product, qty, addToCart]);

  const inCart = cart.find(c => c.id === id);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>{t('Product not found', 'المنتج غير موجود')}</p>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          {t('Go home', 'الصفحة الرئيسية')}
        </button>
      </div>
    );
  }

  const name = t(product.name_en, product.name_ar);
  const desc = t(product.description_en ?? '', product.description_ar ?? '');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <button onClick={() => router.back()} className={styles.back}>
          <ArrowLeft size={15} />
          {t('Back', 'رجوع')}
        </button>

        <div className={styles.card}>
          {/* Image */}
          <div className={styles.imgWrap}>
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={name}
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 480px"
                priority
              />
            ) : (
              <div className={styles.imgPlaceholder}>🍽️</div>
            )}

            <button
              className={`${styles.heartBtn} ${isFavorite ? styles.liked : ''}`}
              onClick={toggle}
              aria-label="favourite"
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {!product.is_available && (
              <div className={styles.unavailableOverlay}>
                {t('Currently unavailable', 'غير متاح حالياً')}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.body}>
            <h1 className={styles.name}>{name}</h1>
            {desc && <p className={styles.desc}>{desc}</p>}

            <div className={styles.priceRow}>
              <span className={styles.price}>{product.price.toFixed(2)} EGP</span>
              {inCart && (
                <span className={styles.inCartNote}>
                  <ShoppingCart size={13} />
                  {t(`${inCart.quantity} in cart`, `${inCart.quantity} في السلة`)}
                </span>
              )}
            </div>

            {/* Qty picker */}
            <div className={styles.qtyRow}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
              >
                <Minus size={14} />
              </button>
              <span className={styles.qty}>{qty}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQty(q => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
              onClick={handleAdd}
              disabled={!product.is_available}
            >
              <ShoppingCart size={17} />
              {added
                ? t('Added!', 'تمت الإضافة!')
                : t('Add to cart', 'أضف إلى السلة')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}