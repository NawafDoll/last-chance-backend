"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseTicket = exports.getTicketByIdUser = exports.infoTicket = exports.getTicket = exports.getTicketUserId = exports.postTicket = void 0;
const TicketModule_1 = require("../module/TicketModule");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import fs from "fs";
// fs.readFile("uploads\\1685758924705.pdf", "utf8", (err, data) => {
//   console.log(data);
// });
// interface JwtPayload{
//   id:string
// }
const postTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        let token = req.headers.authorization;
        token = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        const event_id = req.body.event_id;
        const findTicket = yield TicketModule_1.ticket.findOne({
            event_id: event_id,
            seat: req.body.seat,
            category: req.body.category,
        });
        if (findTicket)
            return res.status(400).json({ message: "التذكرة موجودة بالفعل" });
        const addTicket = yield TicketModule_1.ticket.create({
            user_id: user.id,
            event_id: req.body.event_id,
            number: req.body.number,
            price: req.body.price,
            seat: req.body.seat,
            image: file === null || file === void 0 ? void 0 : file.path,
            category: req.body.category,
        });
        if (!addTicket)
            return res.status(400).json({ message: "" });
        return res.status(200).json("Add Ticket");
    }
    catch (err) {
        console.log(err);
    }
});
exports.postTicket = postTicket;
const getTicketUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers.authorization;
        token = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        const user = jsonwebtoken_1.default.decode(token);
        const event_id = req.params.event_id;
        const ticketByID = (yield TicketModule_1.ticket.find({ event_id: event_id }, "-image"))
            .filter((e) => e.isSold === false)
            .filter((e) => e.user_id !== user.id);
        if (token)
            return res.status(200).json(ticketByID);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getTicketUserId = getTicketUserId;
const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event_id = req.params.event_id;
        const allTicket = yield TicketModule_1.ticket.find({ event_id: event_id }, "-image");
        if (allTicket)
            return res.status(200).json(allTicket);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
});
exports.getTicket = getTicket;
const infoTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params._id;
        const ticketByID = yield TicketModule_1.ticket.findById(_id, "-image");
        if (ticketByID)
            return res.status(200).json(ticketByID);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.infoTicket = infoTicket;
const getTicketByIdUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.user_id;
        const myTicket = yield TicketModule_1.ticket.find({ user_id: user_id });
        if (myTicket)
            return res.status(200).json(myTicket);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("server Error");
    }
});
exports.getTicketByIdUser = getTicketByIdUser;
const purchaseTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticketId = req.params._id;
        const foundTicket = yield TicketModule_1.ticket.findByIdAndUpdate(ticketId, {
            isSold: true,
        });
        if (!foundTicket) {
            return res.status(404).json({ message: "التذكرة غير موجودة" });
        }
        return res.json("تم تحديث التذكرة بنجاح");
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("Server Error");
    }
});
exports.purchaseTicket = purchaseTicket;
