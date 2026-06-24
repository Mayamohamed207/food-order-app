'use client';

import { useCallback } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import useFavorites from '@/hooks/useFavorites';
import { MenuItem } from '@/types';
import styles from './MenuCardActions.module.css';

interface Props { item: MenuItem; }

export function FavoriteAction({ item }: Props) {
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites(item.id);

  const handleHeart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggle();
  }, [user, toggle]);

  return (
    <button
      onClick={handleHeart}
      className={`${styles.heart} ${isFavorite ? styles.liked : ''}`}
      aria-label="favourite"
    >
      <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
}

export function AddToCartAction({ item }: Props) {
  const { addToCart, cart } = useCart();
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
  }, [addToCart, item]);

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