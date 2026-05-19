const employeeRepository = require("../repositories/employeeRepository");
const departmentRepository = require("../repositories/departmentRepository");
const { validateEmployeeInput } = require("../validators/employeeValidator");

async function getAllEmployees(user) {
  if (!user) {
    throw new Error("Authenticated user is required.");
  }

  if (["Admin", "Manager", "HR"].includes(user.role)) {
    const employees = await employeeRepository.getAllEmployees(user.id);

    return {
      data: employees
    };
  }

  if (user.role === "Production") {
    const employees = await employeeRepository.getProductionAssignableEmployees();

    return {
      data: employees
    };
  }

  return {
    data: []
  };
}

async function getEmployeeById(id, ownerUserId) {
  const employee = await employeeRepository.getEmployeeById(id, ownerUserId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    data: employee
  };
}

async function getEmployeesByDepartment(departmentId, ownerUserId) {
  const department = await departmentRepository.getDepartmentById(departmentId, ownerUserId);

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  const employees = await employeeRepository.getEmployeesByDepartment(departmentId, ownerUserId);

  return {
    data: employees
  };
}

async function searchEmployees(query, ownerUserId) {
  if (!query || query.trim().length < 1) {
    const error = new Error("Search query is required.");
    error.statusCode = 400;
    throw error;
  }

  const employees = await employeeRepository.searchEmployees(query.trim(), ownerUserId);

  return {
    data: employees
  };
}

async function createEmployee(employeeData, ownerUserId) {
  const validation = validateEmployeeInput(employeeData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentRepository.getDepartmentById(employeeData.departmentId, ownerUserId);

  if (!department) {
    const error = new Error("Department not found for this user.");
    error.statusCode = 404;
    throw error;
  }

  const employee = await employeeRepository.createEmployee(employeeData, ownerUserId);

  return {
    message: "Employee created successfully.",
    data: employee
  };
}

async function updateEmployee(id, employeeData, ownerUserId) {
  const validation = validateEmployeeInput(employeeData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingEmployee = await employeeRepository.getEmployeeById(id, ownerUserId);

  if (!existingEmployee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const department = await departmentRepository.getDepartmentById(employeeData.departmentId, ownerUserId);

  if (!department) {
    const error = new Error("Department not found for this user.");
    error.statusCode = 404;
    throw error;
  }

  const employee = await employeeRepository.updateEmployee(id, employeeData, ownerUserId);

  return {
    message: "Employee updated successfully.",
    data: employee
  };
}

async function deleteEmployee(id, ownerUserId) {
  const employee = await employeeRepository.deleteEmployee(id, ownerUserId);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "Employee deleted successfully.",
    data: employee
  };
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByDepartment,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};