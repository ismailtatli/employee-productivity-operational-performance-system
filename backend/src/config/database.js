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

function generateProductionRecords() {
  const records = [];

  for (let i = 1; i <= 120; i++) {
    const employeeId = ((i - 1) % 100) + 1;
    const productId = ((i - 1) % 25) + 1;
    const machineId = ((i - 1) % 10) + 1;

    const targetQuantity = 350 + ((i * 37) % 420);
    let actualQuantity = targetQuantity - 80 + ((i * 29) % 170);
    const defectiveQuantity = (i * 7) % 36;
    const onTimeCompletionScore = 62 + ((i * 11) % 39);
    const plannedWorkDays = 22;
    const absentDays = (i * 3) % 6;
    const lateDays = (i * 5) % 7;

    if (actualQuantity <= defectiveQuantity) {
      actualQuantity = defectiveQuantity + 80;
    }

    records.push([
      employeeId,
      productId,
      machineId,
      `2026-05-${String(((i - 1) % 28) + 1).padStart(2, "0")}`,
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
      ["Zeynep Arslan", "EMP-006", "zeynep.arslan@tatleefactory.com", "Production Assistant", 1, "2025-03-10", "Active"],
      ["Burak Çelik", "EMP-007", "burak.celik@tatleefactory.com", "Production Operator", 1, "2023-04-18", "Active"],
      ["Derya Koç", "EMP-008", "derya.koc@tatleefactory.com", "Quality Inspector", 2, "2022-06-22", "Active"],
      ["Emre Özkan", "EMP-009", "emre.ozkan@tatleefactory.com", "Packaging Operator", 3, "2024-10-09", "Active"],
      ["Selin Aksoy", "EMP-010", "selin.aksoy@tatleefactory.com", "Logistics Specialist", 4, "2021-08-14", "Active"],
      ["Murat Yıldız", "EMP-011", "murat.yildiz@tatleefactory.com", "Production Operator", 1, "2024-01-05", "Active"],
      ["Nazlı Korkmaz", "EMP-012", "nazli.korkmaz@tatleefactory.com", "Quality Technician", 2, "2023-02-17", "Active"],
      ["Okan Eren", "EMP-013", "okan.eren@tatleefactory.com", "Packaging Assistant", 3, "2025-04-02", "Active"],
      ["Buse Acar", "EMP-014", "buse.acar@tatleefactory.com", "HR Assistant", 5, "2024-09-11", "Active"],
      ["Kerem Polat", "EMP-015", "kerem.polat@tatleefactory.com", "IT Support Specialist", 6, "2022-12-01", "Active"],
      ["Ece Güneş", "EMP-016", "ece.gunes@tatleefactory.com", "Production Specialist", 1, "2021-05-19", "Active"],
      ["Hakan Arı", "EMP-017", "hakan.ari@tatleefactory.com", "Machine Operator", 1, "2020-11-27", "Active"],
      ["İrem Taş", "EMP-018", "irem.tas@tatleefactory.com", "Quality Analyst", 2, "2023-07-08", "Active"],
      ["Tolga Deniz", "EMP-019", "tolga.deniz@tatleefactory.com", "Packaging Specialist", 3, "2022-03-15", "Active"],
      ["Seda Uçar", "EMP-020", "seda.ucar@tatleefactory.com", "Warehouse Assistant", 4, "2025-02-04", "Active"],
      ["Alper Kurt", "EMP-021", "alper.kurt@tatleefactory.com", "Production Operator", 1, "2023-09-12", "Active"],
      ["Melis Yavuz", "EMP-022", "melis.yavuz@tatleefactory.com", "Quality Inspector", 2, "2024-04-21", "Active"],
      ["Serkan Bozkurt", "EMP-023", "serkan.bozkurt@tatleefactory.com", "Packaging Operator", 3, "2023-10-30", "Active"],
      ["Ceren Kaplan", "EMP-024", "ceren.kaplan@tatleefactory.com", "Logistics Coordinator", 4, "2021-01-13", "Active"],
      ["Umut Kılıç", "EMP-025", "umut.kilic@tatleefactory.com", "Production Assistant", 1, "2025-05-06", "Active"],
      ["Gizem Aydın", "EMP-026", "gizem.aydin@tatleefactory.com", "Quality Technician", 2, "2024-07-18", "Active"],
      ["Barış Mutlu", "EMP-027", "baris.mutlu@tatleefactory.com", "Packaging Operator", 3, "2022-08-25", "Active"],
      ["Esra Şimşek", "EMP-028", "esra.simsek@tatleefactory.com", "HR Specialist", 5, "2020-02-10", "Active"],
      ["Furkan Çetin", "EMP-029", "furkan.cetin@tatleefactory.com", "IT Technician", 6, "2023-12-19", "Active"],
      ["Merve Ekinci", "EMP-030", "merve.ekinci@tatleefactory.com", "Production Operator", 1, "2021-06-03", "Active"],
      ["Kaan Başar", "EMP-031", "kaan.basar@tatleefactory.com", "Machine Operator", 1, "2022-01-29", "Active"],
      ["Yasemin Öztürk", "EMP-032", "yasemin.ozturk@tatleefactory.com", "Quality Analyst", 2, "2024-03-16", "Active"],
      ["Onur Sezer", "EMP-033", "onur.sezer@tatleefactory.com", "Packaging Specialist", 3, "2023-05-12", "Active"],
      ["Dilara Avcı", "EMP-034", "dilara.avci@tatleefactory.com", "Logistics Assistant", 4, "2025-01-09", "Active"],
      ["Eren Bulut", "EMP-035", "eren.bulut@tatleefactory.com", "Production Operator", 1, "2022-10-07", "Active"],
      ["Sinem Yalçın", "EMP-036", "sinem.yalcin@tatleefactory.com", "Quality Inspector", 2, "2021-09-20", "Active"],
      ["Volkan Er", "EMP-037", "volkan.er@tatleefactory.com", "Packaging Operator", 3, "2024-06-11", "Active"],
      ["Pelin Karaca", "EMP-038", "pelin.karaca@tatleefactory.com", "HR Assistant", 5, "2023-08-28", "Active"],
      ["Arda Sönmez", "EMP-039", "arda.sonmez@tatleefactory.com", "IT Support Specialist", 6, "2022-04-04", "Active"],
      ["Nisa Çakır", "EMP-040", "nisa.cakir@tatleefactory.com", "Production Specialist", 1, "2020-07-23", "Active"],
      ["Tuna Akgün", "EMP-041", "tuna.akgun@tatleefactory.com", "Production Operator", 1, "2024-02-15", "Active"],
      ["İlayda Koşar", "EMP-042", "ilayda.kosar@tatleefactory.com", "Quality Technician", 2, "2023-03-24", "Active"],
      ["Bora Efe", "EMP-043", "bora.efe@tatleefactory.com", "Packaging Assistant", 3, "2025-04-14", "Active"],
      ["Dilan Keskin", "EMP-044", "dilan.keskin@tatleefactory.com", "Logistics Specialist", 4, "2021-12-06", "Active"],
      ["Yiğit Sarı", "EMP-045", "yigit.sari@tatleefactory.com", "Machine Operator", 1, "2022-11-02", "Active"],
      ["Aylin Doğan", "EMP-046", "aylin.dogan@tatleefactory.com", "Quality Analyst", 2, "2024-01-18", "Active"],
      ["Deniz Tekin", "EMP-047", "deniz.tekin@tatleefactory.com", "Packaging Operator", 3, "2023-07-30", "Active"],
      ["Sude Ergin", "EMP-048", "sude.ergin@tatleefactory.com", "Warehouse Assistant", 4, "2025-02-26", "Active"],
      ["Mert Alkan", "EMP-049", "mert.alkan@tatleefactory.com", "Production Operator", 1, "2021-04-17", "Active"],
      ["Elvan Kurtuluş", "EMP-050", "elvan.kurtulus@tatleefactory.com", "HR Specialist", 5, "2020-09-05", "Active"],
      ["Koray Işık", "EMP-051", "koray.isik@tatleefactory.com", "Production Assistant", 1, "2025-03-22", "Active"],
      ["Bahar Öner", "EMP-052", "bahar.oner@tatleefactory.com", "Quality Inspector", 2, "2022-05-27", "Active"],
      ["Cem Varol", "EMP-053", "cem.varol@tatleefactory.com", "Packaging Specialist", 3, "2023-09-01", "Active"],
      ["Sıla Arslan", "EMP-054", "sila.arslan@tatleefactory.com", "Logistics Coordinator", 4, "2021-10-15", "Active"],
      ["Miraç Yüce", "EMP-055", "mirac.yuce@tatleefactory.com", "Machine Operator", 1, "2020-12-13", "Active"],
      ["Yaren Ceylan", "EMP-056", "yaren.ceylan@tatleefactory.com", "Quality Technician", 2, "2024-05-09", "Active"],
      ["Sarp Özdemir", "EMP-057", "sarp.ozdemir@tatleefactory.com", "Packaging Operator", 3, "2022-07-18", "Active"],
      ["Defne Kural", "EMP-058", "defne.kural@tatleefactory.com", "IT Technician", 6, "2023-11-25", "Active"],
      ["Oğuzhan Erol", "EMP-059", "oguzhan.erol@tatleefactory.com", "Production Operator", 1, "2024-08-03", "Active"],
      ["Gülce Aydın", "EMP-060", "gulce.aydin@tatleefactory.com", "HR Assistant", 5, "2025-01-22", "Active"],
      ["Berkay Uslu", "EMP-061", "berkay.uslu@tatleefactory.com", "Production Specialist", 1, "2022-02-08", "Active"],
      ["Aslıhan Kaya", "EMP-062", "aslihan.kaya@tatleefactory.com", "Quality Analyst", 2, "2021-03-19", "Active"],
      ["Rüzgar Aydın", "EMP-063", "ruzgar.aydin@tatleefactory.com", "Packaging Assistant", 3, "2025-04-29", "Active"],
      ["Eylül Kılıç", "EMP-064", "eylul.kilic@tatleefactory.com", "Warehouse Assistant", 4, "2023-06-07", "Active"],
      ["Batuhan Çevik", "EMP-065", "batuhan.cevik@tatleefactory.com", "Machine Operator", 1, "2020-08-31", "Active"],
      ["İdil Soylu", "EMP-066", "idil.soylu@tatleefactory.com", "Quality Inspector", 2, "2024-10-12", "Active"],
      ["Sinan Aktaş", "EMP-067", "sinan.aktas@tatleefactory.com", "Packaging Operator", 3, "2021-11-18", "Active"],
      ["Duru Eren", "EMP-068", "duru.eren@tatleefactory.com", "Logistics Assistant", 4, "2025-05-01", "Active"],
      ["Efe Çınar", "EMP-069", "efe.cinar@tatleefactory.com", "Production Operator", 1, "2023-01-26", "Active"],
      ["Belinay Güler", "EMP-070", "belinay.guler@tatleefactory.com", "Quality Technician", 2, "2022-09-09", "Active"],
      ["Kuzey Taş", "EMP-071", "kuzey.tas@tatleefactory.com", "Production Assistant", 1, "2025-02-18", "Active"],
      ["Lara Bulut", "EMP-072", "lara.bulut@tatleefactory.com", "Quality Analyst", 2, "2024-06-24", "Active"],
      ["Doruk Yalın", "EMP-073", "doruk.yalin@tatleefactory.com", "Packaging Specialist", 3, "2023-04-13", "Active"],
      ["Alara Şen", "EMP-074", "alara.sen@tatleefactory.com", "Logistics Specialist", 4, "2020-10-20", "Active"],
      ["Metehan Baran", "EMP-075", "metehan.baran@tatleefactory.com", "Machine Operator", 1, "2021-02-27", "Active"],
      ["Nehir Polat", "EMP-076", "nehir.polat@tatleefactory.com", "Quality Inspector", 2, "2022-12-16", "Active"],
      ["Kıvanç Demir", "EMP-077", "kivanc.demir@tatleefactory.com", "Packaging Operator", 3, "2024-03-03", "Active"],
      ["Yağmur Deniz", "EMP-078", "yagmur.deniz@tatleefactory.com", "HR Specialist", 5, "2021-07-11", "Active"],
      ["Aras Koç", "EMP-079", "aras.koc@tatleefactory.com", "IT Support Specialist", 6, "2023-02-06", "Active"],
      ["Mina Akın", "EMP-080", "mina.akin@tatleefactory.com", "Production Operator", 1, "2022-06-15", "Active"],
      ["Eymen Acar", "EMP-081", "eymen.acar@tatleefactory.com", "Production Specialist", 1, "2020-04-08", "Active"],
      ["İpek Yıldırım", "EMP-082", "ipek.yildirim@tatleefactory.com", "Quality Technician", 2, "2024-11-05", "Active"],
      ["Atlas Gök", "EMP-083", "atlas.gok@tatleefactory.com", "Packaging Assistant", 3, "2025-05-12", "Active"],
      ["Lina Korkmaz", "EMP-084", "lina.korkmaz@tatleefactory.com", "Warehouse Assistant", 4, "2023-08-02", "Active"],
      ["Tamer Güven", "EMP-085", "tamer.guven@tatleefactory.com", "Machine Operator", 1, "2021-01-21", "Active"],
      ["İnci Çelik", "EMP-086", "inci.celik@tatleefactory.com", "Quality Analyst", 2, "2022-04-30", "Active"],
      ["Cihan Alev", "EMP-087", "cihan.alev@tatleefactory.com", "Packaging Operator", 3, "2024-09-19", "Active"],
      ["Maya Sezer", "EMP-088", "maya.sezer@tatleefactory.com", "Logistics Assistant", 4, "2025-03-07", "Active"],
      ["Ozan İlter", "EMP-089", "ozan.ilter@tatleefactory.com", "Production Operator", 1, "2023-10-01", "Active"],
      ["Eda Çoban", "EMP-090", "eda.coban@tatleefactory.com", "HR Assistant", 5, "2024-12-09", "Active"],
      ["Uğur Bal", "EMP-091", "ugur.bal@tatleefactory.com", "Production Assistant", 1, "2025-01-31", "Active"],
      ["Hazal Tek", "EMP-092", "hazal.tek@tatleefactory.com", "Quality Inspector", 2, "2021-05-28", "Active"],
      ["Kadir Yaman", "EMP-093", "kadir.yaman@tatleefactory.com", "Packaging Specialist", 3, "2022-07-06", "Active"],
      ["Melike Savaş", "EMP-094", "melike.savas@tatleefactory.com", "Logistics Coordinator", 4, "2020-03-18", "Active"],
      ["Ersin Duman", "EMP-095", "ersin.duman@tatleefactory.com", "Machine Operator", 1, "2023-06-20", "Active"],
      ["Nilay Şeker", "EMP-096", "nilay.seker@tatleefactory.com", "Quality Technician", 2, "2024-02-02", "Active"],
      ["Rıza Kalkan", "EMP-097", "riza.kalkan@tatleefactory.com", "Packaging Operator", 3, "2021-09-25", "Inactive"],
      ["İrem Nur", "EMP-098", "irem.nur@tatleefactory.com", "IT Technician", 6, "2023-03-11", "Active"],
      ["Taner Öz", "EMP-099", "taner.oz@tatleefactory.com", "Production Operator", 1, "2022-11-29", "Active"],
      ["Açelya Ural", "EMP-100", "acelya.ural@tatleefactory.com", "Quality Analyst", 2, "2024-05-25", "Active"]
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
    const records = generateProductionRecords();

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