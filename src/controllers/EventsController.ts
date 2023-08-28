import { Request, Response } from "express";
import { event } from "../module/EventsModule";

export const postEvent = async (req: Request, res: Response) => {
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
    const addEvent = await event.create({
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
  } catch (err) {
    console.log(err);
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const showEvents = await event.find();
    if (showEvents) return res.status(200).json(showEvents);
  } catch (err) {
    console.log(err);
  }
};

export const getEventByName = async (req: Request, res: Response) => {
  try {
    const nameEvent = req.query.nameEvent;
    const searchName = await event.find({ nameEvent: nameEvent });
    const allEvents = await event.find();
    if (nameEvent === undefined || nameEvent === "all" || nameEvent === "") {
      return res.status(200).json(allEvents);
    } else {
      return res.status(200).json(searchName);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getEventByParams = async (req: Request, res: Response) => {
  try {
    const id = req.params._id;
    const eventById = await event.findById(id);

    if (eventById) return res.status(200).json(eventById);
  } catch (err) {
    console.log(err);
  }
};

export const getEventByEventId = async (req: Request, res: Response) => {
  try {
    const id = req.params._id;
    const eventById = await event.findById(id);
    if (eventById) return res.status(200).json(eventById);
  } catch (err) {
    console.log(err);
  }
};

export const getEventPrice = async (req: Request, res: Response) => {
  try {
    const getPrice = await event.findOne({
      descEvent: req.body.dataDesc,
    });
    function dataDesc(data: any, category: any) {
      // return data.filter( (o:any) => {
      data.find((player: any) => {
        player.category == category;
        // });
      });
      let found = dataDesc(getPrice?.descEvent, "Gold");
      console.log(found);
    }
    if (getPrice) return res.status(200).json(getPrice);
  } catch (err) {
    console.log(err);
  }
};

export const deleteByDate = async (req: Request, res: Response) => {
  try {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    const timeEvent = `${hours}:${minutes}`;
    const dateEvent = new Date().toISOString().split("T")[0];
    const del = await event.findOneAndDelete({ date: dateEvent });
    if (del && timeEvent === del.time) {
      return res.status(200).json("Event Delete");
    } else {
      return res.status(200).json(dateEvent);
    }
  } catch (err) {
    console.log(err);
  }
};
