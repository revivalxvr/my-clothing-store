"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Package,
  Ruler,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { productApi } from "@/lib/productClient";

// Tipe Data Category sesuai Backend Go
export type Category = {
  id: number;
  name: string;
  slug: string;
  deskripsi: string;
  is_active: boolean;
};

interface ProductFormState {
  name: string;
  price: number | string;
  sku: string;
  image_id: string;
  image: string;
  stock: number | string;
  category_id: number | string;
  length: number | string;
  width: number | string;
  height: number | string;
  deskripsi: string;
}

const initialFormState: ProductFormState = {
  name: "",
  price: "",
  sku: "",
  image_id: "",
  image: "",
  stock: "",
  category_id: "",
  length: "",
  width: "",
  height: "",
  deskripsi: "",
};

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductFormState>(initialFormState);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch Categories dari Database saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productApi.get("/categories?page=1&limit=10");
        const result = res.data || res;
        if (result && result.data) {
          setCategoriesList(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle Input Biasa
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image Upload Handler
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const dummyUrl = URL.createObjectURL(file);
      setImagePreview(dummyUrl);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: "",
      image_id: "",
    }));
  };

  // 1. Helper Validasi Input Form
  const validateForm = (
    imageFile: File | null,
    categoryIdRaw: string | number,
  ): { isValid: boolean; categoryId: number; errorMsg?: string } => {
    if (!imageFile) {
      return {
        isValid: false,
        categoryId: 0,
        errorMsg: "Silakan pilih gambar produk terlebih dahulu!",
      };
    }

    const categoryId = Number(categoryIdRaw);
    if (
      categoryIdRaw === "" ||
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      return {
        isValid: false,
        categoryId: 0,
        errorMsg: "Silakan pilih kategori produk yang valid!",
      };
    }

    return { isValid: true, categoryId };
  };

  // 2. Helper Pembentuk FormData
  const buildProductFormData = (
    formData: ProductFormState,
    imageFile: File,
    categoryId: number,
  ): FormData => {
    const formDataToSend = new FormData();

    formDataToSend.append("product_image", imageFile);
    formDataToSend.append("name", formData.name);
    formDataToSend.append(
      "price",
      String(parseFloat(formData.price as string) || 0),
    );
    formDataToSend.append("sku", formData.sku);
    formDataToSend.append(
      "stock",
      String(parseInt(formData.stock as string, 10) || 0),
    );
    formDataToSend.append(
      "length",
      String(parseFloat(formData.length as string) || 0),
    );
    formDataToSend.append(
      "width",
      String(parseFloat(formData.width as string) || 0),
    );
    formDataToSend.append(
      "height",
      String(parseFloat(formData.height as string) || 0),
    );
    formDataToSend.append("deskripsi", formData.deskripsi);
    formDataToSend.append("category_id", String(categoryId));

    return formDataToSend;
  };

  // 3. Main Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi Form
    const { isValid, categoryId, errorMsg } = validateForm(
      imageFile,
      formData.category_id,
    );
    if (!isValid) {
      alert(errorMsg);
      return;
    }

    setIsSubmitting(true);

    // Buat Payload FormData
    const formDataToSend = buildProductFormData(
      formData,
      imageFile!,
      categoryId,
    );

    try {
      const response = await productApi.post("/products", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      alert("Produk berhasil ditambahkan!");

      // Reset Form State
      setFormData(initialFormState);
      setImagePreview(null);
      setImageFile(null);

      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        "Gagal menambahkan produk. Terjadi timeout atau kesalahan pada server.",
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk cek kelengkapan data (Readiness Score)
  const isNameFilled = formData.name.trim().length > 0;
  const isPriceValid = Number(formData.price) > 0;
  const isCategorySelected = formData.category_id !== "";
  const isStockValid = formData.stock !== "" && Number(formData.stock) >= 0;
  const isImageUploaded = imageFile !== null;
  const isDimensionsFilled =
    Number(formData.length) > 0 ||
    Number(formData.width) > 0 ||
    Number(formData.height) > 0;

  const checklistItems = [
    { label: "Product Title", status: isNameFilled },
    { label: "Pricing Strategy", status: isPriceValid },
    { label: "Category Assignment", status: isCategorySelected },
    { label: "Stock Quantity", status: isStockValid },
    { label: "Piece Imagery", status: isImageUploaded },
    { label: "Physical Dimensions", status: isDimensionsFilled },
  ];

  const completedCount = checklistItems.filter((i) => i.status).length;
  const completionPercentage = Math.round(
    (completedCount / checklistItems.length) * 100,
  );

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Header & Back Navigation */}
      <div className="flex items-center justify-between mb-8 border-b border-[#222222] pb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#888888] hover:text-[#D4AF37] transition-colors mb-3"
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>
          <h1 className="text-2xl font-serif tracking-[0.15em] text-[#FFFFFF]">
            CREATE NEW PIECE
          </h1>
          <p className="text-xs text-[#666666] tracking-[0.1em] mt-1">
            Register a luxury item into the Assentilas Atelier collection
          </p>
        </div>

        <button
          type="submit"
          form="product-form"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A0A0A] font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <Sparkles size={16} />
          {isSubmitting ? "Saving..." : "Publish Piece"}
        </button>
      </div>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Kolom Kiri & Tengah: Form Utama */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0A0A0A] border border-[#222222] p-6 rounded-sm space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] border-b border-[#1A1A1A] pb-3">
              <Package size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFFFFF]">
                General Information
              </h2>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                Product Name <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Velvet Tailored Blazer"
                className="w-full bg-[#111111] border border-[#262626] px-4 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                Atelier Description
              </label>
              <textarea
                name="deskripsi"
                rows={5}
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Crafted from Italian silk velvet with handcrafted gold-thread embroidery..."
                className="w-full bg-[#111111] border border-[#262626] p-4 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444] resize-none"
              />
            </div>

            {/* Category ID & SKU Dinamis dari Database */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  Category <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#111111] border border-[#262626] px-4 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (ID: {cat.id})
                      </option>
                    ))}
                  </select>
                  <Layers
                    size={14}
                    className="absolute right-4 top-3.5 text-[#666666] pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="AST-HC-2026-001"
                  className="w-full bg-[#111111] border border-[#262626] px-4 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-[#0A0A0A] border border-[#222222] p-6 rounded-sm space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] border-b border-[#1A1A1A] pb-3">
              <DollarSign size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFFFFF]">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  Price (IDR) <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="4500000"
                    className="w-full bg-[#111111] border border-[#262626] pl-9 pr-4 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
                  />
                  <span className="absolute left-3.5 top-3 text-xs text-[#666666]">
                    Rp
                  </span>
                </div>
                {/* Teks bantuan untuk mempermudah pembacaan angka */}
                {formData.price && (
                  <span className="text-[10px] text-[#3efd09] mt-1 block">
                    Terbaca: Rp {Number(formData.price).toLocaleString("id-ID")}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  Stock Quantity <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full bg-[#111111] border border-[#262626] px-4 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
                />
              </div>
            </div>
          </div>

          {/* Physical Dimensions */}
          <div className="bg-[#0A0A0A] border border-[#222222] p-6 rounded-sm space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] border-b border-[#1A1A1A] pb-3">
              <Ruler size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFFFFF]">
                Dimensions (cm / inches)
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  Length
                </label>
                <input
                  type="number"
                  name="length"
                  step="0.1"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="30.5"
                  className="w-full bg-[#111111] border border-[#262626] px-3 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  Width
                </label>
                <input
                  type="number"
                  name="width"
                  step="0.1"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="15.0"
                  className="w-full bg-[#111111] border border-[#262626] px-3 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
                  Height
                </label>
                <input
                  type="number"
                  name="height"
                  step="0.1"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="45.0"
                  className="w-full bg-[#111111] border border-[#262626] px-3 py-3 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#444444]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Media & Readiness */}
        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border border-[#222222] p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFFFFF]">
                Piece Imagery <span className="text-[#D4AF37]">*</span>
              </h2>
              <span className="text-[10px] text-[#666666] tracking-wider uppercase">
                High Res
              </span>
            </div>

            {imagePreview ? (
              <div className="relative group aspect-3/4 bg-[#111111] border border-[#222222] overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 bg-[#0A0A0A]/80 text-[#FFFFFF] hover:text-[#ff4d4d] border border-[#333333] transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-[#D4AF37] tracking-widest uppercase">
                  Image Attached
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#262626] hover:border-[#D4AF37]/50 bg-[#111111]/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all aspect-3/4 group">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#666666] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-colors mb-4">
                  <Upload size={20} />
                </div>
                <p className="text-xs text-[#CCCCCC] tracking-wider mb-1">
                  Click to upload imagery
                </p>
                <p className="text-[10px] text-[#666666] tracking-widest uppercase">
                  PNG, JPG or WEBP (Max 1MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Readiness Checklist */}
          <div className="bg-[#0A0A0A] border border-[#222222] p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShieldCheck size={16} />
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FFFFFF]">
                  Readiness Score
                </h3>
              </div>
              <span className="text-xs font-mono text-[#D4AF37]">
                {completionPercentage}%
              </span>
            </div>

            <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <ul className="space-y-2.5 pt-2">
              {checklistItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-xs tracking-wider"
                >
                  <span
                    className={
                      item.status ? "text-[#CCCCCC]" : "text-[#555555]"
                    }
                  >
                    {item.label}
                  </span>
                  {item.status ? (
                    <CheckCircle2 size={14} className="text-[#D4AF37]" />
                  ) : (
                    <AlertCircle size={14} className="text-[#333333]" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
