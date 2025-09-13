import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./Routes/productRoutes.js";
import supplierRoutes from "./Routes/supplierRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";
import reportRoutes from "./Routes/reportsRoutes.js";
import recommendationAiRoutes from "./Routes/recommendationAi.js";

// Load environment variables
dotenv.config({
  path: "./.env",
});

// Debug environment variables
console.log("🔍 Environment check:");
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing"
);
console.log("DB_NAME:", process.env.DB_NAME || "Using default");
console.log("PORT:", process.env.PORT || "Using default");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/recommendation", recommendationAiRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
