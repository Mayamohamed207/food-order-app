import { useFavoritesContext } from '@/context/FavoritesContext';

const useFavorites = (productId: string) => {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  return {
    isFavorite: isFavorite(productId),
    toggle: () => toggleFavorite(productId),
  };
};

export default useFavorites;