import { Response, NextFunction, Request } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;

    if (token) {
      token = token.split(" ")[1];
      const user: any = jwt.verify(token, process.env.JWT_SECRET as string);

      res.locals.user = user;
      // req.id = user.id;

      //   console.log(req.id);
      next();
    } else {
      return res.status(400).json({ message: "you are Not auth" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const protectAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      const user: any = jwt.verify(token, process.env.JWT_SECRET as string);
      res.locals.user = user;
      if (user.isAdmin === true) {
        next();
      } else {
        return res.status(400).json({ message: "you are Not Admin" });
      }
    } else {
      return res.status(400).json({ message: "you are Not auth" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
