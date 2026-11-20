"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Search } from "lucide-react";
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
  onAddToCart: (product: Product, quantity: number) => void;
};

export default function ProductSection({ onAddToCart }: ProductSectionProps) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  // Simpan "All" atau id kategori (string/number) agar konsisten
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk menyimpan quantity setiap produk
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

        const rawProducts: Product[] = Array.isArray(prodResult?.data)
          ? prodResult.data
          : Array.isArray(prodResult)
          ? prodResult
          : [];

        const rawCategories: Category[] = Array.isArray(catResult?.data)
          ? catResult.data
          : Array.isArray(catResult)
          ? catResult
          : [];

        setProductsList(rawProducts);
        setCategoriesList(rawCategories);

        const initialQtys: { [key: string]: number } = {};
        rawProducts.forEach((p: Product) => {
          initialQtys[p.id] = 1;
        });
        setQuantities(initialQtys);
      } catch (error) {
        console.error("Failed to fetch atelier inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQtyChange = (
    productId: string,
    delta: number,
    maxStock: number
  ) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const updated = current + delta;

      if (updated < 1) return prev;
      if (updated > maxStock) return prev;

      return { ...prev, [productId]: updated };
    });
  };

  const filteredProducts = productsList.filter((product) => {
    // 1. Cocokkan kategori berdasarkan ID (prioritas) atau nama (fallback)
    let matchesCategory = selectedCategory === "All";

    if (!matchesCategory) {
      const productCatId = product.category_id ?? product.category?.id;
      if (productCatId !== undefined && productCatId !== null) {
        matchesCategory = String(productCatId) === selectedCategory;
      } else {
        const selectedCatObj = categoriesList.find(
          (c) => String(c.id) === selectedCategory
        );
        const prodCatName = (product.category?.name || "").trim().toLowerCase();
        const targetCatName = (selectedCatObj?.name || "")
          .trim()
          .toLowerCase();
        matchesCategory =
          prodCatName !== "" && prodCatName === targetCatName;
      }
    }

    // 2. Cocokkan pencarian nama atau SKU
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      Boolean(product.sku && product.sku.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="shop"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-colors duration-300"
    >
      {/* Section Heading & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">
            Curated Catalog
          </span>

          <h2 className="text-3xl font-serif text-stone-900 dark:text-white mt-1 transition-colors">
            Seasonless Essentials
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />

          <input
            type="text"
            placeholder="Search garments or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-xs pl-11 pr-4 py-3 rounded-full border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            selectedCategory === "All"
              ? "bg-stone-900 dark:bg-white text-white dark:text-stone-950 shadow-md"
              : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600"
          }`}
        >
          All
        </button>

        {categoriesList.map((category) => {
          const catIdStr = String(category.id);
          const isActive = selectedCategory === catIdStr;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => setSelectedCategory(catIdStr)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-950 shadow-md"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Loading / Empty / Product Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-stone-500 dark:text-stone-400">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-sm text-stone-500 dark:text-stone-400">
          No products found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentQty = quantities[product.id] || 1;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Product Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-900 dark:text-stone-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Stock Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm ${
                        product.stock > 5
                          ? "bg-stone-900/80 dark:bg-white/90 text-white dark:text-stone-900"
                          : "bg-amber-100/90 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : `Stock: ${product.stock}`}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 dark:text-white font-medium group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                      SKU: {product.sku || "N/A"}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-stone-900 dark:text-white">
                        Rp{product.price.toLocaleString("id-ID")}
                      </span>

                      {/* Quantity Selector */}
                      {!isOutOfStock && (
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800">
                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(product.id, -1, product.stock)
                            }
                            className="px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                          >
                            -
                          </button>

                          <span className="px-3 text-xs font-semibold text-stone-900 dark:text-stone-100">
                            {currentQty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(product.id, 1, product.stock)
                            }
                            className="px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, currentQty)}
                      disabled={isOutOfStock}
                      className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:text-white dark:disabled:text-stone-400 disabled:cursor-not-allowed py-3.5 rounded-xl font-medium text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />

                      {isOutOfStock
                        ? "Habis"
                        : `Add to Cart (${currentQty})`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}