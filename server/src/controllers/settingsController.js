import { query } from '../config/db.js';

const DEFAULT_SETTINGS = {
  store_name: 'Mereça Crochê',
  whatsapp_number: '5511999999999',
  store_description: 'Crochê feito à mão, com carinho em cada detalhe. Peças artesanais exclusivas com fio de qualidade e acabamento primoroso.',
  contact_info: {
    instagram: '@merecacroche',
    city: 'São Paulo - SP',
    shipping: 'Enviamos com carinho para todo o Brasil',
    email: 'contato@merecacroche.com.br'
  },
  hero_main_image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  hero_secondary_image_url: 'https://res.cloudinary.com/csusxfdh/image/upload/v1790120994/bolsa_crocher_7.jpg',
};

// Garante que as colunas de imagens existam na tabela store_settings sem quebrar o banco
let columnsEnsured = false;
async function ensureImageColumns() {
  if (columnsEnsured) return;
  try {
    await query(`
      ALTER TABLE store_settings 
      ADD COLUMN IF NOT EXISTS hero_main_image_url TEXT,
      ADD COLUMN IF NOT EXISTS hero_secondary_image_url TEXT;
    `);
    columnsEnsured = true;
  } catch (err) {
    console.warn('Aviso ao verificar colunas de imagens em store_settings:', err.message);
  }
}

export async function getSettings(req, res) {
  try {
    await ensureImageColumns();
    const result = await query('SELECT * FROM store_settings ORDER BY id ASC LIMIT 1');

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: DEFAULT_SETTINGS,
      });
    }

    return res.json({
      success: true,
      data: {
        ...DEFAULT_SETTINGS,
        ...result.rows[0],
      },
    });
  } catch (error) {
    console.warn('Aviso: Não foi possível ler tabela store_settings, usando padrões:', error.message);
    return res.json({
      success: true,
      data: DEFAULT_SETTINGS,
    });
  }
}

export async function updateSettings(req, res) {
  try {
    await ensureImageColumns();
    const {
      store_name,
      whatsapp_number,
      store_description,
      contact_info,
      hero_main_image_url,
      hero_secondary_image_url,
    } = req.body;

    if (!store_name || !whatsapp_number) {
      return res.status(400).json({
        success: false,
        error: 'Nome da loja e WhatsApp são obrigatórios.',
      });
    }

    // Normalizar número do WhatsApp (remover caracteres não numéricos)
    const cleanWhatsApp = String(whatsapp_number).replace(/\D/g, '');

    // Verificar se já existe registro
    const check = await query('SELECT id FROM store_settings ORDER BY id ASC LIMIT 1');

    let result;
    if (check.rows.length === 0) {
      result = await query(`
        INSERT INTO store_settings (
          store_name,
          whatsapp_number,
          store_description,
          contact_info,
          hero_main_image_url,
          hero_secondary_image_url,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *
      `, [
        store_name.trim(),
        cleanWhatsApp,
        store_description?.trim() || '',
        JSON.stringify(contact_info || {}),
        hero_main_image_url || null,
        hero_secondary_image_url || null,
      ]);
    } else {
      result = await query(`
        UPDATE store_settings
        SET 
          store_name = $1,
          whatsapp_number = $2,
          store_description = $3,
          contact_info = $4,
          hero_main_image_url = $5,
          hero_secondary_image_url = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `, [
        store_name.trim(),
        cleanWhatsApp,
        store_description?.trim() || '',
        JSON.stringify(contact_info || {}),
        hero_main_image_url || null,
        hero_secondary_image_url || null,
        check.rows[0].id,
      ]);
    }

    return res.json({
      success: true,
      message: 'Configurações da loja atualizadas com sucesso!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao salvar configurações da loja:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao salvar configurações.',
    });
  }
}
