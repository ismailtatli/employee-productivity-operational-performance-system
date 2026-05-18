const productionRecordService = require("../services/productionRecordService");

async function getAllProductionRecords(req, res) {
  try {
    const result = await productionRecordService.getAllProductionRecords(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve production records."
    });
  }
}

async function getProductionRecordById(req, res) {
  try {
    const result = await productionRecordService.getProductionRecordById(
      req.params.id,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve production record."
    });
  }
}

async function getProductionRecordsByEmployee(req, res) {
  try {
    const result = await productionRecordService.getProductionRecordsByEmployee(
      req.params.employeeId,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve employee production records."
    });
  }
}

async function createProductionRecord(req, res) {
  try {
    const result = await productionRecordService.createProductionRecord(
      req.body,
      req.user.id
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not create production record."
    });
  }
}

async function updateProductionRecord(req, res) {
  try {
    const result = await productionRecordService.updateProductionRecord(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not update production record."
    });
  }
}

async function deleteProductionRecord(req, res) {
  try {
    const result = await productionRecordService.deleteProductionRecord(
      req.params.id,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not delete production record."
    });
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