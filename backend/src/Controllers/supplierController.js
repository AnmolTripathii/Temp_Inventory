import { Supplier } from "../Schema/Supplier.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Supplier name is required" });
    }

    const supplier = await Supplier.create({ name, email, phone });
    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    return res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID",
      error: error.message,
    });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
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

export const deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID",
      error: error.message,
    });
  }
};
