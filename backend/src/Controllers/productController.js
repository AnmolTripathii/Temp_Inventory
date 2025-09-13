import { Product } from "../Schema/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { sku: new RegExp(search, "i") },
          ],
        }
      : {};

    const products = await Product.find(query).populate(
      "supplierIds",
      "name email"
    );
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, unit, stockQty, reorderLevel, avgCost, supplierIds } =
      req.body;

    if (!name || !sku) {
      return res
        .status(400)
        .json({ success: false, message: "Name and SKU are required" });
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "SKU already exists" });
    }

    const product = await Product.create({
      name,
      sku,
      unit,
      stockQty,
      reorderLevel,
      avgCost,
      supplierIds,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "supplierIds",
      "name email"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
      error: error.message,
    });
  }
};
