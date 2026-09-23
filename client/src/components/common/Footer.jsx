import { Heart, MessageCircle, Mail, MapPin, Sparkles, Shield } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { formatPhone } from '../../utils/formatters';

export function Footer({ settings, onNavigateToAdmin }) {
  const currentYear = new Date().getFullYear();
  const storeName = settings?.store_name || 'Mereça Crochê';
  const whatsapp = settings?.whatsapp_number || '5511999999999';
  const description = settings?.store_description || 'Crochê feito à mão, com carinho em cada detalhe. Peças exclusivas e cheias de afeto.';
  const contactInfo = typeof settings?.contact_info === 'string' 
    ? JSON.parse(settings.contact_info || '{}') 
    : (settings?.contact_info || {});

  return (
    <footer className="bg-earth-900 text-cream-100 pt-16 pb-12 border-t border-earth-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Sobre a Loja */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-earth-800 border border-gold-400/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold-400" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-cream-50">
                {storeName}
              </span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 mb-4 tracking-wide">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-cream-300 font-light">
              <li><a href="#hero" className="hover:text-gold-300 transition-colors">Início</a></li>
              <li><a href="#categorias" className="hover:text-gold-300 transition-colors">Categorias</a></li>
              <li><a href="#destaques" className="hover:text-gold-300 transition-colors">Produtos em Destaque</a></li>
              <li><a href="#catalogo" className="hover:text-gold-300 transition-colors">Catálogo Completo</a></li>
              <li><a href="#sobre" className="hover:text-gold-300 transition-colors">Nossa História</a></li>
              <li><a href="#contato" className="hover:text-gold-300 transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento & WhatsApp */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 mb-4 tracking-wide">
              Atendimento
            </h4>
            <ul className="space-y-3 text-sm text-cream-300 font-light">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {formatPhone(whatsapp)}
                </a>
              </li>
              {contactInfo.instagram && (
                <li className="flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span>{contactInfo.instagram}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold-300 flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </li>
              )}
              {contactInfo.city && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sage-400 flex-shrink-0" />
                  <span>{contactInfo.city}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 4: Envio & Artesanato */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-cream-50 tracking-wide">
              Feito com Amor
            </h4>
            <p className="text-xs text-cream-300 leading-relaxed font-light">
              Cada peça é única, tecida ponto a ponto com fios selecionados. Os pedidos são combinados e confirmados diretamente pelo WhatsApp com atendimento exclusivo e personalizado.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-cream-400 hover:text-cream-200 transition-colors p-1"
                title="Área restrita da proprietária"
              >
                <Shield className="w-3.5 h-3.5 text-cream-400" />
                <span>Painel da Proprietária</span>
              </button>
            </div>
          </div>
        </div>

        {/* Linha Divisória e Copyright */}
        <div className="pt-8 border-t border-earth-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 font-light gap-4">
          <p>© {currentYear} {storeName}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Feito à mão com <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" /> e dedicação.
          </p>
        </div>
      </div>
    </footer>
  );
}
