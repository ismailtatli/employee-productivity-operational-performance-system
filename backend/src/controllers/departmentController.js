const { getReadScopeUserId, getWriteScopeUserId } = require("../utils/accessScope");
const departmentService = require("../services/departmentService");

async function getAllDepartments(req, res) {
  try {
    const result = await departmentService.getAllDepartments(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve departments."
    });
  }
}

async function getDepartmentById(req, res) {
  try {
    const result = await departmentService.getDepartmentById(req.params.id, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve department."
    });
  }
}

async function createDepartment(req, res) {
  try {
    const result = await departmentService.createDepartment(req.body, getWriteScopeUserId(req.user));
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not create department."
    });
  }
}

async function updateDepartment(req, res) {
  try {
    const result = await departmentService.updateDepartment(req.params.id, req.body, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not update department."
    });
  }
}

async function deleteDepartment(req, res) {
  try {
    const result = await departmentService.deleteDepartment(req.params.id, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not delete department."
    });
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};