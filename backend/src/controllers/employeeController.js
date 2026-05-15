const employeeService = require("../services/employeeService");

async function getAllEmployees(req, res, next) {
  try {
    const employees = await employeeService.getAllEmployees();

    res.status(200).json({
      data: employees
    });
  } catch (error) {
    next(error);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);

    res.status(200).json({
      data: employee
    });
  } catch (error) {
    next(error);
  }
}

async function searchEmployees(req, res, next) {
  try {
    const employees = await employeeService.searchEmployees(req.query.query);

    res.status(200).json({
      data: employees
    });
  } catch (error) {
    next(error);
  }
}

async function getEmployeesByDepartment(req, res, next) {
  try {
    const employees = await employeeService.getEmployeesByDepartment(req.params.departmentId);

    res.status(200).json({
      data: employees
    });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const employee = await employeeService.createEmployee(req.body);

    res.status(201).json({
      message: "Employee created successfully.",
      data: employee
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);

    res.status(200).json({
      message: "Employee updated successfully.",
      data: employee
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
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