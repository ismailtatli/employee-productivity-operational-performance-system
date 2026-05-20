const { getDatabase } = require("../config/database");

function scopeClause(ownerUserId, extra = []) {
  const clauses = ["deletedAt IS NULL", ...extra];
  const params = [];
  if (ownerUserId !== null) {
    clauses.push("ownerUserId = ?");
    params.push(ownerUserId);
  }
  return { sql: `WHERE ${clauses.join(" AND ")}`, params };
}

async function getAllProducts(ownerUserId) {
  const database = await getDatabase();
  const scope = scopeClause(ownerUserId);
  return database.all(
    `SELECT * FROM products ${scope.sql} ORDER BY productCode ASC`,
    scope.params
  );
}

async function getProductById(id, ownerUserId) {
  const database = await getDatabase();
  const scope = scopeClause(ownerUserId, ["id = ?"]);
  return database.get(
    `SELECT * FROM products ${scope.sql}`,
    [id, ...scope.params]
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

  const query = ownerUserId === null
    ? `UPDATE products
       SET productCode = ?, productName = ?, category = ?, standardUnit = ?, targetPerShift = ?, status = ?
       WHERE id = ? AND deletedAt IS NULL`
    : `UPDATE products
       SET productCode = ?, productName = ?, category = ?, standardUnit = ?, targetPerShift = ?, status = ?
       WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL`;

  const params = [
    productData.productCode,
    productData.productName,
    productData.category,
    productData.standardUnit,
    productData.targetPerShift,
    productData.status || "Active",
    id
  ];

  if (ownerUserId !== null) params.push(ownerUserId);

  await database.run(query, params);
  return getProductById(id, ownerUserId);
}

async function deleteProduct(id, ownerUserId) {
  const database = await getDatabase();
  const product = await getProductById(id, ownerUserId);

  if (!product) return null;

  if (ownerUserId === null) {
    await database.run(`UPDATE products SET status = 'Inactive', deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND deletedAt IS NULL`, id);
  } else {
    await database.run(
      `UPDATE products SET status = 'Inactive', deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND ownerUserId = ? AND deletedAt IS NULL`,
      [id, ownerUserId]
    );
  }

  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
