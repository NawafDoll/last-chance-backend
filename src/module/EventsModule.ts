import mongoose, { Schema, model } from "mongoose";

const eventSchema = new Schema({
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

export const event = model("events", eventSchema);
