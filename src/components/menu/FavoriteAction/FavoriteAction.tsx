'use client';

import { useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useFavorites from '@/hooks/useFavorites';
import { MenuItem } from '@/types';
import styles from './FavoriteAction.module.css';

interface Props { item: MenuItem; }

function FavoriteAction({ item }: Props) {
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

export default FavoriteAction;