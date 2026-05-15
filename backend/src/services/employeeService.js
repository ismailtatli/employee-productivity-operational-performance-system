const employeeRepository = require("../repositories/employeeRepository");
const { validateEmployeeInput } = require("../validators/employeeValidator");

async function getAllEmployees() {
  return employeeRepository.getAllEmployees();
}

async function getEmployeeById(id) {
  const employee = await employeeRepository.getEmployeeById(id);

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return employee;
}

async function searchEmployees(query) {
  if (!query || query.trim() === "") {
    const error = new Error("Search query is required.");
    error.statusCode = 400;
    throw error;
  }

  return employeeRepository.searchEmployees(query);
}

async function getEmployeesByDepartment(departmentId) {
  if (!departmentId || Number(departmentId) <= 0) {
    const error = new Error("Valid department id is required.");
    error.statusCode = 400;
    throw error;
  }

  return employeeRepository.getEmployeesByDepartment(departmentId);
}

async function createEmployee(data) {
  const validation = validateEmployeeInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  return employeeRepository.createEmployee({
    ...data,
    departmentId: Number(data.departmentId),
    status: data.status || "Active"
  });
}

async function updateEmployee(id, data) {
  await getEmployeeById(id);

  const validation = validateEmployeeInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  return employeeRepository.updateEmployee(id, {
    ...data,
    departmentId: Number(data.departmentId),
    status: data.status || "Active"
  });
}

async function deleteEmployee(id) {
  await getEmployeeById(id);

  const deleted = await employeeRepository.deleteEmployee(id);

  if (!deleted) {
    const error = new Error("Employee could not be deleted.");
    error.statusCode = 500;
    throw error;
  }

  return {
    message: "Employee deleted successfully."
  };
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  getEmployeesByDepartment,
  createEmployee,
  updateEmployee,
  deleteEmployee
};