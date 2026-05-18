const productService = require("../services/productService");

async function getAllProducts(req, res) {
  try {
    const result = await productService.getAllProducts(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve products."
    });
  }
}

async function getProductById(req, res) {
  try {
    const result = await productService.getProductById(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not retrieve product."
    });
  }
}

async function createProduct(req, res) {
  try {
    const result = await productService.createProduct(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not create product."
    });
  }
}

async function updateProduct(req, res) {
  try {
    const result = await productService.updateProduct(req.params.id, req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not update product."
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const result = await productService.deleteProduct(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Could not delete product."
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};