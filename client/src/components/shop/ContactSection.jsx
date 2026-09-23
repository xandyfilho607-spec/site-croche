import React from 'react';
import { MessageCircle, Mail, MapPin, Send } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';
import { formatPhone } from '../../utils/formatters';

export function ContactSection({ settings }) {
  const whatsapp = settings?.whatsapp_number || '5511999999999';
  const contactInfo = typeof settings?.contact_info === 'string'
    ? JSON.parse(settings.contact_info || '{}')
    : (settings?.contact_info || {});

  const whatsappDirectUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Olá! Gostaria de encomendar uma peça personalizada na Mereça Crochê.')}`;

  return (
    <section id="contato" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fale Conosco</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900 leading-tight">
            Gostou de uma peça ou deseja uma encomenda sob medida?
          </h2>

          <p className="text-base text-earth-700 font-light leading-relaxed">
            Estamos sempre à disposição no WhatsApp para tirar dúvidas sobre cores, tamanhos, prazos de confecção e cálculo de frete.
          </p>
        </div>

        {/* Card Central de Contato */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-cream-100 to-cream-200/70 p-8 sm:p-10 rounded-3xl border border-cream-300 shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <MessageCircle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-earth-900">
              Atendimento Direto no WhatsApp
            </h3>
            <p className="text-sm text-earth-700 mt-1 font-light">
              Respondemos com todo carinho no menor tempo possível.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base shadow-soft hover:shadow-card transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-5 h-5" />
              <span>Chamar no WhatsApp ({formatPhone(whatsapp)})</span>
            </a>
          </div>

          {/* Demais Canais */}
          <div className="pt-6 border-t border-cream-300 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-earth-700">
            {contactInfo.instagram && (
              <div className="flex items-center justify-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-500" />
                <span>{contactInfo.instagram}</span>
              </div>
            )}
            {contactInfo.email && (
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-gold-500" />
                <span>{contactInfo.email}</span>
              </div>
            )}
            {contactInfo.city && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-sage-600" />
                <span>{contactInfo.city}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
