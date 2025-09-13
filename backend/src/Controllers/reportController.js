import { Product } from "../Schema/Product.js";

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stockQty", "$reorderLevel"] },
    });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getInventoryValue = async (req, res) => {
  try {
    const products = await Product.find();
    const totalValue = products.reduce(
      (sum, p) => sum + p.stockQty * p.avgCost,
      0
    );

    return res.status(200).json({ success: true, totalValue });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getProductsBySupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ supplierIds: id });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this supplier",
      });
    }

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID",
      error: error.message,
    });
  }
};
