"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticket = void 0;
const mongoose_1 = require("mongoose");
const ticketSchema = new mongoose_1.Schema({
    event_id: { type: String, required: true },
    user_id: { type: String, required: true },
    // number: { type: String, required: true },
    price: { type: String, required: true },
    seat: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    isSold: { type: Boolean, default: false },
});
exports.ticket = (0, mongoose_1.model)("tickets", ticketSchema);
