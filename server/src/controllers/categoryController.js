import { query } from '../config/db.js';

export async function listCategories(req, res) {
  try {
    const result = await query(`
      SELECT 
        c.id, 
        c.name, 
        c.created_at,
        COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC;
    `);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({
      success: false,
      error: 'Não foi possível carregar as categorias.',
    });
  }
}

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'O nome da categoria é obrigatório.',
      });
    }

    const trimmed = name.trim();

    // Checar duplicidade
    const existing = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [trimmed]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Já existe uma categoria com este nome.',
      });
    }

    const result = await query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [trimmed]
    );

    return res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao salvar a categoria.',
    });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'O nome da categoria é obrigatório.',
      });
    }

    const trimmed = name.trim();

    // Checar duplicidade em outra categoria
    const existing = await query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2',
      [trimmed, id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Já existe outra categoria com este nome.',
      });
    }

    const result = await query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [trimmed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Categoria atualizada com sucesso.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao atualizar a categoria.',
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Categoria excluída com sucesso.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao excluir a categoria.',
    });
  }
}
