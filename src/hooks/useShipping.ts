import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { ShippingZones } from '@/types';

export function useShipping() {
  const [options, setOptions] = useState<ShippingZones[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    setLoading(true);
    const { data } = await supabase.from('shipping_zones').select('*').order('price');
    setOptions(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOptions(); }, []);

  return { options, loading, refresh: fetchOptions };
}