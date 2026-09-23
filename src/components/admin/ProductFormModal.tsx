import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Product } from '../../types';
import { uploadImage, deleteUploadedImage } from '../../lib/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: { id: string; label: string }[];
  editingProduct: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingProduct,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('24');
  const [category, setCategory] = useState('cahiers');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSubtitle(editingProduct.subtitle || '');
      setPrice(String(editingProduct.price));
      setStock(String((editingProduct as any).stockCount ?? 20));
      setCategory(editingProduct.category);
      setImageUrl((editingProduct as any).image || '');
    } else {
      setName('');
      setSubtitle('');
      setPrice('');
      setStock('24');
      setCategory(categories[0]?.id || 'cahiers');
      setImageUrl('');
    }
    setUploadError(null);
  }, [editingProduct, categories, isOpen]);

  if (!isOpen) return null;

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image est trop volumineuse (max 5 Mo)");
      return;
    }
    setUploadError(null);
    setUploading(true);
    // supprime l'ancienne image R2 si on la remplace
    if (imageUrl && imageUrl.startsWith('http')) {
      deleteUploadedImage(imageUrl).catch(() => {});
    }
    try {
      const res = await uploadImage(file);
      setImageUrl(res.url);
    } catch (err: any) {
      // Fallback dev (R2 non configuré) : data URL locale
      const dataUrl = await toDataUrl(file);
      setImageUrl(dataUrl);
      setUploadError(
        (err?.message || 'Upload R2 indisponible') + ' — image stockée localement (temporaire).'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (imageUrl && imageUrl.startsWith('http')) {
      deleteUploadedImage(imageUrl).catch(() => {});
    }
    setImageUrl('');
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const finalImage =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

    const payload: any = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Fourniture scolaire de qualité',
      description: (editingProduct as any)?.description || 'Article de papeterie sélectionné pour les élèves et professionnels.',
      price: Number(price),
      category: category as any,
      stockCount: Number(stock) || 0,
      inStock: (Number(stock) || 0) > 0,
      rating: editingProduct?.rating || 5.0,
      reviewCount: (editingProduct as any)?.reviewCount || 1,
      image: finalImage,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-['Poppins']">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <h3 className="text-base font-bold text-neutral-900">
            {editingProduct ? "Modifier l'article" : 'Ajouter un nouvel article'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 uppercase mb-1">Nom de l'article *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cahier de dessin 200 pages"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 uppercase mb-1">Description courte</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Couverture rigide - Papier 90g"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-neutral-700 uppercase mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                required
                min="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2000"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-700 uppercase mb-1">Stock initial *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 uppercase mb-1">Catégorie *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 font-medium"
            >
              {categories
                .filter((c) => c.id !== 'all')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 uppercase mb-1">Image de l'article *</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/png, image/jpeg, image/webp, image/jpg"
              className="hidden"
            />

            {uploading ? (
              <div className="w-full h-32 border border-neutral-200 bg-neutral-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="font-bold text-neutral-700">Envoi de l'image…</p>
              </div>
            ) : imageUrl ? (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 group">
                <img src={imageUrl} alt="Aperçu" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-neutral-900 font-bold rounded-xl shadow-xs"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-xl shadow-xs"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-neutral-300 hover:border-blue-500 bg-neutral-50 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-neutral-400" />
                <p className="font-bold text-neutral-700">Cliquez pour choisir une photo</p>
                <p className="text-[10px] text-neutral-400">Format PNG, JPG ou WEBP (Max 5 Mo)</p>
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                {uploadError}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 font-bold rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? 'Patientez…' : "Enregistrer l'article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};