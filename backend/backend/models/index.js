const db = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Brand = require('./Brand');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductVariant = require('./ProductVariant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Review = require('./Review');
const Contact = require('./Contact');
const Discount = require('./Discount');

// Định nghĩa quan hệ giữa các bảng

// Category - Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Brand - Product
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

// Product - ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product - ProductVariant
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });


// User - Order
User.hasMany(Order, { foreignKey: 'buyer_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// ProductVariant - OrderItem
ProductVariant.hasMany(OrderItem, { foreignKey: 'variant_id', as: 'orderItems' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variant_id', as: 'variant' });


// Order - Payment
Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order - Discount
Discount.hasMany(Order, { foreignKey: 'id_ma_giam_gia', as: 'orders' });
Order.belongsTo(Discount, { foreignKey: 'id_ma_giam_gia', as: 'discount' });

// OrderItem - Review
OrderItem.hasOne(Review, { foreignKey: 'order_item_id', as: 'review' });
Review.belongsTo(OrderItem, { foreignKey: 'order_item_id', as: 'orderItem' });

// User - Review
User.hasMany(Review, { foreignKey: 'reviewer_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });

module.exports = {
  db,
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
  Payment,
  Review,
  Contact,
  Discount
};
