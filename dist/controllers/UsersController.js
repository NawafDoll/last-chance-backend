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
exports.editPass = exports.resetPass = exports.logout = exports.refreshToken = exports.getUser = exports.login = exports.register = void 0;
const UsersModule_1 = require("../module/UsersModule");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUserByEmail = yield UsersModule_1.user.findOne({ email: req.body.email });
        const findUserByPhone = yield UsersModule_1.user.findOne({ phone: req.body.phone });
        if (findUserByEmail || findUserByPhone)
            return res
                .status(400)
                .json({ message: "هذا الحساب مسجل سابقا بالايميل او رقم الجوال" });
        const hashPass = yield bcrypt_1.default.hash(req.body.password, 10);
        const newUser = yield UsersModule_1.user.create({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: hashPass,
        });
        if (newUser)
            return res.status(200).json({ message: "Create Account" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const checkEmail = yield UsersModule_1.user.findOne({ email: email });
        if (!checkEmail)
            return res.status(400).json({ message: "هذا الحساب غير مسجل" });
        const checkPassword = yield bcrypt_1.default.compare(password, checkEmail.password);
        if (!checkPassword)
            return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
        if (checkEmail.isAdmin === true) {
            const token = jsonwebtoken_1.default.sign({
                id: checkEmail._id,
                username: checkEmail.username,
                email: checkEmail.email,
                isAdmin: checkEmail.isAdmin,
            }, process.env.JWT_SECRET, { expiresIn: "1d" });
            console.log("you are Admin");
            return res
                .status(200)
                .json({ message: `Welcome ${checkEmail.username}`, token });
        }
        const token = jsonwebtoken_1.default.sign({
            id: checkEmail._id,
            username: checkEmail.username,
            email: checkEmail.email,
        }, process.env.JWT_SECRET, { expiresIn: "3d" });
        return res
            .status(200)
            .json({ message: `Welcome ${checkEmail.username}`, token });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id;
    let User;
    try {
        User = yield UsersModule_1.user.findById(userId, "-password");
    }
    catch (err) {
        console.log(err);
    }
    if (!User)
        return res.status(400).json({ message: "المستخدم غير موجود" });
    return res.status(200).json({ User });
});
exports.getUser = getUser;
const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies === null || cookies === void 0 ? void 0 : cookies.split("=")[1];
    if (!prevToken) {
        return res.status(400).json({ message: "can not find token" });
    }
    jsonwebtoken_1.default.verify(String(prevToken), "secret", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Auth faild" });
        }
        console.log(user.id);
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";
        const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret", {
            expiresIn: "1hr",
        });
        // console.log(token);
        res.cookie(String(user.id), token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: "lax",
            // secure: false, // يشترط HTTPS على الخادم
        });
        req.id = user.id;
        next();
    });
};
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt)
        return res.json({ message: "Error cookies" });
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ message: "Cookie Cleared" });
};
exports.logout = logout;
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "nawaf.taalat.gpt@gmail.com",
                pass: process.env.PASS_EMAIL,
            },
        });
        const email = req.body.email;
        const findUser = yield UsersModule_1.user.findOne({ email: email });
        if (!findUser)
            return res.status(400).json({ message: "هذا الحساب غير موجود" });
        const secret = process.env.JWT_SECRET + findUser.password;
        const token = jsonwebtoken_1.default.sign({ id: findUser.id, email: findUser.email }, secret, {
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
            }
            else {
                return res.status(200).json({ message: "أفحص بريدك الالكتروني" });
            }
        });
        return res
            .status(200)
            .json({ resetPass: link, message: "أفحص بريدك الالكتروني" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.resetPass = resetPass;
const editPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.params;
        const password = req.body.password;
        const findUser = yield UsersModule_1.user.findById({ _id: id });
        if (!findUser) {
            return res.status(400).json({ message: "There is wrong" });
        }
        const pass = yield bcrypt_1.default.hash(password, 10);
        yield UsersModule_1.user.findByIdAndUpdate(id, { password: pass });
        res.status(200).json({ message: "Changed Password" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.editPass = editPass;
