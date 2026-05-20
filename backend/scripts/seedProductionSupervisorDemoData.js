const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.sqlite");
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function main() {
  const productionUser = await get(
    "SELECT id FROM users WHERE email = ?",
    ["production@tatleefactory.com"]
  );

  if (!productionUser) {
    throw new Error("production@tatleefactory.com user not found.");
  }

  const ownerUserId = productionUser.id;

  const employees = [
    ["PROD-EMP-004", "Mehmet Kaya", "mehmet.kaya.prod@tatleefactory.com", "Machine Operator", 1, "2023-09-12", "Active"],
    ["PROD-EMP-005", "Ayşe Demir", "ayse.demir.prod@tatleefactory.com", "Line Worker", 1, "2024-02-18", "Active"],
    ["PROD-EMP-006", "Can Aydın", "can.aydin.prod@tatleefactory.com", "Production Operator", 1, "2022-11-05", "Active"],
    ["PROD-EMP-007", "Fatma Çelik", "fatma.celik.prod@tatleefactory.com", "Packaging Operator", 3, "2023-06-21", "Active"],
    ["PROD-EMP-008", "Burak Şen", "burak.sen.prod@tatleefactory.com", "Shift Worker", 1, "2024-01-14", "Active"],
    ["PROD-EMP-009", "Seda Koç", "seda.koc.prod@tatleefactory.com", "Production Assistant", 1, "2025-03-03", "Active"],
    ["PROD-EMP-010", "Okan Arslan", "okan.arslan.prod@tatleefactory.com", "Machine Operator", 1, "2021-12-09", "Active"],
    ["PROD-EMP-011", "Derya Yılmaz", "derya.yilmaz.prod@tatleefactory.com", "Packaging Worker", 3, "2023-04-17", "Active"],
    ["PROD-EMP-012", "Emir Özkan", "emir.ozkan.prod@tatleefactory.com", "Production Operator", 1, "2024-07-22", "Active"],
    ["PROD-EMP-013", "Ece Kılıç", "ece.kilic.prod@tatleefactory.com", "Line Assistant", 1, "2025-01-08", "Active"],
    ["PROD-EMP-014", "Kerem Doğan", "kerem.dogan.prod@tatleefactory.com", "Machine Operator", 1, "2022-08-30", "Active"],
    ["PROD-EMP-015", "Merve Aksoy", "merve.aksoy.prod@tatleefactory.com", "Packaging Operator", 3, "2023-10-11", "Active"],
    ["PROD-EMP-016", "Ali Eren", "ali.eren.prod@tatleefactory.com", "Production Worker", 1, "2024-05-26", "Active"],
    ["PROD-EMP-017", "Selin Kara", "selin.kara.prod@tatleefactory.com", "Production Assistant", 1, "2024-09-19", "Active"],
    ["PROD-EMP-018", "Tolga Yüce", "tolga.yuce.prod@tatleefactory.com", "Machine Operator", 1, "2023-01-25", "Active"],
    ["PROD-EMP-019", "İrem Güneş", "irem.gunes.prod@tatleefactory.com", "Packaging Worker", 3, "2025-02-02", "Active"],
    ["PROD-EMP-020", "Kaan Polat", "kaan.polat.prod@tatleefactory.com", "Production Operator", 1, "2022-06-15", "Active"]
  ];

  for (const employee of employees) {
    await run(
      `
      INSERT OR IGNORE INTO employees
      (ownerUserId, employeeCode, fullName, email, position, departmentId, hireDate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [ownerUserId, ...employee]
    );
  }

  const products = [
    ["PROD-PRD-004", "Vanilla Biscuit Pack", "Snack", "pack", 700, "Active"],
    ["PROD-PRD-005", "Lemon Soda Bottle", "Beverage", "bottle", 850, "Active"],
    ["PROD-PRD-006", "Detergent Box", "Cleaning Product", "box", 430, "Active"],
    ["PROD-PRD-007", "Frozen Pizza Box", "Frozen Food", "box", 520, "Active"],
    ["PROD-PRD-008", "Chocolate Bar Multipack", "Snack", "pack", 900, "Active"],
    ["PROD-PRD-009", "Orange Juice Bottle", "Beverage", "bottle", 780, "Active"],
    ["PROD-PRD-010", "Paper Cup Package", "Food Packaging", "pack", 1000, "Active"],
    ["PROD-PRD-011", "Shampoo Bottle", "Personal Care", "bottle", 610, "Active"],
    ["PROD-PRD-012", "Cereal Box", "Food Packaging", "box", 640, "Active"]
  ];

  for (const product of products) {
    await run(
      `
      INSERT OR IGNORE INTO products
      (ownerUserId, productCode, productName, category, standardUnit, targetPerShift, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [ownerUserId, ...product]
    );
  }

  const machines = [
    ["PROD-MCH-004", "Labeling Machine A", 1, "Active", 900, "Automatic product labeling unit"],
    ["PROD-MCH-005", "Carton Packing Line", 3, "Active", 750, "Carton packaging and boxing line"],
    ["PROD-MCH-006", "Bottle Filling Line", 1, "Active", 980, "Liquid product filling line"],
    ["PROD-MCH-007", "Quality Sorting Belt", 2, "Maintenance", 650, "Sorting belt under scheduled maintenance"],
    ["PROD-MCH-008", "Multipack Wrapping Unit", 3, "Active", 820, "Multipack wrapping machine"]
  ];

  for (const machine of machines) {
    await run(
      `
      INSERT OR IGNORE INTO production_machines
      (ownerUserId, machineCode, machineName, departmentId, status, capacityPerShift, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [ownerUserId, ...machine]
    );
  }

  const savedEmployees = await all(
    "SELECT id FROM employees WHERE ownerUserId = ? ORDER BY id LIMIT 20",
    [ownerUserId]
  );

  const savedProducts = await all(
    "SELECT id, productName, targetPerShift FROM products WHERE ownerUserId = ? ORDER BY id LIMIT 12",
    [ownerUserId]
  );

  const savedMachines = await all(
    "SELECT id FROM production_machines WHERE ownerUserId = ? ORDER BY id LIMIT 8",
    [ownerUserId]
  );

  for (let i = 0; i < 25; i++) {
    const employee = savedEmployees[i % savedEmployees.length];
    const product = savedProducts[i % savedProducts.length];
    const machine = savedMachines[i % savedMachines.length];

    const target = Number(product.targetPerShift || 500);
    const actual = Math.max(250, target - ((i % 6) * 25) + ((i % 4) * 15));
    const defective = (i % 5) + 3;
    const onTime = 82 + (i % 16);
    const absent = i % 4 === 0 ? 1 : 0;
    const late = i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0;

    await run(
      `
      INSERT OR IGNORE INTO production_records
      (
        ownerUserId,
        employeeId,
        productId,
        machineId,
        recordDate,
        period,
        productType,
        targetQuantity,
        actualQuantity,
        defectiveQuantity,
        onTimeCompletionScore,
        plannedWorkDays,
        absentDays,
        lateDays,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ownerUserId,
        employee.id,
        product.id,
        machine.id,
        `2026-05-${String((i % 20) + 1).padStart(2, "0")}`,
        "2026-Q2",
        product.productName,
        target,
        actual,
        defective,
        onTime,
        22,
        absent,
        late,
        "Realistic production supervisor demo record."
      ]
    );
  }

  const counts = {
    employees: await get("SELECT COUNT(*) AS count FROM employees WHERE ownerUserId = ?", [ownerUserId]),
    products: await get("SELECT COUNT(*) AS count FROM products WHERE ownerUserId = ?", [ownerUserId]),
    machines: await get("SELECT COUNT(*) AS count FROM production_machines WHERE ownerUserId = ?", [ownerUserId]),
    records: await get("SELECT COUNT(*) AS count FROM production_records WHERE ownerUserId = ?", [ownerUserId])
  };

  console.log("Production Supervisor demo data completed:");
  console.log({
    employees: counts.employees.count,
    products: counts.products.count,
    machines: counts.machines.count,
    productionRecords: counts.records.count
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    db.close();
  });
