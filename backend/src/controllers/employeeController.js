const employeeService = require("../services/employeeService");

async function getAllEmployees(req, res) {
  try {
    const result = await employeeService.getAllEmployees(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve employees."
    });
  }
}

async function getEmployeeById(req, res) {
  try {
    const result = await employeeService.getEmployeeById(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve employee."
    });
  }
}

async function getEmployeesByDepartment(req, res) {
  try {
    const result = await employeeService.getEmployeesByDepartment(
      req.params.departmentId,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve employees by department."
    });
  }
}

async function searchEmployees(req, res) {
  try {
    const result = await employeeService.searchEmployees(req.query.query, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not search employees."
    });
  }
}

async function createEmployee(req, res) {
  try {
    const result = await employeeService.createEmployee(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not create employee."
    });
  }
}

async function updateEmployee(req, res) {
  try {
    const result = await employeeService.updateEmployee(req.params.id, req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not update employee."
    });
  }
}

async function deleteEmployee(req, res) {
  try {
    const result = await employeeService.deleteEmployee(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not delete employee."
    });
  }
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