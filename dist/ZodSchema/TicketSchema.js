"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTicketZodSchema = void 0;
const zod_1 = require("zod");
exports.postTicketZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        // number: z
        //   .string({ required_error: "الرجاء أدخل عدد التذاكر" })
        //   .min(1, "الحد الادنى تذكرة 1")
        //   .max(1, "الحد الاقصى 9 تذاكر")
        //   .regex(new RegExp(".*\\d.*"), "الرجاء أدخل عدد التذاكر")
        //   .regex(new RegExp("[^0]+"), "الرجاء أدخال رقم صحيح غير 0"),
        price: zod_1.z.string({ required_error: "أدخل رقم" }),
        seat: zod_1.z
            .string({ required_error: "يجب تعبئة الحقل" })
            .min(1, "يجب تعبئة الحقل")
            .max(30),
        category: zod_1.z
            .string({ required_error: "الرجاء تحديد فئة التذكرة" })
            .min(1, "الرجاء تحديد فئة التذكرة"),
    }),
});
