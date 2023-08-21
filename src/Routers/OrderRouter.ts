import express from "express";
import {
  captureOrder,
  createOrder,
  generateToken,
  getOrderById,
  processPayment,
} from "../controllers/OrdersController";
import { protect } from "../middleware/Protected";

const orderRouter = express.Router();

orderRouter.post("/createOrder/:ticket_id", protect, createOrder);
orderRouter.post("/captuerOrder/:ticket_id", protect, captureOrder);
orderRouter.get("/:userBuy_id", protect, getOrderById);

//************************************ */
orderRouter.get("/generate/token", protect, generateToken);
orderRouter.post("/payment/:ticket_id", protect, processPayment);
export { orderRouter };
