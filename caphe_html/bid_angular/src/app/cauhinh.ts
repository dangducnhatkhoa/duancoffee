// false = dùng API Vercel (cần deploy backend mới lên Vercel để đánh giá hoạt động)
// true  = dùng backend local tại http://localhost:3000 (cần file .env + chạy: node index.js)
export const USE_LOCAL_API = false;

export const BASE_API = USE_LOCAL_API
  ? 'http://localhost:3000/api/'
  : 'https://duancoffee-bcu2.vercel.app/api/';
