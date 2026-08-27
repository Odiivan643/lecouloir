import React from 'react';
import { Pen, BookOpen, Triangle, Calculator, Backpack, Palette } from 'lucide-react';

interface ProductIconProps {
  type: 'pen' | 'book' | 'geometry' | 'calculator' | 'bag' | 'art';
  className?: string;
  size?: number;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ type, className = "w-12 h-12 text-black stroke-[1.5]", size = 48 }) => {
  switch (type) {
    case 'pen':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={{ width: size, height: size }}
        >
          <path d="M42 12l10 10L22 52H12v-10L42 12z" />
          <path d="M37 17l10 10" />
          <path d="M35 56h16" />
        </svg>
      );
    case 'book':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={{ width: size, height: size }}
        >
          <path d="M8 16c6-4 16-4 24 2 8-6 18-6 24-2v36c-6-4-16-4-24 2-8-6-18-6-24-2V16z" />
          <path d="M32 18v36" />
        </svg>
      );
    case 'geometry':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={{ width: size, height: size }}
        >
          <path d="M12 52V12l40 40H12z" />
          <path d="M22 42v-8l8 8h-8z" />
          <path d="M12 24h6" />
          <path d="M12 34h6" />
          <path d="M12 44h6" />
          <path d="M24 52v-6" />
          <path d="M34 52v-6" />
          <path d="M44 52v-6" />
        </svg>
      );
    case 'calculator':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={{ width: size, height: size }}
        >
          <rect x="14" y="8" width="36" height="48" rx="6" />
          <rect x="20" y="14" width="24" height="10" rx="2" />
          <circle cx="23" cy="32" r="2.5" fill="currentColor" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" />
          <circle cx="41" cy="32" r="2.5" fill="currentColor" />
          <circle cx="23" cy="40" r="2.5" fill="currentColor" />
          <circle cx="32" cy="40" r="2.5" fill="currentColor" />
          <circle cx="41" cy="40" r="2.5" fill="currentColor" />
          <circle cx="23" cy="48" r="2.5" fill="currentColor" />
          <circle cx="32" cy="48" r="2.5" fill="currentColor" />
          <circle cx="41" cy="48" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'bag':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={{ width: size, height: size }}
        >
          <path d="M24 16V10a6 6 0 0112 0v6" />
          <rect x="14" y="16" width="36" height="38" rx="8" />
          <rect x="20" y="32" width="24" height="14" rx="4" />
          <path d="M32 38v4" />
        </svg>
      );
    case 'art':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          style={{ width: size, height: size }}
        >
          <path d="M26 8h12v6H26z" />
          <path d="M24 14l-4 12v26a4 4 0 004 4h16a4 4 0 004-4V26l-4-12H24z" />
          <path d="M32 40v8" />
        </svg>
      );
    default:
      return <Pen className={className} />;
  }
};
