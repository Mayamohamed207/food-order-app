import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { MenuItem } from '@/types';
import { useSearch } from '@/context/SearchContext';

type Sort = 'default' | 'asc' | 'desc';

interface Filters {
  sort: Sort;
  favoritesOnly: boolean;
}

const useFilteredMenu = (items: MenuItem[]) => {
  const { user } = useAuth();
  const { favoriteIds } = useFavoritesContext();
  const { search } = useSearch();
  const [filters, setFilters] = useState<Filters>({ sort: 'default', favoritesOnly: false });

  const filtered = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) => i.name_en.toLowerCase().includes(q) || i.name_ar.includes(q)
      );
    }

    if (filters.favoritesOnly) result = result.filter((i) => favoriteIds.has(i.id));
    if (filters.sort === 'asc') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [items, filters, favoriteIds, search]);

  return { filtered, filters, setFilters, isLoggedIn: !!user };
};

export default useFilteredMenu;