export interface ICategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  display_order?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}
export interface IProduct {
  id: number;
  name: string;
  slug?: string;
  short_description?: string;
  description?: string;
  category_id: number;
  brand_id?: number;
  product_code?: string;
  featured?: boolean;
  fixed_price?: number;
  sale_price?: number;
  stock?: number;
  images?: IProductImage[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  display_order?: number;
  is_primary?: boolean;
}
export interface IProductVariant {
  id: number;
  product_id: number;
  sku: string;
  stock_quantity?: number;
  variant_price?: number;
  is_default?: boolean;
}
export interface IUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  user_type: 'buyer' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  avatar_url?: string;
  bio?: string;
  email_verified?: boolean;
  last_login_at?: string;
}


export interface IOrder {
  id: number;
  order_number: string;
  buyer_id: number;
  total_amount: number;
  shipping_fee?: number;
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'dispute';
  payment_method?: string;
  payment_status?: string;
  created_at?: string;
}

export interface IOrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface IBrand {
  id: number;
  name: string;
  slug: string;
  country?: string;
  logo_url?: string;
  description?: string;
  website?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface IPayment {
  id: number;
  order_id: number;
  payment_method: string;
  payment_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
}
export interface IReview {
  id: number;
  order_item_id: number;
  reviewer_id: number;
  rating: number;
  review_text?: string;
  created_at?: string;
}

