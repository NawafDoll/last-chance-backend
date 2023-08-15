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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteByDate = exports.getEventPrice = exports.getEventByParams = exports.getEventByName = exports.getEvents = exports.postEvent = void 0;
const EventsModule_1 = require("../module/EventsModule");
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let arr = [];
        let descObj = {};
        for (let i = 0; i < Object.keys(req.body.descEvent).length; i++) {
            descObj = {
                price: req.body.descEvent[i].price,
                category: req.body.descEvent[i].category,
            };
            arr.push(descObj);
        }
        const addEvent = yield EventsModule_1.event.create({
            nameEvent: req.body.nameEvent,
            image: req.body.image,
            date: req.body.date,
            time: req.body.time,
            placeEvent: req.body.placeEvent,
            imageSeats: req.body.imageSeats,
            num: req.body.num,
            descEvent: arr,
        });
        if (addEvent)
            return res.status(200).json({ message: "تمت اضافة الفعالية" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.postEvent = postEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showEvents = yield EventsModule_1.event.find();
        if (showEvents)
            return res.status(200).json(showEvents);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getEvents = getEvents;
const getEventByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nameEvent = req.query.nameEvent;
        const searchName = yield EventsModule_1.event.find({ nameEvent: nameEvent });
        const allEvents = yield EventsModule_1.event.find();
        if (nameEvent === undefined || nameEvent === "all" || nameEvent === "") {
            return res.status(200).json(allEvents);
        }
        else {
            return res.status(200).json(searchName);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getEventByName = getEventByName;
const getEventByParams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const eventById = yield EventsModule_1.event.findById(id);
        if (eventById)
            return res.status(200).json(eventById);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getEventByParams = getEventByParams;
const getEventPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPrice = yield EventsModule_1.event.findOne({
            descEvent: req.body.dataDesc,
        });
        function dataDesc(data, category) {
            // return data.filter( (o:any) => {
            data.find((player) => {
                player.category == category;
                // });
            });
            let found = dataDesc(getPrice === null || getPrice === void 0 ? void 0 : getPrice.descEvent, "Gold");
            console.log(found);
        }
        if (getPrice)
            return res.status(200).json(getPrice);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getEventPrice = getEventPrice;
const deleteByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date_ob = new Date();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        const timeEvent = `${hours}:${minutes}`;
        const dateEvent = new Date().toISOString().split("T")[0];
        const del = yield EventsModule_1.event.findOneAndDelete({ date: dateEvent });
        if (del && timeEvent === del.time) {
            return res.status(200).json("Event Delete");
        }
        else {
            return res.status(200).json(dateEvent);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteByDate = deleteByDate;
