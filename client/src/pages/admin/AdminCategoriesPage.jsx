import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, RefreshCw, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function AdminCategoriesPage() {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res?.data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      toast.error('Erro ao carregar categorias do banco Neon.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (name) => {
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, name);
        toast.success(`Categoria "${name}" atualizada com sucesso!`);
      } else {
        await api.createCategory(name);
        toast.success(`Categoria "${name}" criada no Neon!`);
      }
      loadCategories();
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar categoria.');
      throw err;
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmMessage = category.product_count > 0
      ? `A categoria "${category.name}" possui ${category.product_count} produto(s) associado(s). Deseja realmente excluí-la? Os produtos ficarão sem categoria definida.`
      : `Deseja excluir a categoria "${category.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        await api.deleteCategory(category.id);
        toast.success(`Categoria "${category.name}" excluída.`);
        loadCategories();
      } catch (err) {
        toast.error(err.message || 'Erro ao excluir categoria.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Topo da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Categorias de Crochê
          </h1>
          <p className="text-xs text-earth-600 font-light mt-0.5">
            Crie e gerencie as seções do seu catálogo para que seus clientes encontrem tudo com facilidade.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCategories}
            className="p-2.5 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-200 text-earth-700 transition-colors"
            title="Recarregar categorias"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 text-xs font-medium shadow-soft transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Categoria</span>
          </button>
        </div>
      </div>

      {/* Listagem de Categorias */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner size="lg" text="Buscando categorias no Neon..." />
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center bg-cream-50 rounded-2xl border border-cream-200 p-8 space-y-3">
          <FolderTree className="w-12 h-12 text-earth-400 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-earth-900">
            Nenhuma categoria cadastrada
          </h3>
          <p className="text-xs text-earth-600 font-light max-w-sm mx-auto">
            Crie categorias como "Bolsas", "Porta-moedas", "Decoração", etc.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-5 rounded-2xl bg-cream-50 border border-cream-200 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center flex-shrink-0">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-earth-900">
                      {category.name}
                    </h3>
                    <span className="text-[11px] text-earth-500 font-light block">
                      Criada em {formatDate(category.created_at, false)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="p-1.5 rounded-lg text-earth-600 hover:text-earth-950 hover:bg-cream-200 transition-colors"
                    title="Editar categoria"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Excluir categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-cream-200/80 flex items-center justify-between text-xs text-earth-600">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-earth-400" />
                  <span>Produtos vinculados:</span>
                </span>
                <span className="font-bold text-earth-900 px-2 py-0.5 bg-cream-200 rounded-full text-[11px]">
                  {category.product_count || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
