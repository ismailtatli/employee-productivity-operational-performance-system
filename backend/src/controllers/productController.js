const productService = require("../services/productService");

async function getAllProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      message: "Product created successfully.",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      message: "Product updated successfully.",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};