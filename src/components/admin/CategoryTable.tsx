'use client';

import { useState } from 'react';
import { 
  FolderTree, 
  Search, 
  Loader2,
  Trash2,
  Edit3
} from 'lucide-react';

export interface Category {
  id?: number;
  name: string;
  slug: string;
  deskripsi: string;
  is_active: boolean;
}

interface CategoryTableProps {
  categories: Category[];
  loading?: boolean;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (id: number) => void;
}

export default function CategoryTable({
  categories,
  loading = false,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search category name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#222222] pl-10 pr-4 py-2.5 text-xs text-[#FFFFFF] tracking-wide focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-[#555555]"
          />
          <Search size={15} className="absolute left-3.5 top-3 text-[#666666]" />
        </div>
      </div>

      {/* Table ATELIER Style */}
      <div className="bg-[#0A0A0A] border border-[#222222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222222] bg-[#0D0D0D] text-[#888888] uppercase text-[10px] tracking-[0.2em]">
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Slug</th>
                <th className="py-4 px-6 font-medium">Description</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#666666]">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#D4AF37]" />
                    <span className="text-xs uppercase tracking-widest">Loading Atelier Categories...</span>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#666666]">
                    <FolderTree size={24} className="mx-auto mb-2 text-[#444444]" />
                    <p className="text-xs uppercase tracking-widest">No Categories Found</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat.id || idx} className="hover:bg-[#111111] transition-colors group">
                    <td className="py-4 px-6 font-serif text-[#FFFFFF] tracking-wider font-medium">
                      {cat.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#888888] text-[11px]">
                      {cat.slug}
                    </td>
                    <td className="py-4 px-6 text-[#777777] max-w-xs truncate">
                      {cat.deskripsi || '-'}
                    </td>
                    <td className="py-4 px-6">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#333333] text-[#666666] text-[10px] tracking-wider uppercase">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {onEditCategory && (
                        <button 
                          onClick={() => onEditCategory(cat)}
                          className="text-[#666666] hover:text-[#D4AF37] transition-colors p-1"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                      {onDeleteCategory && cat.id && (
                        <button 
                          onClick={() => onDeleteCategory(cat.id!)}
                          className="text-[#666666] hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}