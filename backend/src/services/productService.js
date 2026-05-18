const productRepository = require("../repositories/productRepository");
const { validateProductInput } = require("../validators/productValidator");

async function getAllProducts(ownerUserId) {
  const products = await productRepository.getAllProducts(ownerUserId);

  return {
    data: products
  };
}

async function getProductById(id, ownerUserId) {
  const product = await productRepository.getProductById(id, ownerUserId);

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    data: product
  };
}

async function createProduct(productData, ownerUserId) {
  const validation = validateProductInput(productData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.createProduct(productData, ownerUserId);

  return {
    message: "Product created successfully.",
    data: product
  };
}

async function updateProduct(id, productData, ownerUserId) {
  const validation = validateProductInput(productData);

  if (!validation.isValid) {
    const error = new Error(validation.errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await productRepository.getProductById(id, ownerUserId);

  if (!existingProduct) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  const product = await productRepository.updateProduct(id, productData, ownerUserId);

  return {
    message: "Product updated successfully.",
    data: product
  };
}

async function deleteProduct(id, ownerUserId) {
  const product = await productRepository.deleteProduct(id, ownerUserId);

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "Product deleted successfully.",
    data: product
  };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};