'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MenuItem } from '@/types';

interface UseProductReturn {
  product: MenuItem | null;
  related: MenuItem[];
  loading: boolean;
}

export function useProduct(id: string | undefined): UseProductReturn {
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [related, setRelated]   = useState<MenuItem[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setProduct(data as MenuItem);

      const { data: rel } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', data.category_id)
        .neq('id', id)
        .limit(3);

      setRelated((rel ?? []) as MenuItem[]);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { product, related, loading };
}