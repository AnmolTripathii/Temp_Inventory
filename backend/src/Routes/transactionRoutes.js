import { Router } from "express";
import {
  getTransactions,
  createTransaction,
} from "../Controllers/transactionController.js";

const router = Router();

router.get("/", getTransactions);
router.post("/", createTransaction);

export default router;
