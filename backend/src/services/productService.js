const productRepository = require("../repositories/productRepository");
const { validateProductInput } = require("../validators/productValidator");

async function getAllProducts() {
  return productRepository.getAllProducts();
}

async function getProductById(id) {
  const product = await productRepository.getProductById(id);

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function createProduct(data) {
  const validation = validateProductInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  return productRepository.createProduct({
    ...data,
    targetPerShift: Number(data.targetPerShift),
    status: data.status || "Active"
  });
}

async function updateProduct(id, data) {
  await getProductById(id);

  const validation = validateProductInput(data);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  return productRepository.updateProduct(id, {
    ...data,
    targetPerShift: Number(data.targetPerShift),
    status: data.status || "Active"
  });
}

async function deleteProduct(id) {
  await getProductById(id);

  const deleted = await productRepository.deleteProduct(id);

  if (!deleted) {
    const error = new Error("Product could not be deleted.");
    error.statusCode = 500;
    throw error;
  }

  return {
    message: "Product deleted successfully."
  };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};