const { getDatabase } = require("../config/database");

async function getAllProducts() {
  const database = await getDatabase();

  return database.all(`
    SELECT *
    FROM products
    ORDER BY id ASC
  `);
}

async function getProductById(id) {
  const database = await getDatabase();

  return database.get(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
}

async function createProduct(product) {
  const database = await getDatabase();

  const result = await database.run(`
    INSERT INTO products
    (productCode, productName, category, standardUnit, targetPerShift, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    product.productCode,
    product.productName,
    product.category,
    product.standardUnit,
    product.targetPerShift,
    product.status || "Active"
  ]);

  return getProductById(result.lastID);
}

async function updateProduct(id, product) {
  const database = await getDatabase();

  await database.run(`
    UPDATE products
    SET productCode = ?,
        productName = ?,
        category = ?,
        standardUnit = ?,
        targetPerShift = ?,
        status = ?
    WHERE id = ?
  `, [
    product.productCode,
    product.productName,
    product.category,
    product.standardUnit,
    product.targetPerShift,
    product.status,
    id
  ]);

  return getProductById(id);
}

async function deleteProduct(id) {
  const database = await getDatabase();

  const result = await database.run(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return result.changes > 0;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};