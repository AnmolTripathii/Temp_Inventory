import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    unit: { type: String, default: "pcs" },
    stockQty: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 10, min: 0 },
    avgCost: { type: Number, default: 0, min: 0 },
    supplierIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
