import { z } from "zod";
import { Gender, BloodGroup, GuardianRelationship, StudentStatus, ExitStatus } from "~/types/student";
import {
  cniValidator,
  nameValidator,
  dateValidator,
  createDateRangeValidator,
  phoneValidator,
  optionalPhoneValidator,
  optionalEmailValidator,
  addressValidator,
} from "./commonValidators";

const CNIC_MISMATCH_ERROR = "Guardian CNIC cannot be the same as student CNIC";

/**
 * Student Validation Schemas
 *
 * IMPORTANT: This file follows the Base Schema Pattern to avoid Zod refine/extend conflicts.
 * See: app/utils/validation/VALIDATION_PATTERNS.md
 *
 * Pattern:
 * 1. Create base schemas (no .refine()) - for extending/partial
 * 2. Create refined schemas (with .refine()) - for validation
 * 3. Use base schemas for .extend() and .partial()
 */

export const basicInfoSchema = z.object({
  cniNumber: cniValidator,
  firstName: nameValidator,
  lastName: nameValidator,
  dateOfBirth: dateValidator.and(createDateRangeValidator(3, 25)),
  gender: z.nativeEnum(Gender, { required_error: "Gender is required" }),
  bloodGroup: z.nativeEnum(BloodGroup).optional().nullable(),
  phone: optionalPhoneValidator.nullable(),
  email: optionalEmailValidator.nullable(),
  address: addressValidator,
  admissionDate: dateValidator,
  gradeLevel: z.string().min(1, "Grade level is required"),
});

export const guardianSchema = z.object({
  name: nameValidator,
  cniNumber: cniValidator,
  relationship: z.nativeEnum(GuardianRelationship, {
    required_error: "Relationship is required",
  }),
  phone: phoneValidator,
  email: optionalEmailValidator.nullable(),
});

const createStudentBaseSchema = basicInfoSchema.extend({
  guardian: guardianSchema,
});

export const createStudentSchema = createStudentBaseSchema.refine(
  (data) => data.cniNumber !== data.guardian.cniNumber,
  {
    message: CNIC_MISMATCH_ERROR,
    path: ["guardian", "cniNumber"],
  }
);

export const updateStudentSchema = createStudentBaseSchema.partial();

// Update Personal Info Schema - for editing personal information
export const updatePersonalInfoSchema = z.object({
  firstName: nameValidator,
  lastName: nameValidator,
  dateOfBirth: dateValidator.and(createDateRangeValidator(3, 25)),
  gender: z.nativeEnum(Gender).optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional().nullable(),
  phone: optionalPhoneValidator.nullable(),
  email: optionalEmailValidator.nullable(),
  address: addressValidator,
  photoUrl: z.string().optional().nullable(),
});

// Update Guardian Info Schema - for editing guardian information
export const updateGuardianInfoSchema = z.object({
  name: nameValidator,
  cniNumber: cniValidator,
  relationship: z.nativeEnum(GuardianRelationship, {
    required_error: "Relationship is required",
  }),
  phone: phoneValidator, // Changed from optionalPhoneValidator to phoneValidator (REQUIRED to match backend)
  email: optionalEmailValidator.nullable(),
});

// Update Academic Info Schema - for editing academic information
export const updateAcademicInfoSchema = z.object({
  gradeLevel: z.string().min(1, "Grade level is required").optional().or(z.literal("")),
  class: z.string().optional().nullable(),
  rollNumber: z.string().optional().nullable(),
  admissionDate: z.string().optional().or(z.literal("")),
  enrollmentDate: z.string().optional().nullable(),
  section: z.string().optional().nullable(),
});

// Update Status Schema - for editing student status with conditional validation
export const updateStatusSchema = z.object({
  status: z.nativeEnum(StudentStatus, { required_error: "Status is required" }),
  exitStatus: z.nativeEnum(ExitStatus).optional().nullable(),
  exitDate: z.string().optional().nullable(),
  exitRemarks: z.string().max(500, "Remarks must not exceed 500 characters").optional().nullable(),
}).refine(
  (data) => {
    // If exitStatus is not None, exitDate should be provided
    if (data.exitStatus && data.exitStatus !== ExitStatus.None) {
      return !!data.exitDate && data.exitDate.length > 0;
    }
    return true;
  },
  {
    message: "Exit date is required when exit status is selected",
    path: ["exitDate"],
  }
);

// Document Schema - for adding documents
export const documentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  documentUrl: z.string().min(1, "Document URL is required").url("Must be a valid URL"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type GuardianFormData = z.infer<typeof guardianSchema>;
export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
export type UpdatePersonalInfoFormData = z.infer<typeof updatePersonalInfoSchema>;
export type UpdateGuardianInfoFormData = z.infer<typeof updateGuardianInfoSchema>;
export type UpdateAcademicInfoFormData = z.infer<typeof updateAcademicInfoSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;

