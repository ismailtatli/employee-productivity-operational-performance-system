const { getReadScopeUserId, getWriteScopeUserId } = require("../utils/accessScope");
const employeeService = require("../services/employeeService");

async function getAllEmployees(req, res) {
  try {
    const result = await employeeService.getAllEmployees(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not retrieve employees." });
  }
}

async function getEmployeeById(req, res) {
  try {
    const result = await employeeService.getEmployeeById(req.params.id, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not retrieve employee." });
  }
}

async function getEmployeesByDepartment(req, res) {
  try {
    const result = await employeeService.getEmployeesByDepartment(req.params.departmentId, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not retrieve employees by department." });
  }
}

async function searchEmployees(req, res) {
  try {
    const result = await employeeService.searchEmployees(req.query.query, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not search employees." });
  }
}

async function createEmployee(req, res) {
  try {
    const result = await employeeService.createEmployee(req.body, getWriteScopeUserId(req.user));
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not create employee." });
  }
}

async function updateEmployee(req, res) {
  try {
    const result = await employeeService.updateEmployee(req.params.id, req.body, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not update employee." });
  }
}

async function deleteEmployee(req, res) {
  try {
    const result = await employeeService.deleteEmployee(req.params.id, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Could not delete employee." });
  }
}

module.exports = { getAllEmployees, getEmployeeById, getEmployeesByDepartment, searchEmployees, createEmployee, updateEmployee, deleteEmployee };
