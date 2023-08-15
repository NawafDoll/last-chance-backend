import { NextFunction, Request, Response } from "express";
import { user } from "../module/UsersModule";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import "dotenv/config";

export const register = async (req: Request, res: Response) => {
  try {
    const findUserByEmail = await user.findOne({ email: req.body.email });
    const findUserByPhone = await user.findOne({ phone: req.body.phone });
    if (findUserByEmail || findUserByPhone)
      return res
        .status(400)
        .json({ message: "هذا الحساب مسجل سابقا بالايميل او رقم الجوال" });
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const newUser = await user.create({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPass,
    });

    if (newUser) return res.status(200).json({ message: "Create Account" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const checkEmail = await user.findOne({ email: email });
    if (!checkEmail)
      return res.status(400).json({ message: "هذا الحساب غير مسجل" });
    const checkPassword = await bcrypt.compare(password, checkEmail.password);
    if (!checkPassword)
      return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
    const token = jwt.sign(
      {
        id: checkEmail._id,
        username: checkEmail.username,
        email: checkEmail.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .json({ message: `Welcome ${checkEmail.username}`, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUser = async (req: any, res: Response) => {
  const userId = req.id;
  let User;
  try {
    User = await user.findById(userId, "-password");
  } catch (err) {
    console.log(err);
  }
  if (!User) return res.status(400).json({ message: "المستخدم غير موجود" });
  return res.status(200).json({ User });
};

export const refreshToken = (req: any, res: Response, next: NextFunction) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies?.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: "can not find token" });
  }
  jwt.verify(String(prevToken), "secret", (err, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Auth faild" });
    }
    console.log(user.id);
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, "secret", {
      expiresIn: "1hr",
    });
    // console.log(token);
    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 1 ساعة
      httpOnly: true,
      sameSite: "lax",
      // secure: false, // يشترط HTTPS على الخادم
    });
    req.id = user.id;
    next();
  });
};

export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.json({ message: "Error cookies" });
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie Cleared" });
};

export const resetPass = async (req: Request, res: Response) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nawaf.taalat.gpt@gmail.com",
        pass: process.env.PASS_EMAIL,
      },
    });
    const email = req.body.email;
    const findUser = await user.findOne({ email: email });
    if (!findUser)
      return res.status(400).json({ message: "هذا الحساب غير موجود" });
    const secret = (process.env.JWT_SECRET as string) + findUser.password;
    const token = jwt.sign({ id: findUser.id, email: findUser.email }, secret, {
      expiresIn: "1d",
    });
    const link = `http://localhost:3000/user/editpass/${findUser.id}/${token}`;
    const mailOptions = {
      from: "",
      to: findUser.email,
      subject: "تحديث كلمة المرور",
      text: link,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({ message: "أفحص بريدك الالكتروني" });
      }
    });

    return res
      .status(200)
      .json({ resetPass: link, message: "أفحص بريدك الالكتروني" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const editPass = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.params;
    const password = req.body.password;
    const findUser = await user.findById({ _id: id });
    if (!findUser) {
      return res.status(400).json({ message: "There is wrong" });
    }
    const pass = await bcrypt.hash(password, 10);
    await user.findByIdAndUpdate(id, { password: pass });
    res.status(200).json({ message: "Changed Password" });
  } catch (err) {
    console.log(err);
  }
};
