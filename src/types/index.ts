export interface MenuItem {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  image_url: string;
  category_id: string;
  is_available: boolean;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  image_url?: string | null;
}

export interface CartItem {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
  image_url: string;
  quantity: number;
}

export type PaymentMethod = 'cash' | 'online';

export type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  name_en: string;
  name_ar: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  created_at: string;
}
export interface ShippingZones {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}