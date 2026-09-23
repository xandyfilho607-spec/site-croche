import React, { useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Check, AlertCircle, X, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { uploadProductImage } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

export function ProductFormModal({ isOpen, onClose, product, categories = [], onSave }) {
  const toast = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Estados de upload de imagem
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(product && product.id);

  useEffect(() => {
    if (product && isOpen) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price ? String(product.price) : '');
      setCategoryId(product.category_id ? String(product.category_id) : '');
      setImageUrl(product.image_url || '');
      setPreviewUrl(product.image_url || '');
      setAvailable(product.available !== false);
      setFeatured(Boolean(product.featured));
      setSelectedFile(null);
      setUploadProgress(0);
      setErrors({});
    } else if (isOpen) {
      // Limpar formulário para novo produto
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId(categories.length > 0 ? String(categories[0].id) : '');
      setImageUrl('');
      setPreviewUrl('');
      setAvailable(true);
      setFeatured(false);
      setSelectedFile(null);
      setUploadProgress(0);
      setErrors({});
    }
  }, [product, isOpen, categories]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica do tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    // Validação de tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('A imagem deve ter no máximo 5MB.');
      return;
    }

    setSelectedFile(file);
    setImageUrl('');
    setUploadProgress(0);
    setIsUploading(true);
    setErrors((current) => ({ ...current, image: undefined }));

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      toast.info('Fazendo upload da imagem para o Cloudinary...');
      const uploadedUrl = await uploadProductImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(uploadedUrl);
    } catch (err) {
      console.error('Erro no upload da imagem:', err);
      setErrors((current) => ({
        ...current,
        image: err.message || 'Não foi possível enviar a imagem.',
      }));
      toast.error(err.message || 'Não foi possível enviar a imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'O nome do produto é obrigatório.';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Informe um preço válido maior que zero.';
    if (!categoryId) newErrors.categoryId = 'Selecione uma categoria.';
    if (selectedFile && (!imageUrl || isUploading)) {
      newErrors.image = 'Aguarde a conclusão do upload da imagem.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    let finalImageUrl = imageUrl;

    try {
      // A imagem já foi enviada ao Cloudinary ao ser selecionada.
      const productPayload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category_id: parseInt(categoryId, 10),
        image_url: finalImageUrl,
        available,
        featured,
      };

      await onSave(productPayload);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      toast.error(err.message || 'Ocorreu um erro ao salvar o produto.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Produto de Crochê' : 'Cadastrar Novo Produto'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload e Pré-visualização da Imagem */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-2">
            Foto do Produto (Cloudinary)
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Box da Pré-visualização */}
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-cream-100 border-2 border-dashed border-cream-300 flex items-center justify-center flex-shrink-0 group">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Pré-visualização da peça"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                    title="Remover imagem"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="text-center p-2 text-earth-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px] block font-light">Sem foto</span>
                </div>
              )}
            </div>

            {/* Ações de Upload */}
            <div className="flex-1 space-y-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-100/70 hover:bg-cream-200 text-earth-800 text-xs font-medium transition-colors">
                <UploadCloud className="w-4 h-4 text-sage-600" />
                <span>{previewUrl ? 'Substituir Imagem' : 'Selecionar Imagem do Computador'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <p className="text-[11px] text-earth-500 font-light">
                Formatos suportados: JPG, PNG, WEBP. A foto será enviada diretamente para o Cloudinary e o link salvo no banco Neon.
              </p>
              {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}

              {/* Barra de Progresso do Upload */}
              {isUploading && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-sage-700 font-medium">
                    <span>Enviando foto...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campos de Dados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Nome da Peça <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bolsa Floral em Fio Náutico"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-cream-50 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-cream-300 focus:border-sage-500 focus:ring-sage-200 text-earth-900'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Preço (R$) <span className="text-rose-600">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="85.00"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-cream-50 focus:outline-none focus:ring-2 transition-all ${
                errors.price
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-cream-300 focus:border-sage-500 focus:ring-sage-200 text-earth-900'
              }`}
            />
            {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Categoria <span className="text-rose-600">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-earth-900 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-rose-600 mt-1">{errors.categoryId}</p>}
          </div>

          {/* Descrição */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Descrição Detalhada
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fale sobre o material, dimensões, cores disponíveis, forro e cuidados..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-earth-900 focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all resize-none"
            />
          </div>

          {/* Toggles: Disponível e Destaque */}
          <div className="sm:col-span-2 pt-2 border-t border-cream-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-cream-100/60 border border-cream-200 cursor-pointer hover:bg-cream-200/50 transition-colors">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 text-sage-600 rounded border-cream-300 focus:ring-sage-500"
              />
              <div>
                <span className="text-xs font-semibold text-earth-900 block">Produto Disponível</span>
                <span className="text-[11px] text-earth-500 block">Desmarque caso a peça esteja esgotada</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-cream-100/60 border border-cream-200 cursor-pointer hover:bg-cream-200/50 transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-gold-500 rounded border-cream-300 focus:ring-gold-400"
              />
              <div>
                <span className="text-xs font-semibold text-earth-900 block">Exibir em Destaque</span>
                <span className="text-[11px] text-earth-500 block">Aparece na vitrine principal da Home</span>
              </div>
            </label>
          </div>
        </div>

        {/* Ações do Formulário */}
        <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-medium text-earth-700 hover:bg-cream-200 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-6 py-2.5 rounded-xl text-xs font-medium bg-earth-800 hover:bg-earth-900 text-cream-50 shadow-soft transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Salvando no Neon...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Atualizar Produto' : 'Cadastrar Produto'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
