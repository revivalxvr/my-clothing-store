'use client';

import { ReactNode } from 'react';
import { X, LucideIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = '2xl',
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`bg-[#0A0A0A] border border-[#222222] w-full ${maxWidthClasses[maxWidth]} overflow-hidden shadow-2xl relative`}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-[#0D0D0D]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Icon size={16} />
              </div>
            )}
            <div>
              <h2 className="font-serif text-lg tracking-[0.15em] text-[#FFFFFF] uppercase">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] tracking-widest text-[#666666] uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#FFFFFF] transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content / Form Area (Dynamic Children) */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}