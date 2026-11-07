"use client";

import { useEffect, useState } from "react";
import { Heart, Star, ShoppingBag, ChevronRight, Search } from "lucide-react";
import { productApi } from "@/lib/productClient";

export type Product = {
  id: string;
  name: string;
  price: number;
  sku?: string;
  image_id?: string;
  image: string;
  stock: number;
  category_id?: number;
  category?: Category;
  length?: number;
  width?: number;
  height?: number;
  deskripsi?: string;
  badge?: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  deskripsi: string;
  is_active: boolean;
};

type ProductSectionProps = {
  // Ubah tipe onAddToCart agar menerima parameter product dan quantity
  onAddToCart: (product: Product, quantity: number) => void;
};

export default function ProductSection({ onAddToCart }: ProductSectionProps) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk menyimpan pilihan jumlah (quantity) per produk berdasarkan ID-nya
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [prodRes, catRes] = await Promise.all([
          productApi.get("/products?page=1&limit=10"),
          productApi.get("/categories?page=1&limit=10"),
        ]);

        const prodResult = prodRes.data || prodRes;
        const catResult = catRes.data || catRes;

        if (prodResult && prodResult.data) {
          setProductsList(prodResult.data);
          
          // Inisialisasi default quantity = 1 untuk setiap produk
          const initialQtys: { [key: string]: number } = {};
          prodResult.data.forEach((p: Product) => {
            initialQtys[p.id] = 1;
          });
          setQuantities(initialQtys);
        }
        if (catResult && catResult.data) {
          setCategoriesList(catResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch atelier inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler untuk mengubah quantity per produk
  const handleQtyChange = (productId: string, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const updated = current + delta;
      if (updated < 1) return prev;
      if (updated > maxStock) return prev; // Batasi agar tidak melebihi sisa stok
      return { ...prev, [productId]: updated };
    });
  };

  const filteredProducts = productsList.filter((product) => {
    const categoryName = product.category?.name || "Uncategorized";
    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku &&
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Heading & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Curated Catalog
          </span>

          <h2 className="text-3xl font-serif text-stone-900 mt-1">
            Seasonless Essentials
          </h2>
        </div>

        {/* Search Input dengan Tema Senada */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search garments or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-stone-900 placeholder-stone-400 text-xs pl-11 pr-4 py-3 rounded-full border border-stone-200 focus:outline-none focus:border-stone-900 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            selectedCategory === "All"
              ? "bg-stone-900 text-white shadow-md"
              : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
          }`}
        >
          All
        </button>
        {categoriesList.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === category.name
                ? "bg-stone-900 text-white shadow-md"
                : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const currentQty = quantities[product.id] || 1;
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Product Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Sisa Stok Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm ${
                    product.stock > 5 ? "bg-stone-900/80 text-white" : "bg-amber-100/90 text-amber-800"
                  }`}>
                    {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-serif text-lg text-stone-900 font-medium group-hover:text-stone-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">SKU: {product.sku || "N/A"}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-stone-900">
                      Rp{product.price.toLocaleString("id-ID")}
                    </span>

                    {/* Quantity Selector Controller */}
                    {!isOutOfStock && (
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => handleQtyChange(product.id, -1, product.stock)}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-stone-900">
                          {currentQty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.id, 1, product.stock)}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => onAddToCart(product, currentQty)}
                    disabled={isOutOfStock}
                    className="w-full bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-medium text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? "Habis" : `Add to Cart (${currentQty})`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}