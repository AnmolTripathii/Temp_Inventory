import { Transaction } from "../Schema/Transaction.js";
import { Product } from "../Schema/Product.js";

export const getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find()
      .populate("items.productId", "name sku")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: txs });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { txType, items, note } = req.body;

    if (!txType || !["PURCHASE", "SALE"].includes(txType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction type" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one item is required" });
    }

    for (const item of items) {
      const { productId, quantity, unitPrice } = item;

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found: ${productId}` });
      }

      if (txType === "PURCHASE") {
        const totalValue =
          product.avgCost * product.stockQty + unitPrice * quantity;
        const newQty = product.stockQty + quantity;
        product.avgCost = newQty > 0 ? totalValue / newQty : unitPrice;
        product.stockQty = newQty;
      } else if (txType === "SALE") {
        if (product.stockQty < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stockQty}, Requested: ${quantity}`,
          });
        }
        product.stockQty -= quantity;
      }

      await product.save();
    }

    const tx = await Transaction.create({ txType, items, note });
    return res
      .status(201)
      .json({ success: true, message: "Transaction recorded", data: tx });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
