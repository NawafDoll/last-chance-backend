import { z } from "zod";

export const postTicketZodSchema = z.object({
  body: z.object({
    // number: z
    //   .string({ required_error: "الرجاء أدخل عدد التذاكر" })
    //   .min(1, "الحد الادنى تذكرة 1")
    //   .max(1, "الحد الاقصى 9 تذاكر")
    //   .regex(new RegExp(".*\\d.*"), "الرجاء أدخل عدد التذاكر")
    //   .regex(new RegExp("[^0]+"), "الرجاء أدخال رقم صحيح غير 0"),
    price: z.string({ required_error: "أدخل رقم" }),
    seat: z
      .string({ required_error: "يجب تعبئة الحقل" })
      .min(1, "يجب تعبئة الحقل")
      .max(30),
    category: z
      .string({ required_error: "الرجاء تحديد فئة التذكرة" })
      .min(1, "الرجاء تحديد فئة التذكرة"),
  }),
});
