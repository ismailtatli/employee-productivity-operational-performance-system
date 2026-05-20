const { getDatabase } = require("../config/database");

async function findUserByEmail(email) {
  const database = await getDatabase();

  return database.get(
    "SELECT * FROM users WHERE email = ?",
    email
  );
}

async function findUserById(id) {
  const database = await getDatabase();

  return database.get(
    "SELECT id, fullName, email, role, status, createdAt FROM users WHERE id = ?",
    id
  );
}

async function createUser(userData) {
  const database = await getDatabase();

  const result = await database.run(
    `INSERT INTO users
    (fullName, email, passwordHash, role, status)
    VALUES (?, ?, ?, ?, ?)`,
    [
      userData.fullName,
      userData.email,
      userData.passwordHash,
      userData.role || "Viewer",
      userData.status || "Active"
    ]
  );

  return findUserById(result.lastID);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};