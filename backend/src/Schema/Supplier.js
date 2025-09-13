import e from "express";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);
export const Supplier = mongoose.model("Supplier", productSchema);
