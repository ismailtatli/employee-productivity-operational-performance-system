const machineService = require("../services/machineService");

async function getAllMachines(req, res, next) {
  try {
    const machines = await machineService.getAllMachines();
    res.status(200).json({ data: machines });
  } catch (error) {
    next(error);
  }
}

async function getMachineById(req, res, next) {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    res.status(200).json({ data: machine });
  } catch (error) {
    next(error);
  }
}

async function createMachine(req, res, next) {
  try {
    const machine = await machineService.createMachine(req.body);
    res.status(201).json({
      message: "Production machine created successfully.",
      data: machine
    });
  } catch (error) {
    next(error);
  }
}

async function updateMachine(req, res, next) {
  try {
    const machine = await machineService.updateMachine(req.params.id, req.body);
    res.status(200).json({
      message: "Production machine updated successfully.",
      data: machine
    });
  } catch (error) {
    next(error);
  }
}

async function deleteMachine(req, res, next) {
  try {
    const result = await machineService.deleteMachine(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};