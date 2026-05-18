const machineRepository = require("../repositories/machineRepository");
const departmentRepository = require("../repositories/departmentRepository");
const { validateMachine } = require("../validators/machineValidator");

async function getAllMachines(ownerUserId) {
  const machines = await machineRepository.getAllMachines(ownerUserId);

  return {
    data: machines
  };
}

async function getMachineById(id, ownerUserId) {
  const machine = await machineRepository.getMachineById(id, ownerUserId);

  if (!machine) {
    const error = new Error("Production machine not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    data: machine
  };
}

async function createMachine(machineData, ownerUserId) {
  const validation = validateMachine(machineData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentRepository.getDepartmentById(machineData.departmentId, ownerUserId);

  if (!department) {
    const error = new Error("Department not found for this user.");
    error.statusCode = 404;
    throw error;
  }

  const machine = await machineRepository.createMachine(machineData, ownerUserId);

  return {
    message: "Production machine created successfully.",
    data: machine
  };
}

async function updateMachine(id, machineData, ownerUserId) {
  const validation = validateMachine(machineData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingMachine = await machineRepository.getMachineById(id, ownerUserId);

  if (!existingMachine) {
    const error = new Error("Production machine not found.");
    error.statusCode = 404;
    throw error;
  }

  const department = await departmentRepository.getDepartmentById(machineData.departmentId, ownerUserId);

  if (!department) {
    const error = new Error("Department not found for this user.");
    error.statusCode = 404;
    throw error;
  }

  const machine = await machineRepository.updateMachine(id, machineData, ownerUserId);

  return {
    message: "Production machine updated successfully.",
    data: machine
  };
}

async function deleteMachine(id, ownerUserId) {
  const machine = await machineRepository.deleteMachine(id, ownerUserId);

  if (!machine) {
    const error = new Error("Production machine not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "Production machine deleted successfully.",
    data: machine
  };
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};