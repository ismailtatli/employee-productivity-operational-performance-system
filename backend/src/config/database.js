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

function generateEmployees() {
  const firstNames = [
    "Ahmet", "Ayşe", "Mehmet", "Elif", "Can", "Zeynep", "Burak", "Derya", "Emre", "Selin",
    "Murat", "Nazlı", "Okan", "Buse", "Kerem", "Ece", "Hakan", "İrem", "Tolga", "Seda",
    "Alper", "Melis", "Serkan", "Ceren", "Umut", "Gizem", "Barış", "Esra", "Furkan", "Merve",
    "Kaan", "Yasemin", "Onur", "Dilara", "Eren", "Sinem", "Volkan", "Pelin", "Arda", "Nisa",
    "Tuna", "İlayda", "Bora", "Dilan", "Yiğit", "Aylin", "Deniz", "Sude", "Mert", "Elvan",
    "Koray", "Bahar", "Cem", "Sıla", "Miraç", "Yaren", "Sarp", "Defne", "Oğuzhan", "Gülce",
    "Berkay", "Aslıhan", "Rüzgar", "Eylül", "Batuhan", "İdil", "Sinan", "Duru", "Efe", "Belinay",
    "Kuzey", "Lara", "Doruk", "Alara", "Metehan", "Nehir", "Kıvanç", "Yağmur", "Aras", "Mina",
    "Eymen", "İpek", "Atlas", "Lina", "Tamer", "İnci", "Cihan", "Maya", "Ozan", "Eda",
    "Uğur", "Hazal", "Kadir", "Melike", "Ersin", "Nilay", "Rıza", "İrem Nur", "Taner", "Açelya"
  ];

  const lastNames = [
    "Yılmaz", "Demir", "Kaya", "Şahin", "Aydın", "Arslan", "Çelik", "Koç", "Özkan", "Aksoy",
    "Yıldız", "Korkmaz", "Eren", "Acar", "Polat", "Güneş", "Arı", "Taş", "Deniz", "Uçar",
    "Kurt", "Yavuz", "Bozkurt", "Kaplan", "Kılıç", "Aydın", "Mutlu", "Şimşek", "Çetin", "Ekinci",
    "Başar", "Öztürk", "Sezer", "Avcı", "Bulut", "Yalçın", "Er", "Karaca", "Sönmez", "Çakır",
    "Akgün", "Koşar", "Efe", "Keskin", "Sarı", "Doğan", "Tekin", "Ergin", "Alkan", "Kurtuluş",
    "Işık", "Öner", "Varol", "Arslan", "Yüce", "Ceylan", "Özdemir", "Kural", "Erol", "Aydın",
    "Uslu", "Kaya", "Aydın", "Kılıç", "Çevik", "Soylu", "Aktaş", "Eren", "Çınar", "Güler",
    "Taş", "Bulut", "Yalın", "Şen", "Baran", "Polat", "Demir", "Deniz", "Koç", "Akın",
    "Acar", "Yıldırım", "Gök", "Korkmaz", "Güven", "Çelik", "Alev", "Sezer", "İlter", "Çoban",
    "Bal", "Tek", "Yaman", "Savaş", "Duman", "Şeker", "Kalkan", "Nur", "Öz", "Ural"
  ];

  const positionsByDepartment = {
    1: ["Production Operator", "Production Assistant", "Machine Operator", "Production Specialist", "Senior Production Specialist"],
    2: ["Quality Technician", "Quality Inspector", "Quality Analyst"],
    3: ["Packaging Operator", "Packaging Assistant", "Packaging Specialist"],
    4: ["Logistics Assistant", "Logistics Specialist", "Warehouse Assistant", "Logistics Coordinator"],
    5: ["HR Assistant", "HR Specialist"],
    6: ["IT Technician", "IT Support Specialist"]
  };

  const departmentPattern = [
    1, 2, 3, 1, 4, 1, 1, 2, 3, 4,
    1, 2, 3, 5, 6, 1, 1, 2, 3, 4
  ];

  const employees = [];

  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[i - 1];
    const lastName = lastNames[i - 1];
    const fullName = `${firstName} ${lastName}`;
    const employeeCode = `EMP-${String(i).padStart(3, "0")}`;

    const emailName = `${firstName}.${lastName}`
      .toLowerCase()
      .replaceAll("ı", "i")
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c")
      .replaceAll(" ", "")
      .replaceAll("İ".toLowerCase(), "i");

    const email = `${emailName}@tatleefactory.com`;
    const departmentId = departmentPattern[(i - 1) % departmentPattern.length];
    const positions = positionsByDepartment[departmentId];
    const position = positions[(i - 1) % positions.length];

    const hireYear = 2020 + (i % 6);
    const hireMonth = String(((i * 3) % 12) + 1).padStart(2, "0");
    const hireDay = String(((i * 7) % 28) + 1).padStart(2, "0");
    const hireDate = `${hireYear}-${hireMonth}-${hireDay}`;

    const status = i === 97 ? "Inactive" : "Active";

    employees.push([
      fullName,
      employeeCode,
      email,
      position,
      departmentId,
      hireDate,
      status
    ]);
  }

  return employees;
}

function generateProductionRecords() {
  const records = [];

  // Standardized employee report seed:
  // 100 employees x 2 records = every employee has an individual report and trend data.
  // Scores are intentionally distributed across high, stable, improvement, and critical bands.
  const performanceBands = [
    { count: 15, target: 94, quality: 95, continuity: { absent: 0, late: 0 }, onTime: 94 },
    { count: 25, target: 82, quality: 88, continuity: { absent: 1, late: 2 }, onTime: 82 },
    { count: 30, target: 74, quality: 84, continuity: { absent: 2, late: 3 }, onTime: 74 },
    { count: 20, target: 63, quality: 78, continuity: { absent: 4, late: 4 }, onTime: 64 },
    { count: 10, target: 43, quality: 60, continuity: { absent: 8, late: 7 }, onTime: 43 }
  ];

  const employeeProfiles = [];
  performanceBands.forEach((band) => {
    for (let i = 0; i < band.count; i++) {
      employeeProfiles.push(band);
    }
  });

  let recordNo = 1;

  for (let employeeIndex = 1; employeeIndex <= 100; employeeIndex++) {
    const profile = employeeProfiles[employeeIndex - 1];

    for (let cycle = 0; cycle < 2; cycle++) {
      const productId = ((employeeIndex + cycle * 7 - 1) % 25) + 1;
      const machineId = ((employeeIndex + cycle * 3 - 1) % 10) + 1;
      const targetQuantity = 420 + ((employeeIndex * 13 + cycle * 29) % 260);

      const targetAdjustment = cycle === 0 ? -2 : 2;
      const qualityAdjustment = cycle === 0 ? -1 : 1;
      const onTimeAdjustment = cycle === 0 ? -2 : 2;

      const targetCompletion = Math.max(45, Math.min(100, profile.target + targetAdjustment));
      const qualityScore = Math.max(60, Math.min(99, profile.quality + qualityAdjustment));
      const actualQuantity = Math.max(1, Math.round((targetQuantity * targetCompletion) / 100));
      const defectiveQuantity = Math.max(
        0,
        Math.min(actualQuantity - 1, Math.round((actualQuantity * (100 - qualityScore)) / 100))
      );

      const plannedWorkDays = 22;
      const absentDays = profile.continuity.absent;
      const lateDays = profile.continuity.late + (cycle === 0 ? 0 : employeeIndex % 2);
      const onTimeCompletionScore = Math.max(45, Math.min(99, profile.onTime + onTimeAdjustment));

      records.push([
        employeeIndex,
        productId,
        machineId,
        `2026-05-${String(((recordNo - 1) % 28) + 1).padStart(2, "0")}`,
        "2026-Q2",
        `Product Operation ${String(productId).padStart(2, "0")}`,
        targetQuantity,
        actualQuantity,
        defectiveQuantity,
        onTimeCompletionScore,
        plannedWorkDays,
        absentDays,
        lateDays,
        generateRecordNote(actualQuantity, targetQuantity, defectiveQuantity, absentDays, lateDays)
      ]);

      recordNo += 1;
    }
  }

  return records;
}

function generateRecordNote(actualQuantity, targetQuantity, defectiveQuantity, absentDays, lateDays) {
  if (actualQuantity >= targetQuantity && defectiveQuantity <= 8 && absentDays === 0) {
    return "Excellent production result with strong quality and continuity.";
  }

  if (actualQuantity < targetQuantity * 0.75 || absentDays >= 4) {
    return "Performance indicators require close monitoring in the next evaluation period.";
  }

  if (defectiveQuantity >= 25) {
    return "Quality indicators should be reviewed due to increased defective quantity.";
  }

  if (lateDays >= 5) {
    return "Continuity should be monitored due to repeated late arrivals.";
  }

  return "Stable operational production record.";
}

async function normalizeSharedFactoryData(database) {
  // The application uses one shared factory dataset. Roles control module access, not row ownership.
  // This removes old per-demo-user duplicate rows so counts are identical for every authorized role.
  await database.exec(`
    PRAGMA foreign_keys = ON;
    DELETE FROM production_records WHERE ownerUserId <> 1;
    DELETE FROM employees WHERE ownerUserId <> 1;
    DELETE FROM products WHERE ownerUserId <> 1;
    DELETE FROM production_machines WHERE ownerUserId <> 1;
    DELETE FROM departments WHERE ownerUserId <> 1;
  `);
}


async function ensureStandardReportSeedData(database) {
  const defaultOwnerUserId = 1;

  const employeeCount = await database.get("SELECT COUNT(*) AS count FROM employees WHERE ownerUserId = ?", defaultOwnerUserId);
  if (Number(employeeCount.count) !== 100) {
    await database.run("DELETE FROM production_records WHERE ownerUserId = ?", defaultOwnerUserId);
    await database.run("DELETE FROM employees WHERE ownerUserId = ?", defaultOwnerUserId);

    const employees = generateEmployees();
    for (const employee of employees) {
      await database.run(
        `INSERT INTO employees
        (ownerUserId, fullName, employeeCode, email, position, departmentId, hireDate, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [defaultOwnerUserId, ...employee]
      );
    }
  }

  const recordCount = await database.get("SELECT COUNT(*) AS count FROM production_records WHERE ownerUserId = ?", defaultOwnerUserId);
  if (Number(recordCount.count) !== 200) {
    await database.run("DELETE FROM production_records WHERE ownerUserId = ?", defaultOwnerUserId);

    const records = generateProductionRecords();
    for (const record of records) {
      await database.run(
        `INSERT INTO production_records
        (ownerUserId, employeeId, productId, machineId, recordDate, period, productType, targetQuantity, actualQuantity, defectiveQuantity,
         onTimeCompletionScore, plannedWorkDays, absentDays, lateDays, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [defaultOwnerUserId, ...record]
      );
    }
  }
}

async function ensureSchemaMigrations(database) {
  const addColumnIfMissing = async (tableName, columnName, definition) => {
    const columns = await database.all(`PRAGMA table_info(${tableName})`);
    if (!columns.some((column) => column.name === columnName)) {
      await database.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }
  };

  for (const tableName of ["departments", "products", "production_machines", "employees", "production_records"]) {
    await addColumnIfMissing(tableName, "deletedAt", "TEXT DEFAULT NULL");
  }
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
      role TEXT NOT NULL CHECK(role IN ('Admin', 'Manager', 'Production', 'Quality', 'HR', 'Viewer')),
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerUserId INTEGER NOT NULL,
      departmentName TEXT NOT NULL,
      managerName TEXT NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      deletedAt TEXT DEFAULT NULL,
      FOREIGN KEY (ownerUserId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerUserId INTEGER NOT NULL,
      productCode TEXT NOT NULL,
      productName TEXT NOT NULL,
      category TEXT NOT NULL,
      standardUnit TEXT NOT NULL,
      targetPerShift INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      deletedAt TEXT DEFAULT NULL,
      FOREIGN KEY (ownerUserId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS production_machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerUserId INTEGER NOT NULL,
      machineCode TEXT NOT NULL,
      machineName TEXT NOT NULL,
      departmentId INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Maintenance', 'Inactive')),
      capacityPerShift INTEGER NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      deletedAt TEXT DEFAULT NULL,
      FOREIGN KEY (ownerUserId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerUserId INTEGER NOT NULL,
      fullName TEXT NOT NULL,
      employeeCode TEXT NOT NULL,
      email TEXT NOT NULL,
      position TEXT NOT NULL,
      departmentId INTEGER NOT NULL,
      hireDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      deletedAt TEXT DEFAULT NULL,
      FOREIGN KEY (ownerUserId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS production_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerUserId INTEGER NOT NULL,
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
      deletedAt TEXT DEFAULT NULL,
      FOREIGN KEY (ownerUserId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (machineId) REFERENCES production_machines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      userEmail TEXT,
      userRole TEXT,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entityId INTEGER,
      method TEXT,
      path TEXT,
      statusCode INTEGER,
      details TEXT,
      ipAddress TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  await ensureSchemaMigrations(database);

  await seedInitialData(database);
  await normalizeSharedFactoryData(database);
  await ensureStandardReportSeedData(database);
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
      ["HR Specialist", "hr@tatleefactory.com", passwordHash, "HR", "Active"],
      ["Report Viewer", "viewer@tatleefactory.com", passwordHash, "Viewer", "Active"]
    ];

    for (const user of users) {
      await database.run(
        "INSERT INTO users (fullName, email, passwordHash, role, status) VALUES (?, ?, ?, ?, ?)",
        user
      );
    }
  }

  const defaultOwnerUserId = 1;

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
        "INSERT INTO departments (ownerUserId, departmentName, managerName, description) VALUES (?, ?, ?, ?)",
        [defaultOwnerUserId, ...department]
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
        (ownerUserId, productCode, productName, category, standardUnit, targetPerShift, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [defaultOwnerUserId, ...product]
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
        (ownerUserId, machineCode, machineName, departmentId, status, capacityPerShift, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [defaultOwnerUserId, ...machine]
      );
    }
  }

  const employeeCount = await database.get("SELECT COUNT(*) AS count FROM employees");

  if (employeeCount.count === 0) {
    const employees = generateEmployees();

    for (const employee of employees) {
      await database.run(
        `INSERT INTO employees
        (ownerUserId, fullName, employeeCode, email, position, departmentId, hireDate, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [defaultOwnerUserId, ...employee]
      );
    }
  }

  const recordCount = await database.get("SELECT COUNT(*) AS count FROM production_records");

  if (recordCount.count === 0) {
    const records = generateProductionRecords();

    for (const record of records) {
      await database.run(
        `INSERT INTO production_records
        (ownerUserId, employeeId, productId, machineId, recordDate, period, productType, targetQuantity, actualQuantity, defectiveQuantity,
         onTimeCompletionScore, plannedWorkDays, absentDays, lateDays, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [defaultOwnerUserId, ...record]
      );
    }
  }
}

module.exports = {
  getDatabase,
  initializeDatabase
};