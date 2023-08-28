"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.processPayment = exports.generateToken = exports.getOrderById = exports.captureOrder = exports.createOrder = void 0;
const OrdersModule_1 = require("../module/OrdersModule");
const paypal = __importStar(require("../Paypal-api"));
const TicketModule_1 = require("../module/TicketModule");
const nodemailer_1 = __importDefault(require("nodemailer"));
const UsersModule_1 = require("../module/UsersModule");
const path_1 = __importDefault(require("path"));
const braintree_1 = __importDefault(require("braintree"));
require("dotenv/config");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket_id = req.params.ticket_id;
        const priceTicket = yield TicketModule_1.ticket.find({ _id: ticket_id });
        if (priceTicket[0].isSold === true) {
            return res
                .status(400)
                .json({ message: "هذه التذكرة تم بيعها ولم تعد متوفرة" });
        }
        const order = yield paypal.createOrder(priceTicket);
        res.json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});
exports.createOrder = createOrder;
const captureOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "nawaf.taalat.gpt@gmail.com",
                pass: process.env.PASS_EMAIL,
            },
        });
        const { orderID } = req.body;
        const ticket_id = req.params.ticket_id;
        const imageTicket = yield TicketModule_1.ticket.findOne({ _id: ticket_id });
        if (imageTicket.isSold === true) {
            return res
                .status(400)
                .json({ message: "هذه التذكرة تم بيعها ولم تعد متوفرة" });
        }
        const captureData = yield paypal.capturePayment(orderID);
        const newOrder = yield OrdersModule_1.order.create({
            orderID: req.body.orderID,
            userBuy_id: req.body.userBuy_id,
            userSell_id: imageTicket.user_id,
            ticket_id: imageTicket._id,
            price: imageTicket.price,
            seat: imageTicket.seat,
            image: imageTicket.image,
            category: imageTicket.category,
            isSold: true,
        });
        const findUser = yield UsersModule_1.user.findOne({
            _id: imageTicket.user_id,
        });
        const mailOptions = {
            from: "Last Chance",
            to: findUser.email,
            subject: "صورة التذكرة",
            html: `
      <P>مرحبا</p>
      <img src="cid:ticketImage" alt="تذكرة الدعم الفني" >
      `,
            attachments: [
                {
                    filename: `${imageTicket.image}`,
                    path: path_1.default.join(__dirname, `../../${imageTicket.image}`),
                    cid: "ticketImage", // معرف الصورة في نص HTML
                },
            ],
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }
            else {
                return res.status(200).json({
                    message: "أفحص بريدك الالكتروني",
                    newOrder: newOrder,
                    capture: captureData,
                });
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});
exports.captureOrder = captureOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userBuy_id = req.params.userBuy_id;
        const orders = yield OrdersModule_1.order.find({ userBuy_id: userBuy_id });
        if (orders)
            return res.status(200).json(orders);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("Server Error");
    }
});
exports.getOrderById = getOrderById;
const gateway = new braintree_1.default.BraintreeGateway({
    environment: braintree_1.default.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
});
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    gateway.clientToken
        .generate({})
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((err) => {
        res.status(500).send(err);
    });
});
exports.generateToken = generateToken;
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nonceFromTheClient = req.body.payment_method_nonce;
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "nawaf.taalat.gpt@gmail.com",
            pass: process.env.PASS_EMAIL,
        },
    });
    const ticket_id = req.params.ticket_id;
    const findTicket = yield TicketModule_1.ticket.findOne({ _id: ticket_id });
    if (findTicket.isSold === true) {
        return res
            .status(400)
            .json({ message: "هذه التذكرة تم بيعها ولم تعد متوفرة" });
    }
    yield OrdersModule_1.order.create({
        orderID: req.body.orderID,
        userBuy_id: req.body.userBuy_id,
        userSell_id: findTicket.user_id,
        ticket_id: findTicket._id,
        price: findTicket.price,
        seat: findTicket.seat,
        image: findTicket.image,
        category: findTicket.category,
        isSold: true,
    });
    gateway.transaction
        .sale({
        amount: findTicket.price,
        paymentMethodNonce: nonceFromTheClient,
        // deviceData: deviceDataFromTheClient,
        options: {
            submitForSettlement: true,
        },
    })
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const findUser = yield UsersModule_1.user.findOne({
            _id: req.body.userBuy_id,
        });
        const mailOptions = {
            from: "Last Chance",
            to: findUser.email,
            subject: "صورة التذكرة",
            html: `
      <P>مرحبا</p>
      <img src="cid:ticketImage" alt="تذكرة الفعالية" width="200px" hieght="200px">
      `,
            attachments: [
                {
                    filename: `${findTicket.image}`,
                    path: path_1.default.join(__dirname, `../../${findTicket.image}`),
                    cid: "ticketImage", // معرف الصورة في نص HTML
                },
            ],
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }
            else {
                return res.status(200).send(response);
            }
        });
    }))
        .catch((err) => res.status(500).send(err));
});
exports.processPayment = processPayment;
