import React, { useState, useEffect } from 'react';
import { Settings, Check, RefreshCw, MessageCircle, Store, FileText, Mail, MapPin, UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { api } from '../../services/api';
import { uploadProductImage } from '../../services/storage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export function AdminSettingsPage({ onSettingsUpdated }) {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados dos campos
  const [storeName, setStoreName] = useState('Mereça Crochê');
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999');
  const [storeDescription, setStoreDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  // Estados das Imagens da Home
  const [heroMainImageUrl, setHeroMainImageUrl] = useState('');
  const [heroMainPreviewUrl, setHeroMainPreviewUrl] = useState('');
  const [isUploadingHeroMain, setIsUploadingHeroMain] = useState(false);
  const [heroMainProgress, setHeroMainProgress] = useState(0);

  const [heroSecondaryImageUrl, setHeroSecondaryImageUrl] = useState('');
  const [heroSecondaryPreviewUrl, setHeroSecondaryPreviewUrl] = useState('');
  const [isUploadingHeroSecondary, setIsUploadingHeroSecondary] = useState(false);
  const [heroSecondaryProgress, setHeroSecondaryProgress] = useState(0);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.getSettings();
      if (res?.data) {
        const d = res.data;
        setStoreName(d.store_name || 'Mereça Crochê');
        setWhatsappNumber(d.whatsapp_number || '5511999999999');
        setStoreDescription(d.store_description || '');

        const info = typeof d.contact_info === 'string'
          ? JSON.parse(d.contact_info || '{}')
          : (d.contact_info || {});

        setInstagram(info.instagram || '');
        setCity(info.city || '');
        setEmail(info.email || '');

        const mainImg = d.hero_main_image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';
        const secondaryImg = d.hero_secondary_image_url || 'https://res.cloudinary.com/csusxfdh/image/upload/v1790120994/bolsa_crocher_7.jpg';

        setHeroMainImageUrl(mainImg);
        setHeroMainPreviewUrl(mainImg);
        setHeroSecondaryImageUrl(secondaryImg);
        setHeroSecondaryPreviewUrl(secondaryImg);
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      toast.error('Não foi possível ler as configurações do banco.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleHeroMainFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploadingHeroMain(true);
    setHeroMainProgress(0);
    const tempUrl = URL.createObjectURL(file);
    setHeroMainPreviewUrl(tempUrl);

    try {
      toast.info('Fazendo upload da Imagem 1 para o Cloudinary...');
      const uploadedUrl = await uploadProductImage(file, (progress) => {
        setHeroMainProgress(progress);
      });
      setHeroMainImageUrl(uploadedUrl);
      setHeroMainPreviewUrl(uploadedUrl);
      toast.success('Imagem 1 carregada com sucesso! Clique em Salvar Alterações para confirmar.');
    } catch (err) {
      console.error('Erro no upload da imagem 1:', err);
      toast.error(err.message || 'Falha ao enviar imagem 1.');
    } finally {
      setIsUploadingHeroMain(false);
    }
  };

  const handleHeroSecondaryFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploadingHeroSecondary(true);
    setHeroSecondaryProgress(0);
    const tempUrl = URL.createObjectURL(file);
    setHeroSecondaryPreviewUrl(tempUrl);

    try {
      toast.info('Fazendo upload da Imagem 2 para o Cloudinary...');
      const uploadedUrl = await uploadProductImage(file, (progress) => {
        setHeroSecondaryProgress(progress);
      });
      setHeroSecondaryImageUrl(uploadedUrl);
      setHeroSecondaryPreviewUrl(uploadedUrl);
      toast.success('Imagem 2 carregada com sucesso! Clique em Salvar Alterações para confirmar.');
    } catch (err) {
      console.error('Erro no upload da imagem 2:', err);
      toast.error(err.message || 'Falha ao enviar imagem 2.');
    } finally {
      setIsUploadingHeroSecondary(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeName.trim() || !whatsappNumber.trim()) {
      toast.warning('O nome da loja e o número do WhatsApp são obrigatórios.');
      return;
    }

    if (isUploadingHeroMain || isUploadingHeroSecondary) {
      toast.warning('Aguarde o término do envio das imagens antes de salvar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        store_name: storeName.trim(),
        whatsapp_number: whatsappNumber.trim(),
        store_description: storeDescription.trim(),
        contact_info: {
          instagram: instagram.trim(),
          city: city.trim(),
          email: email.trim(),
        },
        hero_main_image_url: heroMainImageUrl || null,
        hero_secondary_image_url: heroSecondaryImageUrl || null,
      };

      await api.updateSettings(payload);
      toast.success('Configurações da loja e imagens da Home salvas com sucesso no Neon!');
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar configurações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner size="lg" text="Carregando configurações da loja..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Topo */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
          Configurações da Loja
        </h1>
        <p className="text-xs text-earth-600 font-light mt-0.5">
          Essas informações são refletidas imediatamente na vitrine, no rodapé e no botão de envio de pedidos para o WhatsApp.
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
        {/* Seção Imagens da Home */}
        <div className="space-y-6">
          <div className="border-b border-cream-200/80 pb-2">
            <h3 className="font-serif text-base font-semibold text-earth-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Imagens da Home</span>
            </h3>
            <p className="text-xs text-earth-500 font-light mt-0.5">
              Gerencie as duas imagens exibidas na página inicial. Ao selecionar uma imagem, ela é enviada para o Cloudinary e o link é salvo no Neon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Campo 1: Imagem do Hero Principal */}
            <div className="p-4 rounded-xl bg-cream-100/60 border border-cream-200 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800">
                  1. Imagem do Hero Principal
                </label>
                <span className="text-[11px] text-earth-500 block">
                  Exibida ao lado de: "O valor inestimável do artesanato feito com calma e dedicação"
                </span>
              </div>

              {/* Preview */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-cream-200/80 border border-cream-300 flex items-center justify-center">
                {heroMainPreviewUrl ? (
                  <img
                    src={heroMainPreviewUrl}
                    alt="Imagem do Hero Principal"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-earth-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[11px] block font-light">Sem imagem</span>
                  </div>
                )}
              </div>

              {/* Botão de Upload */}
              <div>
                <label className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-earth-800 text-xs font-medium transition-colors shadow-xs">
                  <UploadCloud className="w-3.5 h-3.5 text-sage-600" />
                  <span>{heroMainPreviewUrl ? 'Trocar Imagem' : 'Selecionar Imagem'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroMainFileChange}
                    className="hidden"
                    disabled={isUploadingHeroMain}
                  />
                </label>
              </div>

              {/* Barra de Progresso */}
              {isUploadingHeroMain && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-sage-700 font-medium">
                    <span>Enviando para Cloudinary...</span>
                    <span>{heroMainProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-600 transition-all duration-300"
                      style={{ width: `${heroMainProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Campo 2: Imagem da Segunda Seção */}
            <div className="p-4 rounded-xl bg-cream-100/60 border border-cream-200 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800">
                  2. Imagem da Segunda Seção
                </label>
                <span className="text-[11px] text-earth-500 block">
                  Exibida ao lado de: "Crochê feito à mão, com carinho em cada detalhe"
                </span>
              </div>

              {/* Preview */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-cream-200/80 border border-cream-300 flex items-center justify-center">
                {heroSecondaryPreviewUrl ? (
                  <img
                    src={heroSecondaryPreviewUrl}
                    alt="Imagem da Segunda Seção"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-earth-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[11px] block font-light">Sem imagem</span>
                  </div>
                )}
              </div>

              {/* Botão de Upload */}
              <div>
                <label className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-earth-800 text-xs font-medium transition-colors shadow-xs">
                  <UploadCloud className="w-3.5 h-3.5 text-sage-600" />
                  <span>{heroSecondaryPreviewUrl ? 'Trocar Imagem' : 'Selecionar Imagem'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroSecondaryFileChange}
                    className="hidden"
                    disabled={isUploadingHeroSecondary}
                  />
                </label>
              </div>

              {/* Barra de Progresso */}
              {isUploadingHeroSecondary && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-sage-700 font-medium">
                    <span>Enviando para Cloudinary...</span>
                    <span>{heroSecondaryProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-600 transition-all duration-300"
                      style={{ width: `${heroSecondaryProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dados Básicos */}
        <div className="space-y-4 pt-4 border-t border-cream-200/80">
          <h3 className="font-serif text-base font-semibold text-earth-900 border-b border-cream-200/80 pb-2">
            Identidade da Marca
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Nome da Loja <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-earth-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Mereça Crochê"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Número do WhatsApp com DDD e Código do País (Ex: 5511999999999) <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="5511999999999"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500"
              />
            </div>
            <p className="text-[11px] text-earth-500 mt-1">
              Este é o número que receberá os pedidos finalizados na sacola dos clientes via wa.me.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
              Descrição Curta da Loja (Apresentação e Rodapé)
            </label>
            <textarea
              rows={3}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="Crochê feito à mão, com carinho em cada detalhe..."
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500 resize-none"
            />
          </div>
        </div>

        {/* Informações de Contato e Redes */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-base font-semibold text-earth-900 border-b border-cream-200/80 pb-2">
            Canais de Contato e Localização
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
                Instagram da Loja
              </label>
              <div className="relative">
                <InstagramIcon className="w-4 h-4 text-pink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@merecacroche"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
                E-mail de Contato
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@merecacroche.com.br"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-earth-800 mb-1">
                Cidade / Estado (Envios)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-sage-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo - SP • Enviamos com carinho para todo o Brasil"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-earth-900 focus:outline-none focus:border-sage-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="pt-4 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingHeroMain || isUploadingHeroSecondary}
            className="px-8 py-3 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 text-xs font-medium shadow-soft transition-all disabled:opacity-50 flex items-center gap-2 active:scale-[0.99]"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
