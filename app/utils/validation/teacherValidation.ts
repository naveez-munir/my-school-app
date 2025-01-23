import { z } from "zod";
import { Gender, BloodGroup, EmploymentStatus } from "~/types/teacher";
import {
  cniValidator,
  nameValidator,
  dateValidator,
  optionalPhoneValidator,
  optionalEmailValidator,
  addressValidator,
} from "./commonValidators";

/**
 * Teacher Validation Schemas
 *
 * IMPORTANT: This file follows the Base Schema Pattern to avoid Zod refine/extend conflicts.
 * See: app/utils/validation/VALIDATION_PATTERNS.md
 *
 * Pattern:
 * 1. Create base schemas (no .refine()) - for extending/partial
 * 2. Create refined schemas (with .refine()) - for validation
 * 3. Use base schemas for .extend() and .partial()
 */

// ========================================
// 1. BASIC INFO SCHEMA (Base - without refine)
// ========================================
const basicInfoBaseSchema = z.object({
  // REQUIRED FIELDS (based on CreateTeacherDto)
  cniNumber: cniValidator,
  firstName: nameValidator,
  lastName: nameValidator,
  gender: z.nativeEnum(Gender, { required_error: "Gender is required" }),
  joiningDate: dateValidator,
  employmentStatus: z.nativeEnum(EmploymentStatus, { required_error: "Employment status is required" }),
  qualifications: z.array(z.string()).default([]), // Required array, can be empty

  // OPTIONAL FIELDS (validate only if provided)
  email: optionalEmailValidator.nullable(),
  phone: optionalPhoneValidator.nullable(),
  bloodGroup: z.nativeEnum(BloodGroup).optional().nullable(),
  address: addressValidator.nullable(),
  leavingDate: dateValidator.optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  subjects: z.array(z.string()).optional().default([]),
  classTeacherOf: z.string().optional().nullable(),
});

// Export basic info schema with validation
export const basicInfoSchema = basicInfoBaseSchema.refine(
  (data) => {
    // Cross-field validation: leavingDate must be after joiningDate
    if (data.leavingDate && data.joiningDate) {
      return new Date(data.leavingDate) > new Date(data.joiningDate);
    }
    return true;
  },
  {
    message: "Leaving date must be after joining date",
    path: ["leavingDate"],
  }
);

// ========================================
// 2. EDUCATION HISTORY SCHEMA
// ========================================
export const educationHistorySchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution is required"),
  year: z.number()
    .min(1950, "Year must be after 1950")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  certificateUrl: z.string().url("Must be a valid URL").optional(),
});

// ========================================
// 3. EXPERIENCE SCHEMA
// ========================================
export const experienceSchema = z.object({
  institution: z.string().min(2, "Institution is required"),
  position: z.string().min(2, "Position is required"),
  fromDate: dateValidator,
  toDate: dateValidator.optional().nullable(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
  experienceLatterUrl: z.string().url("Must be a valid URL").optional(),
}).refine(
  (data) => {
    // toDate must be after fromDate
    if (data.toDate && data.fromDate) {
      return new Date(data.toDate) > new Date(data.fromDate);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["toDate"],
  }
);

// ========================================
// 4. DOCUMENT SCHEMA
// ========================================
export const documentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  documentUrl: z.string().min(1, "Document URL is required").url("Must be a valid URL"),
  uploadDate: z.date().optional(),
});

// ========================================
// 5. COMPLETE TEACHER SCHEMA
// ========================================
// Base schema without refine (so we can use .partial() for updates)
const createTeacherBaseSchema = basicInfoBaseSchema.extend({
  educationHistory: z.array(educationHistorySchema).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  documents: z.array(documentSchema).optional().default([]),
});

// Create schema with validation
export const createTeacherSchema = createTeacherBaseSchema.refine(
  (data) => {
    // Cross-field validation: leavingDate must be after joiningDate
    if (data.leavingDate && data.joiningDate) {
      return new Date(data.leavingDate) > new Date(data.joiningDate);
    }
    return true;
  },
  {
    message: "Leaving date must be after joining date",
    path: ["leavingDate"],
  }
);

// Update schema - use base schema for .partial() to work
export const updateTeacherSchema = createTeacherBaseSchema.partial();

// ========================================
// EXPORT TYPES
// ========================================
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type EducationHistoryFormData = z.infer<typeof educationHistorySchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type CreateTeacherFormData = z.infer<typeof createTeacherSchema>;

