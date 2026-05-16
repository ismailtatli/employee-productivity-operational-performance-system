const machineRepository = require("../repositories/machineRepository");
const departmentRepository = require("../repositories/departmentRepository");
const { validateMachineInput } = require("../validators/machineValidator");

async function getAllMachines() {
  return machineRepository.getAllMachines();
}

async function getMachineById(id) {
  const machine = await machineRepository.getMachineById(id);

  if (!machine) {
    const error = new Error("Production machine not found.");
    error.statusCode = 404;
    throw error;
  }

  return machine;
}

async function createMachine(data) {
  const validation = validateMachineInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentRepository.getDepartmentById(data.departmentId);

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  return machineRepository.createMachine({
    ...data,
    departmentId: Number(data.departmentId),
    capacityPerShift: Number(data.capacityPerShift),
    status: data.status || "Active"
  });
}

async function updateMachine(id, data) {
  await getMachineById(id);

  const validation = validateMachineInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const department = await departmentRepository.getDepartmentById(data.departmentId);

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  return machineRepository.updateMachine(id, {
    ...data,
    departmentId: Number(data.departmentId),
    capacityPerShift: Number(data.capacityPerShift),
    status: data.status || "Active"
  });
}

async function deleteMachine(id) {
  await getMachineById(id);

  const deleted = await machineRepository.deleteMachine(id);

  if (!deleted) {
    const error = new Error("Production machine could not be deleted.");
    error.statusCode = 500;
    throw error;
  }

  return {
    message: "Production machine deleted successfully."
  };
}

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
};