import { query } from '../config/db.js';

export async function listProducts(req, res) {
  try {
    const { category_id, featured, available, search, limit, offset } = req.query;

    let sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price::float as price,
        p.category_id,
        c.name AS category_name,
        p.image_url,
        p.available,
        p.featured,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (category_id) {
      sql += ` AND p.category_id = $${paramIndex++}`;
      values.push(category_id);
    }

    if (featured !== undefined) {
      sql += ` AND p.featured = $${paramIndex++}`;
      values.push(featured === 'true' || featured === true);
    }

    if (available !== undefined) {
      sql += ` AND p.available = $${paramIndex++}`;
      values.push(available === 'true' || available === true);
    }

    if (search && search.trim()) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      values.push(`%${search.trim()}%`);
      paramIndex++;
    }

    sql += ' ORDER BY p.featured DESC, p.id DESC';

    if (limit) {
      sql += ` LIMIT $${paramIndex++}`;
      values.push(parseInt(limit, 10));
    }

    if (offset) {
      sql += ` OFFSET $${paramIndex++}`;
      values.push(parseInt(offset, 10));
    }

    const result = await query(sql, values);

    return res.json({
      success: true,
      data: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({
      success: false,
      error: 'Não foi possível carregar os produtos do catálogo.',
    });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price::float as price,
        p.category_id,
        c.name AS category_name,
        p.image_url,
        p.available,
        p.featured,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado.',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar detalhes do produto.',
    });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      available = true,
      featured = false,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'O nome do produto é obrigatório.' });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, error: 'O preço deve ser um valor numérico válido maior ou igual a zero.' });
    }

    const result = await query(`
      INSERT INTO products (name, description, price, category_id, image_url, available, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      name.trim(),
      description ? description.trim() : '',
      numericPrice,
      category_id ? parseInt(category_id, 10) : null,
      image_url || null,
      available === true || available === 'true',
      featured === true || featured === 'true',
    ]);

    return res.status(201).json({
      success: true,
      message: 'Produto cadastrado com sucesso.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao cadastrar produto no banco.',
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      available,
      featured,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'O nome do produto é obrigatório.' });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, error: 'Preço inválido.' });
    }

    const result = await query(`
      UPDATE products 
      SET 
        name = $1,
        description = $2,
        price = $3,
        category_id = $4,
        image_url = $5,
        available = $6,
        featured = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [
      name.trim(),
      description ? description.trim() : '',
      numericPrice,
      category_id ? parseInt(category_id, 10) : null,
      image_url || null,
      available === true || available === 'true',
      featured === true || featured === 'true',
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
    }

    return res.json({
      success: true,
      message: 'Produto atualizado com sucesso.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao atualizar produto.',
    });
  }
}

export async function toggleProductStatus(req, res) {
  try {
    const { id } = req.params;
    const { available, featured } = req.body;

    let updateFields = [];
    let values = [];
    let paramIndex = 1;

    if (available !== undefined) {
      updateFields.push(`available = $${paramIndex++}`);
      values.push(available === true || available === 'true');
    }

    if (featured !== undefined) {
      updateFields.push(`featured = $${paramIndex++}`);
      values.push(featured === true || featured === 'true');
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum campo para atualizar informado.' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE products 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
    }

    return res.json({
      success: true,
      message: 'Status do produto atualizado.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao alternar status do produto:', error);
    return res.status(500).json({ success: false, error: 'Erro ao atualizar status.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado.',
      });
    }

    return res.json({
      success: true,
      message: 'Produto excluído com sucesso.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao excluir produto.',
    });
  }
}
