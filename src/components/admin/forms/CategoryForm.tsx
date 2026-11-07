'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Tag, Sparkles, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Category } from '../CategoryTable';

interface CategoryFormProps {
  onCancel: () => void;
  onSubmit: (payload: Category) => Promise<void>;
}

export default function CategoryForm({ onCancel, onSubmit }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Category>({
    name: '',
    slug: '',
    deskripsi: '',
    is_active: true,
  });

  const calculateReadinessScore = () => {
    let score = 0;
    if (formData.name.trim().length > 0) score += 40;
    if (formData.slug.trim().length > 0) score += 30;
    if (formData.deskripsi.trim().length > 5) score += 30;
    return score;
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({ ...prev, name: value, slug: generatedSlug }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
              Category Name <span className="text-[#D4AF37]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Fine Jewelry, Haute Couture"
              className="w-full bg-[#111111] border border-[#262626] px-4 py-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
              URL Slug
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="fine-jewelry"
                className="w-full bg-[#111111] border border-[#262626] pl-9 pr-4 py-2.5 text-xs text-[#888888] font-mono focus:outline-none focus:border-[#D4AF37]"
              />
              <Tag size={14} className="absolute left-3.5 top-3 text-[#555555]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))}
              placeholder="Handcrafted luxury pieces..."
              className="w-full bg-[#111111] border border-[#262626] p-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-4">
          <div className="bg-[#111111] p-4 border border-[#222222] space-y-2">
            <span className="block text-[10px] uppercase tracking-widest text-[#888888]">Visibility</span>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#FFFFFF] flex items-center gap-1.5">
                {formData.is_active ? <Eye size={14} className="text-[#D4AF37]" /> : <EyeOff size={14} className="text-[#666666]" />}
                {formData.is_active ? 'Active' : 'Draft'}
              </span>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
                className={`w-9 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${formData.is_active ? 'bg-[#D4AF37] justify-end' : 'bg-[#222222] justify-start'}`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#0A0A0A]" />
              </button>
            </div>
          </div>

          <div className="bg-[#111111] p-4 border border-[#222222] space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
              <span className="text-[#888888]">Readiness</span>
              <span className="text-[#D4AF37] font-serif">{calculateReadinessScore()}%</span>
            </div>
            <div className="w-full bg-[#0A0A0A] h-1 rounded-full overflow-hidden border border-[#222222]">
              <div className="bg-[#D4AF37] h-full transition-all duration-300" style={{ width: `${calculateReadinessScore()}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="border-t border-[#222222] pt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-[#333333] hover:border-[#666666] text-[#AAAAAA] hover:text-[#FFFFFF] text-xs uppercase tracking-widest transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.name}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A0A0A] font-medium text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-40"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          <span>{isSubmitting ? 'Saving...' : 'Save Category'}</span>
        </button>
      </div>
    </form>
  );
}