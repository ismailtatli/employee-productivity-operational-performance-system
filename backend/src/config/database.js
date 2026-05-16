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

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productCode TEXT NOT NULL UNIQUE,
      productName TEXT NOT NULL,
      category TEXT NOT NULL,
      standardUnit TEXT NOT NULL,
      targetPerShift INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS production_machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machineCode TEXT NOT NULL UNIQUE,
      machineName TEXT NOT NULL,
      departmentId INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Maintenance', 'Inactive')),
      capacityPerShift INTEGER NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
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
      productId INTEGER NOT NULL,
      machineId INTEGER NOT NULL,
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
      FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (machineId) REFERENCES production_machines(id) ON DELETE CASCADE
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

  const productCount = await database.get("SELECT COUNT(*) AS count FROM products");

  if (productCount.count === 0) {
    const products = [
      ["PRD-001", "Chocolate Wafer Box", "Food Packaging", "box", 500, "Active"],
      ["PRD-002", "Protein Bar Pack", "Food Packaging", "pack", 650, "Active"],
      ["PRD-003", "Biscuit Family Pack", "Food Packaging", "pack", 700, "Active"],
      ["PRD-004", "Mini Cake Box", "Food Packaging", "box", 480, "Active"],
      ["PRD-005", "Cereal Bar Carton", "Food Packaging", "carton", 420, "Active"],
      ["PRD-006", "Tea Bag Retail Pack", "Beverage Packaging", "pack", 600, "Active"],
      ["PRD-007", "Coffee Sachet Box", "Beverage Packaging", "box", 550, "Active"],
      ["PRD-008", "Fruit Juice Bottle", "Beverage", "bottle", 800, "Active"],
      ["PRD-009", "Mineral Water Bottle", "Beverage", "bottle", 900, "Active"],
      ["PRD-010", "Energy Drink Can", "Beverage", "can", 760, "Active"],
      ["PRD-011", "Detergent Bottle", "Cleaning Product", "bottle", 450, "Active"],
      ["PRD-012", "Liquid Soap Bottle", "Personal Care", "bottle", 520, "Active"],
      ["PRD-013", "Shampoo Bottle", "Personal Care", "bottle", 480, "Active"],
      ["PRD-014", "Paper Towel Pack", "Household", "pack", 700, "Active"],
      ["PRD-015", "Napkin Pack", "Household", "pack", 850, "Active"],
      ["PRD-016", "Plastic Container Set", "Household", "set", 360, "Active"],
      ["PRD-017", "Lunch Box", "Household", "unit", 300, "Active"],
      ["PRD-018", "Frozen Pizza Box", "Frozen Food", "box", 420, "Active"],
      ["PRD-019", "Frozen Vegetable Pack", "Frozen Food", "pack", 500, "Active"],
      ["PRD-020", "Ice Cream Cup", "Frozen Food", "cup", 650, "Active"],
      ["PRD-021", "Snack Chips Pack", "Snack", "pack", 780, "Active"],
      ["PRD-022", "Cracker Pack", "Snack", "pack", 720, "Active"],
      ["PRD-023", "Candy Bag", "Snack", "bag", 680, "Active"],
      ["PRD-024", "Chocolate Tablet", "Snack", "unit", 750, "Active"],
      ["PRD-025", "Gum Multipack", "Snack", "pack", 900, "Active"]
    ];

    for (const product of products) {
      await database.run(
        `INSERT INTO products
        (productCode, productName, category, standardUnit, targetPerShift, status)
        VALUES (?, ?, ?, ?, ?, ?)`,
        product
      );
    }
  }

  const machineCount = await database.get("SELECT COUNT(*) AS count FROM production_machines");

  if (machineCount.count === 0) {
    const machines = [
      ["MCH-001", "Filling Line A", 1, "Active", 1200, "High-volume filling and primary production line"],
      ["MCH-002", "Filling Line B", 1, "Active", 1100, "Secondary filling and production line"],
      ["MCH-003", "Packaging Unit A", 3, "Active", 900, "Automatic packaging machine"],
      ["MCH-004", "Packaging Unit B", 3, "Active", 850, "Backup packaging machine"],
      ["MCH-005", "Quality Scanner 1", 2, "Active", 700, "Automated quality inspection scanner"],
      ["MCH-006", "Quality Scanner 2", 2, "Maintenance", 650, "Secondary inspection scanner under maintenance"],
      ["MCH-007", "Labeling Machine A", 3, "Active", 1000, "Product labeling and barcode printing"],
      ["MCH-008", "Sorting Conveyor", 4, "Active", 950, "Sorting and transfer conveyor"],
      ["MCH-009", "Sealing Unit", 1, "Active", 780, "Product sealing and closing unit"],
      ["MCH-010", "Palletizing Robot", 4, "Active", 600, "Automated palletizing and shipment preparation"]
    ];

    for (const machine of machines) {
      await database.run(
        `INSERT INTO production_machines
        (machineCode, machineName, departmentId, status, capacityPerShift, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
        machine
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
      [1, 1, 1, "2026-05-01", "2026-Q2", "Chocolate Wafer Box", 500, 465, 12, 90, 22, 1, 2, "Good production result with minor defect risk."],
      [2, 2, 5, "2026-05-01", "2026-Q2", "Protein Bar Pack", 350, 340, 5, 95, 22, 0, 1, "Strong quality performance."],
      [3, 3, 3, "2026-05-01", "2026-Q2", "Biscuit Family Pack", 420, 360, 28, 78, 22, 3, 4, "Needs improvement in quality and continuity."],
      [4, 4, 1, "2026-05-01", "2026-Q2", "Mini Cake Box", 600, 620, 8, 96, 22, 0, 0, "Excellent production, quality, and continuity."],
      [5, 8, 8, "2026-05-01", "2026-Q2", "Fruit Juice Bottle", 300, 270, 9, 82, 22, 2, 5, "Moderate performance; late arrivals should be monitored."],
      [6, 5, 2, "2026-05-01", "2026-Q2", "Cereal Bar Carton", 400, 285, 35, 65, 22, 5, 6, "Critical performance indicators require review."],
      [4, 10, 9, "2026-05-10", "2026-Q2", "Energy Drink Can", 550, 590, 6, 97, 22, 0, 0, "Excellent performance with strong productivity."],
      [1, 7, 7, "2026-05-11", "2026-Q2", "Coffee Sachet Box", 520, 510, 14, 88, 22, 1, 1, "Stable production result."],
      [2, 12, 5, "2026-05-12", "2026-Q2", "Liquid Soap Bottle", 450, 430, 8, 93, 22, 0, 2, "Good quality control and stable continuity."],
      [3, 21, 4, "2026-05-13", "2026-Q2", "Snack Chips Pack", 600, 520, 30, 74, 22, 4, 3, "Requires close monitoring in next period."]
    ];

    for (const record of records) {
      await database.run(
        `INSERT INTO production_records
        (employeeId, productId, machineId, recordDate, period, productType, targetQuantity, actualQuantity, defectiveQuantity,
         onTimeCompletionScore, plannedWorkDays, absentDays, lateDays, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record
      );
    }
  }
}

module.exports = {
  getDatabase,
  initializeDatabase
};