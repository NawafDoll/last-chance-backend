import { Request, Response } from "express";
import { ticket } from "../module/TicketModule";
import jwt, { JwtPayload } from "jsonwebtoken";
// import fs from "fs";

// fs.readFile("uploads\\1685758924705.pdf", "utf8", (err, data) => {
//   console.log(data);
// });
// interface JwtPayload{
//   id:string
// }
export const postTicket = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    let token: any = req.headers.authorization;
    token = token?.split(" ")[1];
    const user = jwt.decode(token) as JwtPayload;
    const event_id = req.body.event_id;
    const findTicket = await ticket.findOne({
      event_id: event_id,
      seat: req.body.seat,
      category: req.body.category,
    });

    if (findTicket)
      return res.status(400).json({ message: "التذكرة موجودة بالفعل" });

    const addTicket = await ticket.create({
      user_id: user.id,
      event_id: req.body.event_id,
      number: req.body.number,
      price: req.body.price,
      seat: req.body.seat,
      image: file?.path,
      category: req.body.category,
    });

    if (!addTicket) return res.status(400).json({ message: "" });
    return res.status(200).json("Add Ticket");
  } catch (err) {
    console.log(err);
  }
};

export const getTicketUserId = async (req: Request, res: Response) => {
  try {
    let token: any = req.headers.authorization;
    token = token?.split(" ")[1];
    const user = jwt.decode(token) as JwtPayload;

    const event_id = req.params.event_id;
    const ticketByID = (await ticket.find({ event_id: event_id }, "-image"))
      .filter((e) => e.isSold === false)
      .filter((e) => e.user_id !== user.id);

    if (token) return res.status(200).json(ticketByID);
  } catch (err) {
    console.log(err);
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    const event_id = req.params.event_id;
    const allTicket = await ticket.find({ event_id: event_id }, "-image");
    if (allTicket) return res.status(200).json(allTicket);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};

export const infoTicket = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;
    const ticketByID = await ticket.findById(_id, "-image");

    if (ticketByID) return res.status(200).json(ticketByID);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTicketByIdUser = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id;
    const myTicket = await ticket.find({ user_id: user_id });
    if (myTicket) return res.status(200).json(myTicket);
  } catch (err) {
    console.log(err);
    return res.status(500).json("server Error");
  }
};

export const purchaseTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params._id;
    const foundTicket = await ticket.findByIdAndUpdate(ticketId, {
      isSold: true,
    });

    if (!foundTicket) {
      return res.status(404).json({ message: "التذكرة غير موجودة" });
    }
    return res.json("تم تحديث التذكرة بنجاح");
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server Error");
  }
};
