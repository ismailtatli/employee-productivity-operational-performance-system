const departmentService = require("../services/departmentService");

async function getAllDepartments(req, res) {
  try {
    const result = await departmentService.getAllDepartments(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve departments."
    });
  }
}

async function getDepartmentById(req, res) {
  try {
    const result = await departmentService.getDepartmentById(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve department."
    });
  }
}

async function createDepartment(req, res) {
  try {
    const result = await departmentService.createDepartment(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not create department."
    });
  }
}

async function updateDepartment(req, res) {
  try {
    const result = await departmentService.updateDepartment(req.params.id, req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not update department."
    });
  }
}

async function deleteDepartment(req, res) {
  try {
    const result = await departmentService.deleteDepartment(req.params.id, req.user.id);
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