const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcryptjs");
const path = require("path");

let db;

async function getDatabase() {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, "../../database.sqlite"),
      driver: sqlite3.Database
    });
  }

  return db;
}

async function initializeDatabase() {
  const database = await getDatabase();

  await database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Admin', 'Manager', 'Production', 'Quality', 'Viewer')),
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      departmentName TEXT NOT NULL UNIQUE,
      managerName TEXT NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      employeeCode TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      position TEXT NOT NULL,
      departmentId INTEGER NOT NULL,
      hireDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS production_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER NOT NULL,
      recordDate TEXT NOT NULL,
      period TEXT NOT NULL,
      productType TEXT NOT NULL,
      targetQuantity INTEGER NOT NULL,
      actualQuantity INTEGER NOT NULL,
      defectiveQuantity INTEGER NOT NULL,
      onTimeCompletionScore REAL NOT NULL,
      plannedWorkDays INTEGER NOT NULL,
      absentDays INTEGER NOT NULL,
      lateDays INTEGER NOT NULL,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);

  await seedInitialData(database);
}

async function seedInitialData(database) {
  const userCount = await database.get("SELECT COUNT(*) AS count FROM users");

  if (userCount.count === 0) {
    const passwordHash = await bcrypt.hash("TatLee123", 10);

    const users = [
      ["TatLee Admin", "admin@tatleefactory.com", passwordHash, "Admin", "Active"],
      ["Factory Manager", "manager@tatleefactory.com", passwordHash, "Manager", "Active"],
      ["Production Officer", "production@tatleefactory.com", passwordHash, "Production", "Active"],
      ["Quality Controller", "quality@tatleefactory.com", passwordHash, "Quality", "Active"],
      ["Report Viewer", "viewer@tatleefactory.com", passwordHash, "Viewer", "Active"]
    ];

    for (const user of users) {
      await database.run(
        "INSERT INTO users (fullName, email, passwordHash, role, status) VALUES (?, ?, ?, ?, ?)",
        user
      );
    }
  }

  const departmentCount = await database.get("SELECT COUNT(*) AS count FROM departments");

  if (departmentCount.count === 0) {
    const departments = [
      ["Production", "Factory Manager", "Main production operations department"],
      ["Quality Control", "Quality Controller", "Responsible for product quality and defect tracking"],
      ["Packaging", "Packaging Supervisor", "Handles product packaging and final preparation"],
      ["Logistics", "Logistics Manager", "Responsible for warehouse and shipment operations"],
      ["Human Resources", "HR Specialist", "Supports employee continuity and organizational processes"],
      ["Information Technology", "IT Coordinator", "Supports internal systems and digital operations"]
    ];

    for (const department of departments) {
      await database.run(
        "INSERT INTO departments (departmentName, managerName, description) VALUES (?, ?, ?)",
        department
      );
    }
  }

  const employeeCount = await database.get("SELECT COUNT(*) AS count FROM employees");

  if (employeeCount.count === 0) {
    const employees = [
      ["Ahmet Yılmaz", "EMP-001", "ahmet.yilmaz@tatleefactory.com", "Production Operator", 1, "2024-02-12", "Active"],
      ["Ayşe Demir", "EMP-002", "ayse.demir@tatleefactory.com", "Quality Technician", 2, "2023-11-03", "Active"],
      ["Mehmet Kaya", "EMP-003", "mehmet.kaya@tatleefactory.com", "Packaging Operator", 3, "2025-01-20", "Active"],
      ["Elif Şahin", "EMP-004", "elif.sahin@tatleefactory.com", "Senior Production Specialist", 1, "2022-09-15", "Active"],
      ["Can Aydın", "EMP-005", "can.aydin@tatleefactory.com", "Logistics Assistant", 4, "2024-07-01", "Active"],
      ["Zeynep Arslan", "EMP-006", "zeynep.arslan@tatleefactory.com", "Production Assistant", 1, "2025-03-10", "Active"]
    ];

    for (const employee of employees) {
      await database.run(
        `INSERT INTO employees 
        (fullName, employeeCode, email, position, departmentId, hireDate, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        employee
      );
    }
  }

  const recordCount = await database.get("SELECT COUNT(*) AS count FROM production_records");

  if (recordCount.count === 0) {
    const records = [
      [1, "2026-05-01", "2026-Q2", "Packaging Unit", 500, 465, 12, 90, 22, 1, 2, "Good production result with minor defect risk."],
      [2, "2026-05-01", "2026-Q2", "Quality Inspection", 350, 340, 5, 95, 22, 0, 1, "Strong quality performance."],
      [3, "2026-05-01", "2026-Q2", "Box Assembly", 420, 360, 28, 78, 22, 3, 4, "Needs improvement in quality and continuity."],
      [4, "2026-05-01", "2026-Q2", "Production Line A", 600, 620, 8, 96, 22, 0, 0, "Excellent production, quality, and continuity."],
      [5, "2026-05-01", "2026-Q2", "Shipment Preparation", 300, 270, 9, 82, 22, 2, 5, "Moderate performance; late arrivals should be monitored."],
      [6, "2026-05-01", "2026-Q2", "Production Support", 400, 285, 35, 65, 22, 5, 6, "Critical performance indicators require review."]
    ];

    for (const record of records) {
      await database.run(
        `INSERT INTO production_records
        (employeeId, recordDate, period, productType, targetQuantity, actualQuantity, defectiveQuantity,
         onTimeCompletionScore, plannedWorkDays, absentDays, lateDays, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record
      );
    }
  }
}

module.exports = {
  getDatabase,
  initializeDatabase
};