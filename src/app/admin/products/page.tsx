"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  Eye,
  AlertCircle,
} from "lucide-react";
// Menggunakan API client yang sudah Anda buat
import { productApi } from "@/lib/productClient";

// Tipe Data Category sesuai Backend Go
export type Category = {
  id: number;
  name: string;
  slug: string;
  deskripsi: string;
  is_active: boolean;
};

// Tipe Data DTO Produk disesuaikan dengan Struct Go Backend (Category berupa objek)
export type AtelierProduct = {
  id: string; // Menggunakan string/UUID sesuai database Anda
  name: string;
  price: number;
  sku?: string;
  image_id?: string;
  image: string;
  stock: number;
  category_id?: number;
  category?: Category; // Relasi object dari GORM Preload
  length?: number;
  width?: number;
  height?: number;
  deskripsi?: string;
  badge?: string;
};

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<AtelierProduct[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data Products & Categories menggunakan productApi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Sesuaikan pemanggilan method dengan struktur productApi Anda
        // Contoh jika menggunakan axios/fetch wrapper:
        const [prodRes, catRes] = await Promise.all([
          productApi.get("/products?page=1&limit=10"), 
          productApi.get("/categories?page=1&limit=10"), 
        ]);

        // Mengambil data dari response (menyesuaikan apakah menggunakan axios .data atau fetch .json())
        const prodResult = prodRes.data || prodRes;
        const catResult = catRes.data || catRes;

        if (prodResult && prodResult.data) {
          setProductsList(prodResult.data);
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

  // Filter logika kategori & search
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

  // Handler Hapus Produk
  const handleDeleteProduct = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to remove this piece from the Atelier catalog?",
      )
    ) {
      try {
        // Contoh jika menggunakan productApi untuk delete:
        // await productApi.delete(`/products/${id}`);
        setProductsList((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#222222] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
            Curated Atelier Collection
          </span>
          <h1 className="text-2xl font-serif tracking-[0.15em] text-[#FFFFFF] mt-1">
            PIECES & INVENTORY
          </h1>
          <p className="text-xs text-[#666666] tracking-wider mt-1">
            Manage, inspect, and update your luxury outlet items from database
          </p>
        </div>

        {/* Tombol Add New Product */}
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A0A0A] font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md"
        >
          <Plus size={16} />
          <span>Add New Piece</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search piece name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#222222] pl-10 pr-4 py-2.5 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#555555]"
          />
          <Search
            size={15}
            className="absolute left-3.5 top-3 text-[#666666]"
          />
        </div>

        {/* Category Filters Dinamis dari Database */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 text-xs tracking-wider transition-all border ${
              selectedCategory === "All"
                ? "bg-[#141414] text-[#D4AF37] border-[#D4AF37]"
                : "bg-[#0A0A0A] text-[#888888] border-[#222222] hover:text-[#FFFFFF] hover:border-[#444444]"
            }`}
          >
            All
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 text-xs tracking-wider transition-all border ${
                selectedCategory === cat.name
                  ? "bg-[#141414] text-[#D4AF37] border-[#D4AF37]"
                  : "bg-[#0A0A0A] text-[#888888] border-[#222222] hover:text-[#FFFFFF] hover:border-[#444444]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-20 bg-[#0A0A0A] border border-[#222222]">
          <p className="text-xs text-[#888888] uppercase tracking-widest animate-pulse">
            Loading Atelier Inventory...
          </p>
        </div>
      ) : (
        /* Product Grid (Atelier Luxury Layout) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#0A0A0A] border border-[#222222] hover:border-[#D4AF37]/50 overflow-hidden flex flex-col transition-all duration-300 relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-[#111111] overflow-hidden">
                <img
                  src={
                    product.image ||
                    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />

                {/* Badge Overlay */}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#0A0A0A]/90 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em] backdrop-blur-md">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Stock Indicator Badge */}
                <div className="absolute top-4 right-4">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 bg-[#0A0A0A]/90 border border-[#222222] text-[#888888] px-2.5 py-1 text-[9px] uppercase tracking-wider backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Qty: {product.stock}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#0A0A0A]/90 border border-rose-900/50 text-rose-400 px-2.5 py-1 text-[9px] uppercase tracking-wider backdrop-blur-md">
                      <AlertCircle size={10} />
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quick Action Overlay (Terlihat saat Hover) */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                  <button
                    onClick={() => alert(`Preview piece: ${product.name}`)}
                    className="flex-1 bg-[#0A0A0A]/90 hover:bg-[#141414] text-[#FFFFFF] border border-[#333333] hover:border-[#D4AF37] py-2.5 text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                  >
                    <Eye size={14} />
                    Inspect
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2.5 bg-[#0A0A0A]/90 hover:bg-rose-950 text-[#888888] hover:text-rose-400 border border-[#333333] transition-all backdrop-blur-md"
                    title="Delete Piece"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Product Details Area */}
              <div className="p-6 flex flex-col flex-grow justify-between border-t border-[#1A1A1A]">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#666666] tracking-widest uppercase mb-1.5">
                    <span>{product.category?.name || "Uncategorized"}</span>
                    <span className="font-mono text-[#888888]">
                      {product.sku || "N/A"}
                    </span>
                  </div>

                  <h3 className="font-serif text-base text-[#FFFFFF] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {product.deskripsi && (
                    <p className="text-[11px] text-[#777777] line-clamp-2 mt-2 leading-relaxed">
                      {product.deskripsi}
                    </p>
                  )}
                </div>

                {/* Pricing & Edit Button */}
                <div className="mt-5 pt-4 border-t border-[#1A1A1A] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#666666] uppercase tracking-widest block">
                      Price
                    </span>
                    <span className="text-base font-medium text-[#D4AF37] font-serif">
                      Rp{" "}
                      {product.price
                        ? product.price.toLocaleString("id-ID")
                        : "0"}
                    </span>
                  </div>

                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[#888888] hover:text-[#FFFFFF] transition-colors py-1 px-2 border border-[#222222] hover:border-[#444444]"
                  >
                    <Edit3 size={12} />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fallback Jika Tidak Ada Hasil */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-[#0A0A0A] border border-[#222222]">
          <Package className="mx-auto h-10 w-10 text-[#444444] mb-3" />
          <p className="text-xs text-[#888888] uppercase tracking-widest">
            No Atelier Pieces Found
          </p>
          <p className="text-[11px] text-[#555555] mt-1">
            Try adjusting your search query or filter selection.
          </p>
        </div>
      )}
    </div>
  );
}
