import React, { useState, useEffect } from 'react';
import { Check, FolderTree } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export function CategoryModal({ isOpen, onClose, category, onSave }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(category && category.id);

  useEffect(() => {
    if (category && isOpen) {
      setName(category.name || '');
      setError('');
    } else if (isOpen) {
      setName('');
      setError('');
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('O nome da categoria é obrigatório.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSave(name.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar categoria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Categoria' : 'Nova Categoria'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
            Nome da Categoria <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ex: Bolsas, Chaveiros, Decoração..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-cream-50 focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-cream-300 focus:border-sage-500 focus:ring-sage-200 text-earth-900'
            }`}
          />
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        <p className="text-xs text-earth-500 font-light">
          As categorias ajudam os clientes a filtrar suas peças com facilidade no catálogo.
        </p>

        <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-earth-700 hover:bg-cream-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-earth-800 hover:bg-earth-900 text-cream-50 shadow-soft transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Salvar Alteração' : 'Criar Categoria'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
