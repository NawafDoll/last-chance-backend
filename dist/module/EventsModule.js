"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    nameEvent: { type: String, required: true },
    image: { type: String, required: true },
    num: { type: Number },
    // category: [String],
    date: { type: String, required: true },
    time: { type: String, required: true },
    placeEvent: { type: String, required: true },
    imageSeats: { type: String, required: false },
    descEvent: [
        {
            price: { type: String, required: true },
            category: { type: String, required: true },
        },
    ],
});
exports.event = (0, mongoose_1.model)("events", eventSchema);
