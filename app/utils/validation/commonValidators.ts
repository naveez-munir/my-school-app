import { z } from "zod";

export const cniRegex = /^\d{5}-\d{7}-\d{1}$/;
// Updated to match backend: requires either +92 or 0 prefix, followed by 10 digits
export const phoneRegex = /^(\+92|0)[0-9]{10}$/;

export const cniValidator = z
  .string()
  .min(1, "CNI number is required")
  .regex(cniRegex, "CNI format must be: 12345-1234567-1");

export const optionalCniValidator = z
  .string()
  .optional()
  .refine(
    (val) => !val || cniRegex.test(val),
    "CNI format must be: 12345-1234567-1"
  );

export const phoneValidator = z
  .string()
  .min(1, "Phone number is required")
  .regex(phoneRegex, "Phone must be a valid Pakistan number (e.g., +923001234567 or 03001234567)");

export const optionalPhoneValidator = z
  .string()
  .optional()
  .refine(
    (val) => !val || phoneRegex.test(val),
    "Phone must be a valid Pakistan number (e.g., +923001234567 or 03001234567)"
  );

export const emailValidator = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format");

export const optionalEmailValidator = z
  .string()
  .optional()
  .refine(
    (val) => !val || z.string().email().safeParse(val).success,
    "Invalid email format"
  );

export const nameValidator = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must not exceed 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

export const addressValidator = z
  .string()
  .max(200, "Address must not exceed 200 characters")
  .optional();

export const dateValidator = z.string().min(1, "Date is required");

export const createDateRangeValidator = (minAge: number, maxAge: number) => {
  return z.string().refine(
    (date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const adjustedAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;
      return adjustedAge >= minAge && adjustedAge <= maxAge;
    },
    `Age must be between ${minAge} and ${maxAge} years`
  );
};

