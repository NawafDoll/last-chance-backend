"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const DB_1 = require("./config/DB");
const UsersRouter_1 = require("./Routers/UsersRouter");
const EventRouter_1 = require("./Routers/EventRouter");
const TicketRouter_1 = require("./Routers/TicketRouter");
const OrderRouter_1 = require("./Routers/OrderRouter");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: [
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
(0, DB_1.connectDB)();
app.use("/user", UsersRouter_1.userRouter);
app.use("/event", EventRouter_1.routerEvent);
app.use("/ticket", TicketRouter_1.routerTicket);
app.use("/order", OrderRouter_1.orderRouter);
app.listen(process.env.PORT, () => console.log("Server Running"));
