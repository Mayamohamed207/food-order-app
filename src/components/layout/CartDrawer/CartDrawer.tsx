'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CartDrawer.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleInc = useCallback((id: string) => updateQuantity(id, 1), [updateQuantity]);
  const handleDec = useCallback((id: string) => updateQuantity(id, -1), [updateQuantity]);
  const handleRemove = useCallback((id: string) => removeFromCart(id), [removeFromCart]);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} role="dialog" aria-label="Cart">
        <div className={styles.head}>
          <h2 className={styles.title}>{t('Your cart', 'سلة التسوق')}</h2>
          <button className={styles.close} onClick={onClose} aria-label="close">
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={48} strokeWidth={1} />
            <p>{t('Your cart is empty', 'السلة فارغة')}</p>
            <button className={styles.shopBtn} onClick={onClose}>
              {t('Browse menu', 'تصفح القائمة')}
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {cart.map((item) => (
                <li key={item.id} className={styles.row}>
                  <div className={styles.imgBox}>
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name_en} fill className={styles.img} sizes="56px" />
                    ) : (
                      <span className={styles.imgEmoji}>🍽️</span>
                    )}
                  </div>

                  <div className={styles.info}>
                    <p className={styles.itemName}>{t(item.name_en, item.name_ar)}</p>
                    <p className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} EGP</p>
                  </div>

                  <div className={styles.qty}>
                    <button onClick={() => handleDec(item.id)} className={styles.qtyBtn} aria-label="decrease">
                      <Minus size={13} />
                    </button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button onClick={() => handleInc(item.id)} className={styles.qtyBtn} aria-label="increase">
                      <Plus size={13} />
                    </button>
                  </div>

                  <button className={styles.remove} onClick={() => handleRemove(item.id)} aria-label="remove">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.foot}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>{t('Total', 'الإجمالي')}</span>
                <span className={styles.totalAmt}>{cartTotal.toFixed(2)} EGP</span>
              </div>
              <Link href="/cart" className={styles.checkoutBtn} onClick={onClose}>
                {t('Go to checkout', 'إتمام الطلب')}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}