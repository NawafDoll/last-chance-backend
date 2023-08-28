import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/DB";
import { userRouter } from "./Routers/UsersRouter";
import { routerEvent } from "./Routers/EventRouter";
import { routerTicket } from "./Routers/TicketRouter";
import { orderRouter } from "./Routers/OrderRouter";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: [
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
connectDB();

app.use("/user", userRouter);
app.use("/event", routerEvent);
app.use("/ticket", routerTicket);
app.use("/order", orderRouter);

app.listen(process.env.PORT, () => console.log("Server Running"));
