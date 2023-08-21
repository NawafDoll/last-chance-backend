import mongoose, { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    event_id: { type: String, required: true },
    user_id: { type: String, required: true },
    // number: { type: String, required: true },
    price: { type: String, required: true },
    seat: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events", // اسم مودل الفعالية
    },
    isSold: { type: Boolean, default: false },
    isMatch: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ticket = model("tickets", ticketSchema);
