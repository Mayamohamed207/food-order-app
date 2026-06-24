import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import type { CartItem, PaymentMethod, CustomerInfo } from '@/types';

export function usePlaceOrder() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = useCallback(
    async (
      cart: CartItem[],
      total: number,
      paymentMethod: PaymentMethod,
      customerInfo: CustomerInfo,
      shippingZoneId: string,
      shippingPrice: number
    ): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id ?? null,
            total,
            payment_method: paymentMethod,
            status: 'pending',
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            customer_address: customerInfo.address,
            shipping_zone_id: shippingZoneId || null,
            shipping_price: shippingPrice,
          })
          .select()
          .single();

        if (orderErr) throw orderErr;

        const items = cart.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_order: item.price,
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(items);
        if (itemsErr) throw itemsErr;

        return order.id as string;
      } catch (err: any) {
        console.error('ORDER ERROR:', JSON.stringify(err, null, 2));
        setError(err instanceof Error ? err.message : err?.message ?? 'Order failed');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { placeOrder, loading, error };
}