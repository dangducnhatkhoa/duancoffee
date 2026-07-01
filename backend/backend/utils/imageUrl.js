const path = require('path');

function normalizeImagePath(url) {
  if (!url) return null;
  const value = String(url).trim();
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/images/')) return value;
  if (value.startsWith('images/')) return `/${value}`;
  return `/images/products/${value}`;
}

function getPublicFilePath(imageUrl) {
  const normalized = normalizeImagePath(imageUrl);
  if (!normalized || normalized.startsWith('http')) return null;
  return path.join('public', normalized.replace(/^\//, ''));
}

function sortImages(images = []) {
  return [...images].sort((a, b) => {
    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

function pickPrimaryImageRaw(productJson) {
  const images = sortImages(productJson.images || []);
  return images[0]?.image_url || productJson.image || null;
}

module.exports = {
  normalizeImagePath,
  getPublicFilePath,
  sortImages,
  pickPrimaryImageRaw,
};
