import React from 'react';
import { Heart, Sparkles, Clock, CheckCircle } from 'lucide-react';

export function AboutSection({ settings }) {
  const mainImage = settings?.hero_main_image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="sobre" className="py-20 bg-cream-100/60 border-y border-cream-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Imagem representativa da artesã / processo de crochê */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card border-4 border-cream-50 bg-cream-200">
              <img
                key={mainImage}
                src={mainImage}
                alt="Processo artesanal de crochê"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Card com citação */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-cream-50 p-5 rounded-2xl shadow-elevated border border-cream-200 max-w-xs">
              <p className="font-serif italic text-xs sm:text-sm text-earth-800 leading-relaxed">
                “Cada ponto tecido carrega um pedacinho de história e muito afeto.”
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage-500" />
                <span className="text-[11px] font-semibold text-earth-900 uppercase tracking-wider">Mereça Crochê</span>
              </div>
            </div>
          </div>

          {/* Texto Sobre Nós */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 text-earth-800 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Nossa Filosofia</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900 leading-tight">
              O valor inestimável do artesanato feito com calma e dedicação.
            </h2>

            <p className="text-base text-earth-700 font-light leading-relaxed">
              O projeto <strong className="font-semibold text-earth-900">Mereça Crochê</strong> nasceu do desejo de transformar novelos e agulhas em peças duradouras, repletas de identidade e beleza atemporal. Fugindo da produção industrial em massa, cada modelo é produzido um a um, respeitando o tempo de maturação do processo manual.
            </p>

            <p className="text-base text-earth-700 font-light leading-relaxed">
              Utilizamos fios de alta qualidade — como algodão nobre e fio náutico estruturado —, garantindo peças que não apenas encantam pelo olhar, mas que também resistem ao uso com elegância e durabilidade.
            </p>

            {/* Pilares */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-cream-50 border border-cream-200/90 shadow-xs">
                <Sparkles className="w-5 h-5 text-gold-500 mb-2" />
                <h4 className="font-serif text-sm font-semibold text-earth-900 mb-1">Exclusividade</h4>
                <p className="text-xs text-earth-600 font-light">Nenhuma peça é exatamente igual à outra.</p>
              </div>

              <div className="p-4 rounded-xl bg-cream-50 border border-cream-200/90 shadow-xs">
                <Clock className="w-5 h-5 text-sage-600 mb-2" />
                <h4 className="font-serif text-sm font-semibold text-earth-900 mb-1">Slow Design</h4>
                <p className="text-xs text-earth-600 font-light">Respeito ao tempo e atenção minuciosa aos nós.</p>
              </div>

              <div className="p-4 rounded-xl bg-cream-50 border border-cream-200/90 shadow-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-serif text-sm font-semibold text-earth-900 mb-1">Acabamento Fino</h4>
                <p className="text-xs text-earth-600 font-light">Forros reforçados e ferragens de qualidade.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
