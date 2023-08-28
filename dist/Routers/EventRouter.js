"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerEvent = void 0;
const express_1 = __importDefault(require("express"));
const EventsController_1 = require("../controllers/EventsController");
const routerEvent = express_1.default.Router();
exports.routerEvent = routerEvent;
routerEvent.post("/", EventsController_1.postEvent);
routerEvent.get("/", EventsController_1.getEvents);
routerEvent.get("/search", EventsController_1.getEventByName);
routerEvent.get("/id/:_id", EventsController_1.getEventByParams);
routerEvent.delete("/", EventsController_1.deleteByDate);
routerEvent.get("/price", EventsController_1.getEventByName);
