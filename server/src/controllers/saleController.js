import { query } from '../config/db.js';

export async function listSales(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(`
      SELECT 
        id, 
        customer_name, 
        items, 
        total::float as total, 
        notes, 
        created_at
      FROM sales
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit, 10), parseInt(offset, 10)]);

    const totalCount = await query('SELECT COUNT(*)::int as count FROM sales');

    return res.json({
      success: true,
      data: result.rows,
      totalCount: totalCount.rows[0].count,
    });
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    return res.status(500).json({
      success: false,
      error: 'Não foi possível carregar o histórico de vendas.',
    });
  }
}

export async function getSaleById(req, res) {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        id, 
        customer_name, 
        items, 
        total::float as total, 
        notes, 
        created_at
      FROM sales
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Venda não encontrada.',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao consultar venda.',
    });
  }
}

export async function createSale(req, res) {
  try {
    const { customer_name, items, total, notes, created_at } = req.body;

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'O nome do cliente é obrigatório para registrar a venda.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Ao menos um produto deve ser incluído na venda.',
      });
    }

    const numericTotal = parseFloat(total);
    if (isNaN(numericTotal) || numericTotal <= 0) {
      return res.status(400).json({
        success: false,
        error: 'O valor total da venda deve ser maior que zero.',
      });
    }

    let sql = `
      INSERT INTO sales (customer_name, items, total, notes, created_at)
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP))
      RETURNING id, customer_name, items, total::float as total, notes, created_at
    `;

    const result = await query(sql, [
      customer_name.trim(),
      JSON.stringify(items),
      numericTotal,
      notes ? notes.trim() : null,
      created_at || null,
    ]);

    return res.status(201).json({
      success: true,
      message: 'Venda registrada com sucesso no Neon!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao registrar venda no banco de dados.',
    });
  }
}

export async function deleteSale(req, res) {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM sales WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Venda não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Registro de venda excluído com sucesso.',
      deletedId: id,
    });
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao excluir registro de venda.',
    });
  }
}
