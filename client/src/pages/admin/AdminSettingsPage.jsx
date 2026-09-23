import React, { useState, useEffect } from 'react';
import { Settings, Check, RefreshCw, MessageCircle, Store, FileText, Mail, MapPin } from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { api } from '../../services/api';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeName.trim() || !whatsappNumber.trim()) {
      toast.warning('O nome da loja e o número do WhatsApp são obrigatórios.');
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
      };

      await api.updateSettings(payload);
      toast.success('Configurações da loja atualizadas com sucesso no Neon!');
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
        {/* Dados Básicos */}
        <div className="space-y-4">
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
            disabled={isSubmitting}
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
