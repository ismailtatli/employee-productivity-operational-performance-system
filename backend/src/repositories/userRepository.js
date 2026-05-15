const { getDatabase } = require("../config/database");

async function findUserByEmail(email) {
  const database = await getDatabase();

  return database.get(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
}

async function findUserById(id) {
  const database = await getDatabase();

  return database.get(
    "SELECT id, fullName, email, role, status, createdAt FROM users WHERE id = ?",
    [id]
  );
}

async function getAllUsers() {
  const database = await getDatabase();

  return database.all(
    "SELECT id, fullName, email, role, status, createdAt FROM users ORDER BY id ASC"
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  getAllUsers
};