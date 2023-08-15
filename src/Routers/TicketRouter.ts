import express from "express";
import {
  getTicketUserId,
  infoTicket,
  postTicket,
  getTicket,
  purchaseTicket,
  getTicketByIdUser,
} from "../controllers/TicketController";
import validate from "../middleware/Validate";
import { postTicketZodSchema } from "../ZodSchema/TicketSchema";
import { upload } from "../middleware/upload";
import { protect } from "../middleware/Protected";

const routerTicket = express.Router();

routerTicket.post(
  "/",
  protect,
  upload.single("image"),

  validate(postTicketZodSchema),

  postTicket
);
routerTicket.get("/allticket/:event_id", getTicket);
routerTicket.get("/:event_id", protect, getTicketUserId);
routerTicket.get("/ticketinfo/:_id", protect, infoTicket);
routerTicket.get("/user/:user_id", protect, getTicketByIdUser);
routerTicket.put("/purchase/:_id", purchaseTicket);

export { routerTicket };
