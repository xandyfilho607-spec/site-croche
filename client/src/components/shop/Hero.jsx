import React from 'react';
import { ArrowDown, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export function Hero({ onExploreClick, settings }) {
  const heroImage = settings?.hero_secondary_image_url || 'https://res.cloudinary.com/csusxfdh/image/upload/v1790120994/bolsa_crocher_7.jpg';

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Detalhes de fundo decorativos suaves */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sage-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gold-300/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Texto Principal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100/80 border border-sage-200 text-sage-800 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              <span>Peças exclusivas tecidas à mão</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-earth-900 leading-[1.15] tracking-tight">
              Crochê feito à mão, com <span className="italic font-normal text-sage-600">carinho</span> em cada detalhe.
            </h1>

            <p className="text-base sm:text-lg text-earth-700 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Descubra bolsas elegantes, acessórios delicados e peças decorativas produzidas artesanalmente para valorizar seu estilo e trazer aconchego ao seu lar.
            </p>

            {/* Chamada para Ação e Vantagens */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#catalogo"
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-earth-800 hover:bg-earth-900 text-cream-50 font-medium text-base shadow-soft hover:shadow-card transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Ver produtos</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#sobre"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-cream-200/80 hover:bg-cream-300 text-earth-800 font-medium text-base transition-colors"
              >
                <span>Conhecer a marca</span>
              </a>
            </div>

            {/* Badges de Confiança */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-cream-200/80 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <span className="text-xs text-earth-700 font-medium">100% Artesanal</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-xs text-earth-700 font-medium">Fios Selecionados</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs text-earth-700 font-medium">Atendimento Direto</span>
              </div>
            </div>
          </div>

          {/* Composição Visual do Hero */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated border-4 border-cream-100/90 group bg-cream-200">
              <img
                key={heroImage}
                src={heroImage}
                alt="Peças artesanais de crochê Mereça Crochê"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = 'https://res.cloudinary.com/csusxfdh/image/upload/v1790120994/bolsa_crocher_7.jpg';
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-earth-900/30 to-transparent flex flex-col justify-end p-6 text-cream-50 pointer-events-none">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-300 mb-1">
                  Coleção Especial
                </span>
                <p className="font-serif text-2xl font-normal leading-snug text-cream-50">
                  Cuidado e delicadeza em cada ponto.
                </p>
              </div>
            </div>

            {/* Cartão flutuante decorativo */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-cream-50/95 backdrop-blur-md p-4 rounded-2xl shadow-card border border-cream-200 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-700">
                <Sparkles className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <p className="text-xs text-earth-500 font-medium">Peças sob encomenda</p>
                <p className="text-sm font-semibold text-earth-900">Personalize sua cor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
