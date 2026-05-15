const productionRecordService = require("../services/productionRecordService");

async function getAllProductionRecords(req, res, next) {
  try {
    const records = await productionRecordService.getAllProductionRecords();

    res.status(200).json({
      data: records
    });
  } catch (error) {
    next(error);
  }
}

async function getProductionRecordById(req, res, next) {
  try {
    const record = await productionRecordService.getProductionRecordById(req.params.id);

    res.status(200).json({
      data: record
    });
  } catch (error) {
    next(error);
  }
}

async function getProductionRecordsByEmployee(req, res, next) {
  try {
    const records = await productionRecordService.getProductionRecordsByEmployee(req.params.employeeId);

    res.status(200).json({
      data: records
    });
  } catch (error) {
    next(error);
  }
}

async function createProductionRecord(req, res, next) {
  try {
    const record = await productionRecordService.createProductionRecord(req.body);

    res.status(201).json({
      message: "Production record created successfully.",
      data: record
    });
  } catch (error) {
    next(error);
  }
}

async function updateProductionRecord(req, res, next) {
  try {
    const record = await productionRecordService.updateProductionRecord(req.params.id, req.body);

    res.status(200).json({
      message: "Production record updated successfully.",
      data: record
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProductionRecord(req, res, next) {
  try {
    const result = await productionRecordService.deleteProductionRecord(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProductionRecords,
  getProductionRecordById,
  getProductionRecordsByEmployee,
  createProductionRecord,
  updateProductionRecord,
  deleteProductionRecord
};