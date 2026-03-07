import { pool } from "../config/db";

export async function getByOutlet(outletId: number) {
  const { rows } = await pool.query(
    "SELECT * FROM sales WHERE outlet_id = $1 ORDER BY created_at DESC",
    [outletId],
  );

  return rows;
}

export async function createSale(
  outletId: number,
  items: { menu_item_id: number; name: string; qty: number; price: number }[],
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check and deduct stock for each item
    for (const item of items) {
      const result = await client.query(
        `UPDATE inventory SET stock = stock - $1
         WHERE outlet_id = $2 AND menu_item_id = $3 AND stock >= $1`,
        [item.qty, outletId, item.menu_item_id],
      );

      if (result.rowCount === 0) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    // Generate receipt number
    const { rows: seqRows } = await client.query(
      `INSERT INTO receipt_sequences (outlet_id, sale_date, last_number)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (outlet_id, sale_date)
       DO UPDATE SET last_number = receipt_sequences.last_number + 1
       RETURNING last_number`,
      [outletId],
    );

    const num = String(seqRows[0].last_number).padStart(4, "0");
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const receiptNumber = `RCP-${outletId}-${today}-${num}`;

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    // Insert the sale
    const { rows } = await client.query(
      `INSERT INTO sales (outlet_id, receipt_number, items, total_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [outletId, receiptNumber, JSON.stringify(items), total],
    );

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
