const departmentService = require("../services/departmentService");

async function getAllDepartments(req, res, next) {
  try {
    const departments = await departmentService.getAllDepartments();

    res.status(200).json({
      data: departments
    });
  } catch (error) {
    next(error);
  }
}

async function getDepartmentById(req, res, next) {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    res.status(200).json({
      data: department
    });
  } catch (error) {
    next(error);
  }
}

async function createDepartment(req, res, next) {
  try {
    const department = await departmentService.createDepartment(req.body);

    res.status(201).json({
      message: "Department created successfully.",
      data: department
    });
  } catch (error) {
    next(error);
  }
}

async function updateDepartment(req, res, next) {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);

    res.status(200).json({
      message: "Department updated successfully.",
      data: department
    });
  } catch (error) {
    next(error);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const result = await departmentService.deleteDepartment(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};