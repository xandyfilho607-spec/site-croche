import { query } from '../config/db.js';

export async function getDashboardStats(req, res) {
  try {
    // 1. Vendas e faturamento de hoje (fuso horário local Brasil UTC-3)
    const todayRes = await query(`
      SELECT 
        COUNT(*)::int AS sales_today,
        COALESCE(SUM(total), 0)::float AS revenue_today
      FROM sales
      WHERE (created_at AT TIME ZONE 'America/Sao_Paulo')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date;
    `);

    // 2. Vendas e faturamento do mês atual
    const monthRes = await query(`
      SELECT 
        COUNT(*)::int AS sales_month,
        COALESCE(SUM(total), 0)::float AS revenue_month
      FROM sales
      WHERE date_trunc('month', created_at AT TIME ZONE 'America/Sao_Paulo') = 
            date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo');
    `);

    // 3. Total de produtos cadastrados e disponíveis
    const prodRes = await query(`
      SELECT 
        COUNT(*)::int AS total_products,
        COUNT(CASE WHEN available = true THEN 1 END)::int AS available_products,
        COUNT(CASE WHEN available = false THEN 1 END)::int AS sold_out_products
      FROM products;
    `);

    // 4. Vendas dos últimos 7 dias para gráfico de evolução
    const last7DaysRes = await query(`
      SELECT 
        to_char(d.day, 'DD/MM') AS label,
        to_char(d.day, 'YYYY-MM-DD') AS date,
        COUNT(s.id)::int AS sales_count,
        COALESCE(SUM(s.total), 0)::float AS total_revenue
      FROM (
        SELECT generate_series(
          (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date - INTERVAL '6 days',
          (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date,
          '1 day'::interval
        )::date AS day
      ) d
      LEFT JOIN sales s 
        ON (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date = d.day
      GROUP BY d.day
      ORDER BY d.day ASC;
    `);

    // 5. Últimas 5 vendas registradas
    const recentSalesRes = await query(`
      SELECT id, customer_name, total::float as total, created_at, items
      FROM sales
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    return res.json({
      success: true,
      data: {
        today: {
          sales: todayRes.rows[0].sales_today,
          revenue: todayRes.rows[0].revenue_today,
        },
        month: {
          sales: monthRes.rows[0].sales_month,
          revenue: monthRes.rows[0].revenue_month,
        },
        products: {
          total: prodRes.rows[0].total_products,
          available: prodRes.rows[0].available_products,
          sold_out: prodRes.rows[0].sold_out_products,
        },
        chartData: last7DaysRes.rows,
        recentSales: recentSalesRes.rows,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar métricas da dashboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Não foi possível carregar as métricas do painel.',
    });
  }
}
