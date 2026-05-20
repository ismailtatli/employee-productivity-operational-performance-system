const { getReadScopeUserId, getWriteScopeUserId } = require("../utils/accessScope");
const machineService = require("../services/machineService");

async function getAllMachines(req, res) {
  try {
    const result = await machineService.getAllMachines(getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve production machines."
    });
  }
}

async function getMachineById(req, res) {
  try {
    const result = await machineService.getMachineById(req.params.id, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve production machine."
    });
  }
}

async function createMachine(req, res) {
  try {
    const result = await machineService.createMachine(req.body, getWriteScopeUserId(req.user));
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not create production machine."
    });
  }
}

async function updateMachine(req, res) {
  try {
    const result = await machineService.updateMachine(req.params.id, req.body, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not update production machine."
    });
  }
}

async function deleteMachine(req, res) {
  try {
    const result = await machineService.deleteMachine(req.params.id, getReadScopeUserId(req.user));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not delete production machine."
    });
  }
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};