'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, CreditCard, Banknote, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart }         from '@/context/CartContext';
import { useAuth }         from '@/context/AuthContext';
import { useLanguage }     from '@/context/LanguageContext';
import { usePlaceOrder }   from '@/hooks/usePlaceOrder';
import { PaymentMethod }   from '@/types';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user }        = useAuth();
  const { t }           = useLanguage();
  const { placeOrder, loading } = usePlaceOrder();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentMethod>('cash');

  const handleInc    = useCallback((id: string) => updateQuantity(id, 1), [updateQuantity]);
  const handleDec    = useCallback((id: string) => updateQuantity(id, -1), [updateQuantity]);
  const handleRemove = useCallback((id: string) => removeFromCart(id), [removeFromCart]);

  const handleOrder = useCallback(async () => {
    if (!user) { router.push('/login'); return; }
    if (cart.length === 0) return;

    const orderId = await placeOrder(cart, cartTotal, payment);
    if (orderId) {
      clearCart();
      toast.success(t('Order placed!', 'تم تقديم الطلب!'));
      router.push('/orders');
    } else {
      toast.error(t('Failed to place order', 'فشل تقديم الطلب'));
    }
  }, [user, cart, cartTotal, payment, placeOrder, clearCart, router, t]);

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingBag size={56} strokeWidth={1} />
        <h2>{t('Cart is empty', 'السلة فارغة')}</h2>
        <p>{t('Add some delicious items!', 'أضف بعض الأصناف اللذيذة!')}</p>
        <Link href="/" className={styles.backBtn}>{t('Browse menu', 'تصفح القائمة')}</Link>
      </div>
    );
  }

  const delivery  = 50;
  const grandTotal = cartTotal + delivery;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <section className={styles.section}>
          <h1 className={styles.heading}>{t('Your Order', 'طلبك')}</h1>

          <ul className={styles.list}>
            {cart.map((item) => (
              <li key={item.id} className={styles.row}>
                <div className={styles.imgBox}>
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name_en} fill className={styles.img} sizes="72px" />
                  ) : (
                    <span className={styles.imgEmoji}>🍽️</span>
                  )}
                </div>

                <div className={styles.info}>
                  <p className={styles.name}>{t(item.name_en, item.name_ar)}</p>
                  <p className={styles.price}>{(item.price * item.quantity).toFixed(2)} EGP</p>
                </div>

                <div className={styles.qtyRow}>
                  <button onClick={() => handleDec(item.id)} className={styles.qtyBtn}><Minus size={13} /></button>
                  <span className={styles.qty}>{item.quantity}</span>
                  <button onClick={() => handleInc(item.id)} className={styles.qtyBtn}><Plus size={13} /></button>
                </div>

                <button className={styles.remove} onClick={() => handleRemove(item.id)} aria-label="remove">
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>{t('Summary', 'الملخص')}</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>{t('Subtotal', 'المجموع الفرعي')}</span>
              <span>{cartTotal.toFixed(2)} EGP</span>
            </div>
            <div className={styles.summaryRow}>
              <span>{t('Delivery', 'التوصيل')}</span>
              <span>{delivery.toFixed(2)} EGP</span>
            </div>
            <hr className={styles.divider} />
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>{t('Total', 'الإجمالي')}</span>
              <span>{grandTotal.toFixed(2)} EGP</span>
            </div>
          </div>

          <h3 className={styles.paymentTitle}>{t('Payment method', 'طريقة الدفع')}</h3>

          <div className={styles.paymentOptions}>
            <button
              className={`${styles.payOpt} ${payment === 'cash' ? styles.payActive : ''}`}
              onClick={() => setPayment('cash')}
            >
              <Banknote size={18} />
              {t('Cash on delivery', 'الدفع عند الاستلام')}
            </button>
            <button
              className={`${styles.payOpt} ${payment === 'online' ? styles.payActive : ''}`}
              onClick={() => setPayment('online')}
            >
              <CreditCard size={18} />
              {t('Pay online', 'الدفع أونلاين')}
            </button>
          </div>

          {payment === 'online' && (
            <p className={styles.onlineNote}>
              {t(
                '💳 Online payment is simulated — no real charges.',
                '💳 الدفع الإلكتروني تجريبي — لا رسوم حقيقية.'
              )}
            </p>
          )}

          <button
            className={styles.placeBtn}
            onClick={handleOrder}
            disabled={loading}
          >
            {loading
              ? t('Placing order…', 'جاري الإرسال…')
              : t('Place order', 'تأكيد الطلب')}
          </button>

          {!user && (
            <p className={styles.loginNote}>
              {t('You need to ', 'يجب ')}
              <Link href="/login" className={styles.loginLink}>{t('sign in', 'تسجيل الدخول')}</Link>
              {t(' to place an order.', ' لتقديم الطلب.')}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}