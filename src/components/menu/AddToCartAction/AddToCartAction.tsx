'use client';

import { useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast'; 
import { MenuItem } from '@/types';
import styles from './AddToCartAction.module.css';

interface Props { item: MenuItem; }

 function AddToCartAction({ item }: Props) {
  const { addToCart, cart } = useCart();
  const { t } = useLanguage();
  const inCart = cart.find(c => c.id === item.id);

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: item.id,
      name_en: item.name_en,
      name_ar: item.name_ar,
      price: item.price,
      image_url: item.image_url,
    });

    toast.success(t(`${item.name_en} added to cart`, `تم إضافة ${item.name_ar} للسلة`));
    
  }, [addToCart, item, t]);

  return (
    <button
      className={styles.addBtn}
      onClick={handleAdd}
      disabled={!item.is_available}
      aria-label="add to cart"
    >
      <ShoppingCart size={15} />
      {inCart && <span className={styles.qtyBadge}>{inCart.quantity}</span>}
    </button>
  );
}

export default AddToCartAction;