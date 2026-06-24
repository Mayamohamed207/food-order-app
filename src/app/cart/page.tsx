'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { useShipping } from '@/hooks/useShipping';
import type { PaymentMethod, CustomerInfo } from '@/types';
import styles from './cart.module.css';

const EMPTY_INFO: CustomerInfo = { name: '', email: '', phone: '', address: '' };

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { placeOrder, loading } = usePlaceOrder();
  const { options: zones } = useShipping();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [info, setInfo] = useState<CustomerInfo>(EMPTY_INFO);
  const [selectedZone, setSelectedZone] = useState('');

  const handleInc = useCallback((id: string) => updateQuantity(id, 1), [updateQuantity]);
  const handleDec = useCallback((id: string) => updateQuantity(id, -1), [updateQuantity]);
  const handleRemove = useCallback((id: string) => removeFromCart(id), [removeFromCart]);

  const handleInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  const zone = zones.find(z => z.id === selectedZone);
  const shippingPrice = zone?.price ?? 0;
  const grandTotal = cartTotal + shippingPrice;

  const handleOrder = useCallback(async () => {
    if (!user) { router.push('/login'); return; }
    if (!info.name || !info.phone || !info.address) {
      toast.error(t('Please fill in your details', 'يرجى ملء بياناتك'));
      return;
    }
    if (!selectedZone) {
      toast.error(t('Please select a governorate', 'يرجى اختيار المحافظة'));
      return;
    }
    const orderId = await placeOrder(cart, grandTotal, payment, info, selectedZone, shippingPrice);
    if (orderId) {
      clearCart();
      toast.success(t('Order placed!', 'تم تقديم الطلب!'));
      router.push('/orders');
    } else {
      toast.error(t('Failed to place order', 'فشل تقديم الطلب'));
    }
  }, [user, cart, grandTotal, payment, info, selectedZone, shippingPrice, placeOrder, clearCart, router, t]);

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingCart size={52} strokeWidth={1.2} />
        <h2>{t('Your cart is empty', 'السلة فارغة')}</h2>
        <Link href="/" className={styles.backBtn}>{t('Browse menu', 'تصفح القائمة')}</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.heading}>{t('Shopping Cart', 'سلة التسوق')}</h1>

        <ul className={styles.list}>
          {cart.map(item => (
            <li key={item.id} className={styles.row}>
              <div className={styles.imgBox}>
                {item.image_url
                  ? <Image src={item.image_url} alt={item.name_en} fill className={styles.img} sizes="64px" />
                  : <span>🍽️</span>}
              </div>
              <div className={styles.info}>
                <p className={styles.name}>{t(item.name_en, item.name_ar)}</p>
                <p className={styles.price}>{(item.price * item.quantity).toFixed(0)} EGP</p>
              </div>
              <div className={styles.qty}>
                <button onClick={() => handleDec(item.id)} className={styles.qtyBtn}><Minus size={12} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => handleInc(item.id)} className={styles.qtyBtn}><Plus size={12} /></button>
              </div>
              <button onClick={() => handleRemove(item.id)} className={styles.removeBtn}><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>

        <div className={styles.divider} />

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('Order & Shipping Details', 'بيانات الطلب والتوصيل')}</h2>
          <div className={styles.fields}>
            <input className={styles.input} name="name" placeholder={t('Full name *', 'الاسم الكامل *')} value={info.name} onChange={handleInfoChange} />
            <input className={styles.input} name="phone" placeholder={t('Phone *', 'رقم الهاتف *')} value={info.phone} onChange={handleInfoChange} />
            <input className={styles.input} name="email" type="email" placeholder={t('Email', 'البريد الإلكتروني')} value={info.email} onChange={handleInfoChange} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t('Select Governorate', 'اختر المحافظة')}</label>
            <select className={styles.select} value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
              <option value="">{t('Select governorate...', 'اختر المحافظة...')}</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>
                  {t(z.name_en, z.name_ar)} (+{z.price.toFixed(0)} EGP)
                </option>
              ))}
            </select>
          </div>

          <textarea
            className={`${styles.input} ${styles.textarea}`}
            name="address"
            placeholder={t('Detailed address *', 'العنوان التفصيلي *')}
            value={info.address}
            onChange={handleInfoChange}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>{t('Subtotal', 'المجموع')}</span>
            <span>{cartTotal.toFixed(0)} EGP</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('Shipping', 'الشحن')}</span>
            <span>{shippingPrice.toFixed(0)} EGP</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
            <span>{t('Total', 'الإجمالي')}</span>
            <span>{grandTotal.toFixed(0)} EGP</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('Payment method', 'طريقة الدفع')}</h2>
          <div className={styles.payOptions}>
            <button
              className={`${styles.payBtn} ${payment === 'cash' ? styles.payActive : ''}`}
              onClick={() => setPayment('cash')}
            >
              <Banknote size={17} />
              {t('Cash on delivery', 'الدفع عند الاستلام')}
            </button>
            <button
              className={`${styles.payBtn} ${payment === 'online' ? styles.payActive : ''}`}
              onClick={() => setPayment('online')}
            >
              <CreditCard size={17} />
              {t('Pay online', 'الدفع أونلاين')}
            </button>
          </div>
        </div>

        <button className={styles.placeBtn} onClick={handleOrder} disabled={loading}>
          <ShoppingCart size={18} />
          {loading ? t('Placing order…', 'جاري الإرسال…') : t('Confirm & Place Order', 'تأكيد وتقديم الطلب')}
        </button>

        {!user && (
          <p className={styles.loginNote}>
            {t('You need to ', 'يجب ')}
            <Link href="/login" className={styles.loginLink}>{t('sign in', 'تسجيل الدخول')}</Link>
            {t(' to place an order.', ' لتقديم الطلب.')}
          </p>
        )}

      </div>
    </div>
  );
}