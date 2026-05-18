const { getDatabase } = require("../config/database");

async function getAllProducts(ownerUserId) {
  const database = await getDatabase();

  return database.all(
    `SELECT *
     FROM products
     WHERE ownerUserId = ?
     ORDER BY productCode ASC`,
    ownerUserId
  );
}

async function getProductById(id, ownerUserId) {
  const database = await getDatabase();

  return database.get(
    `SELECT *
     FROM products
     WHERE id = ? AND ownerUserId = ?`,
    [id, ownerUserId]
  );
}

async function createProduct(productData, ownerUserId) {
  const database = await getDatabase();

  const result = await database.run(
    `INSERT INTO products
    (ownerUserId, productCode, productName, category, standardUnit, targetPerShift, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ownerUserId,
      productData.productCode,
      productData.productName,
      productData.category,
      productData.standardUnit,
      productData.targetPerShift,
      productData.status || "Active"
    ]
  );

  return getProductById(result.lastID, ownerUserId);
}

async function updateProduct(id, productData, ownerUserId) {
  const database = await getDatabase();

  await database.run(
    `UPDATE products
     SET productCode = ?,
         productName = ?,
         category = ?,
         standardUnit = ?,
         targetPerShift = ?,
         status = ?
     WHERE id = ? AND ownerUserId = ?`,
    [
      productData.productCode,
      productData.productName,
      productData.category,
      productData.standardUnit,
      productData.targetPerShift,
      productData.status || "Active",
      id,
      ownerUserId
    ]
  );

  return getProductById(id, ownerUserId);
}

async function deleteProduct(id, ownerUserId) {
  const database = await getDatabase();

  const product = await getProductById(id, ownerUserId);

  if (!product) {
    return null;
  }

  await database.run(
    `DELETE FROM products
     WHERE id = ? AND ownerUserId = ?`,
    [id, ownerUserId]
  );

  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};