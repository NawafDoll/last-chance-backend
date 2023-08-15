import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema({
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

export const order = model("orders", orderSchema);
