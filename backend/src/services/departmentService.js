const departmentRepository = require("../repositories/departmentRepository");
const { validateDepartmentInput } = require("../validators/departmentValidator");

async function getAllDepartments() {
  return departmentRepository.getAllDepartments();
}

async function getDepartmentById(id) {
  const department = await departmentRepository.getDepartmentById(id);

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  return department;
}

async function createDepartment(data) {
  const validation = validateDepartmentInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  return departmentRepository.createDepartment(data);
}

async function updateDepartment(id, data) {
  await getDepartmentById(id);

  const validation = validateDepartmentInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  return departmentRepository.updateDepartment(id, data);
}

async function deleteDepartment(id) {
  const department = await getDepartmentById(id);

  if (Number(department.employeeCount) > 0) {
    const error = new Error("Department cannot be deleted because it has assigned employees.");
    error.statusCode = 400;
    throw error;
  }

  const deleted = await departmentRepository.deleteDepartment(id);

  if (!deleted) {
    const error = new Error("Department could not be deleted.");
    error.statusCode = 500;
    throw error;
  }

  return {
    message: "Department deleted successfully."
  };
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};