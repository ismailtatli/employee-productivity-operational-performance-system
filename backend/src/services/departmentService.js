const departmentRepository = require("../repositories/departmentRepository");
const { validateDepartmentInput } = require("../validators/departmentValidator");

async function getAllDepartments(ownerUserId) {
  const departments = await departmentRepository.getAllDepartments(ownerUserId);

  return {
    data: departments
  };
}

async function getDepartmentById(id, ownerUserId) {
  const department = await departmentRepository.getDepartmentById(id, ownerUserId);

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    data: department
  };
}

async function createDepartment(departmentData, ownerUserId) {
  const validation = validateDepartmentInput(departmentData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentRepository.createDepartment(departmentData, ownerUserId);

  return {
    message: "Department created successfully.",
    data: department
  };
}

async function updateDepartment(id, departmentData, ownerUserId) {
  const validation = validateDepartmentInput(departmentData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingDepartment = await departmentRepository.getDepartmentById(id, ownerUserId);

  if (!existingDepartment) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  const department = await departmentRepository.updateDepartment(id, departmentData, ownerUserId);

  return {
    message: "Department updated successfully.",
    data: department
  };
}

async function deleteDepartment(id, ownerUserId) {
  const existingDepartment = await departmentRepository.getDepartmentById(id, ownerUserId);

  if (!existingDepartment) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  if (Number(existingDepartment.employeeCount) > 0) {
    const error = new Error("Departments with assigned employees cannot be deleted.");
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentRepository.deleteDepartment(id, ownerUserId);

  return {
    message: "Department deleted successfully.",
    data: department
  };
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};