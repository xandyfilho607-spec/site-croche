import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config();

import { pool, query } from '../config/db.js';

async function setupDatabase() {
  console.log('🧶 Iniciando migração e configuração do banco de dados Neon...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ ERRO: A variável DATABASE_URL não está configurada em server/.env');
    console.error('   Exemplo: DATABASE_URL=postgresql://neondb_owner:npg_gCbVXP7NdnH4@ep-muddy-boat-acplfmhd-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require');
    process.exit(1);
  }

  try {
    // 1. Tabela categories
    console.log('📦 Criando tabela categories...');
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabela products
    console.log('📦 Criando tabela products...');
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        image_url TEXT,
        available BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Índices para otimização de busca e filtros
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
      CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    `);

    // 3. Tabela sales
    console.log('📦 Criando tabela sales...');
    await query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
    `);

    // 4. Tabela store_settings
    console.log('📦 Criando tabela store_settings...');
    await query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id SERIAL PRIMARY KEY,
        store_name VARCHAR(150) DEFAULT 'Mereça Crochê',
        whatsapp_number VARCHAR(30) DEFAULT '5511999999999',
        store_description TEXT DEFAULT 'Crochê feito à mão, com carinho em cada detalhe. Peças artesanais exclusivas feitas com afeto.',
        contact_info JSONB DEFAULT '{"instagram": "@merecacroche", "city": "São Paulo - SP", "email": "contato@merecacroche.com.br"}'::jsonb,
        hero_main_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        hero_secondary_image_url TEXT DEFAULT 'https://res.cloudinary.com/csusxfdh/image/upload/v1790120994/bolsa_crocher_7.jpg',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserção das configurações padrão se ainda não existir
    const settingsCheck = await query('SELECT COUNT(*) FROM store_settings');
    if (parseInt(settingsCheck.rows[0].count) === 0) {
      console.log('⚙️ Inserindo configurações padrão da loja...');
      await query(`
        INSERT INTO store_settings (store_name, whatsapp_number, store_description, contact_info, hero_main_image_url, hero_secondary_image_url)
        VALUES (
          'Mereça Crochê',
          '5511999999999',
          'Crochê feito à mão, com carinho em cada detalhe. Peças artesanais exclusivas com fio de qualidade e acabamento primoroso.',
          '{"instagram": "@merecacroche", "city": "São Paulo - SP", "shipping": "Enviamos para todo o Brasil"}'::jsonb,
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
          'https://res.cloudinary.com/csusxfdh/image/upload/v1790120994/bolsa_crocher_7.jpg'
        );
      `);
    }

    // 5. Categorias de demonstração iniciais
    console.log('🌸 Verificando categorias iniciais...');
    const catCheck = await query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCheck.rows[0].count) === 0) {
      console.log('🌸 Inserindo categorias iniciais...');
      await query(`
        INSERT INTO categories (name) VALUES
          ('Bolsas'),
          ('Acessórios'),
          ('Porta-moedas'),
          ('Decoração'),
          ('Amigurumis')
        ON CONFLICT (name) DO NOTHING;
      `);
    }

    // 6. Produtos de demonstração iniciais para o primeiro carregamento
    console.log('🧶 Verificando produtos iniciais...');
    const prodCheck = await query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCheck.rows[0].count) === 0) {
      console.log('🧶 Inserindo produtos de demonstração de crochê...');
      // Buscar IDs das categorias inseridas
      const catsRes = await query('SELECT id, name FROM categories');
      const catMap = {};
      catsRes.rows.forEach(c => { catMap[c.name] = c.id; });

      const sampleProducts = [
        {
          name: 'Bolsa Tote Artesanal em Fio Náutico',
          description: 'Bolsa elegante trabalhada à mão em ponto espinha de peixe com fio náutico premium. Possui forro interno e alça de madeira natural.',
          price: 189.90,
          category_id: catMap['Bolsas'] || null,
          image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: true,
        },
        {
          name: 'Bolsa Baguete Candy Sage',
          description: 'Modelo moderno em tom verde sálvia, fechamento com botão magnético e detalhe delicado de correntaria dourada.',
          price: 145.00,
          category_id: catMap['Bolsas'] || null,
          image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: true,
        },
        {
          name: 'Porta-Moedas e Cartões Terracota',
          description: 'Compacto e encantador, confeccionado com fio 100% algodão mercerizado e fecho da vovó metálico em ouro velho.',
          price: 38.00,
          category_id: catMap['Porta-moedas'] || null,
          image_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: true,
        },
        {
          name: 'Kit Sousplat & Porta Copos Floral (4 un)',
          description: 'Conjunto com 4 sousplats e 4 porta copos em tom cru/bege natural com bordas rendadas. Perfeito para mesa posta acolhedora.',
          price: 120.00,
          category_id: catMap['Decoração'] || null,
          image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: false,
        },
        {
          name: 'Cestinho Organizador Multiuso Cru',
          description: 'Cesto estruturado em fio de malha premium com alcinhas de couro sintético marrom. Ideal para lavabo ou quarto de bebê.',
          price: 48.00,
          category_id: catMap['Decoração'] || null,
          image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: false,
        },
        {
          name: 'Chaveiro Tulipa em Crochê',
          description: 'Delicado chaveiro floral com haste e folhinhas, acabamento com mosquetão dourado e pérola suave.',
          price: 24.50,
          category_id: catMap['Acessórios'] || null,
          image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: true,
        },
        {
          name: 'Amigurumi Ursinho Aconchego',
          description: 'Ursinho feito à mão com fio soft antialérgico, olhos com trava de segurança e enchimento de fibra siliconada.',
          price: 95.00,
          category_id: catMap['Amigurumis'] || null,
          image_url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
          available: true,
          featured: false,
        },
      ];

      for (const p of sampleProducts) {
        await query(`
          INSERT INTO products (name, description, price, category_id, image_url, available, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [p.name, p.description, p.price, p.category_id, p.image_url, p.available, p.featured]);
      }
      console.log('✅ Produtos de demonstração inseridos com sucesso!');
    }

    console.log('✨ Banco de dados Neon configurado com sucesso e pronto para uso!');
  } catch (error) {
    console.error('❌ Erro durante o setup do banco Neon:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
