import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    txType: {
      type: String,
      enum: ["PURCHASE", "SALE"],
      required: true,
    },
    txDate: { type: Date, default: Date.now },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
      },
    ],
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", productSchema);
