"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    ticket_id: { type: String, required: true },
    userBuy_id: { type: String, required: true },
    userSell_id: { type: String, required: true },
    orderID: { type: String, required: true },
    price: { type: String, required: true },
    seat: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    isSold: { type: Boolean, required: true },
});
exports.order = (0, mongoose_1.model)("orders", orderSchema);
