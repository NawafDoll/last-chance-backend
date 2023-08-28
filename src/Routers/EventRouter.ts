import express from "express";
import {
  deleteByDate,
  getEventByName,
  getEventByParams,
  getEvents,
  postEvent,
} from "../controllers/EventsController";

const routerEvent = express.Router();

routerEvent.post("/", postEvent);
routerEvent.get("/", getEvents);
routerEvent.get("/search", getEventByName);
routerEvent.get("/id/:_id", getEventByParams);
routerEvent.delete("/", deleteByDate);
routerEvent.get("/price", getEventByName);

export { routerEvent };
