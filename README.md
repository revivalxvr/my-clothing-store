This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



// dengan tema ATELIER untuk outlet luxury assentials


implementasi API backend :
- API AUTH login, register, logout ✅
- API refresh token ✅
- API Get Profile ✅
- API Create Product ✅
- API Find Many Product ✅
_ API Find Category ✅
- API Create Order (commins soon)

const categories = ['All', 'Apparel', 'Outerwear', 'Essentials', 'Accessories'];

const initialProducts: AtelierProduct[] = [
  {
    id: 1,
    name: 'Minimalist Cashmere Knit Sweater',
    price: 145.00,
    sku: 'AST-APP-001',
    category_id: 1,
    category_name: 'Apparel',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600',
    badge: 'Bestseller',
    deskripsi: 'Handcrafted cashmere blend sweater designed for winter sophistication.'
  },
  {
    id: 2,
    name: 'Tailored Wool Blend Overcoat',
    price: 280.00,
    sku: 'AST-OUT-002',
    category_id: 2,
    category_name: 'Outerwear',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
    badge: 'New Season',
    deskripsi: 'Classic wool overcoat featuring Italian tailoring standards.'
  },
  {
    id: 3,
    name: 'Relaxed Fit Organic Cotton Tee',
    price: 45.00,
    sku: 'AST-ESS-003',
    category_id: 3,
    category_name: 'Essentials',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    badge: 'Sustainable',
    deskripsi: 'Ultra-soft organic cotton T-shirt crafted for everyday comfort.'
  },
  {
    id: 4,
    name: 'Pleated High-Waist Trousers',
    price: 120.00,
    sku: 'AST-APP-004',
    category_id: 1,
    category_name: 'Apparel',
    stock: 0, // Out of stock example
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600',
    badge: 'Limited',
    deskripsi: 'Tailored trousers with pleated details.'
  },
  {
    id: 5,
    name: 'Structured Leather Crossbody Bag',
    price: 210.00,
    sku: 'AST-ACC-005',
    category_id: 4,
    category_name: 'Accessories',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    badge: 'Popular',
    deskripsi: 'Premium Italian calfskin leather bag with gold hardware.'
  },
  {
    id: 6,
    name: 'Classic Silk Slip Dress',
    price: 165.00,
    sku: 'AST-APP-006',
    category_id: 1,
    category_name: 'Apparel',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fb1b?auto=format&fit=crop&q=80&w=600',
    badge: 'Trending',
    deskripsi: 'Pure Mulberry silk dress with delicate straps.'
  },
];