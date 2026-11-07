'use client';

import { useState, useEffect } from 'react';
import CategoryTable, { Category } from '@/src/components/admin/CategoryTable';
import Modal from '@/src/components/admin/ui/Modal';
import CategoryForm from '@/src/components/admin/forms/CategoryForm';
import { productApi } from '@/lib/productClient';
import { Plus, FolderTree } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productApi.get('/categories?page=1&limit=10');
      const data = response.data?.data || response.data || [];
      setCategories(data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (payload: Category) => {
    await productApi.post('/categories', payload);
    await fetchCategories();
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">Atelier Management</span>
          <h1 className="text-2xl font-serif text-[#FFFFFF] mt-1">CATEGORIES CURATION</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0A0A0A] text-xs uppercase tracking-[0.2em]"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <CategoryTable categories={categories} loading={loading} />

      {/* Memakai Modal Generik */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
        subtitle="Assentilas Atelier Management"
        icon={FolderTree}
      >
        <CategoryForm 
          onCancel={() => setIsModalOpen(false)} 
          onSubmit={handleCreateCategory} 
        />
      </Modal>
    </div>
  );
}