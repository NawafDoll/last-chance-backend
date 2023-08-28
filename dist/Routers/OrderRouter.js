"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const OrdersController_1 = require("../controllers/OrdersController");
const Protected_1 = require("../middleware/Protected");
const orderRouter = express_1.default.Router();
exports.orderRouter = orderRouter;
orderRouter.post("/createOrder/:ticket_id", Protected_1.protect, OrdersController_1.createOrder);
orderRouter.post("/captuerOrder/:ticket_id", Protected_1.protect, OrdersController_1.captureOrder);
orderRouter.get("/:userBuy_id", Protected_1.protect, OrdersController_1.getOrderById);
//************************************ */
orderRouter.get("/generate/token", Protected_1.protect, OrdersController_1.generateToken);
orderRouter.post("/payment/:ticket_id", Protected_1.protect, OrdersController_1.processPayment);
