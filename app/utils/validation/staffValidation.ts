import { z } from 'zod';
import { 
  cniValidator, 
  nameValidator, 
  optionalEmailValidator, 
  optionalPhoneValidator, 
  addressValidator,
  dateValidator 
} from './commonValidators';
import { EmploymentStatus, UserRole } from '~/types/staff';
import { Gender, BloodGroup } from '~/types/teacher';

/**
 * Staff Validation Schemas
 * 
 * IMPORTANT: This file follows the Base Schema Pattern.
 * See VALIDATION_PATTERNS.md for detailed explanation.
 * 
 * Pattern:
 * 1. Create base schemas (without .refine()) for extending/partial
 * 2. Create refined schemas (with .refine()) for validation
 * 3. Use base schemas for .extend() and .partial()
 */

// ========================================
// 1. PERSONAL INFO SCHEMA (Base - without refine)
// ========================================
const personalInfoBaseSchema = z.object({
  // REQUIRED FIELDS
  cniNumber: cniValidator,
  firstName: nameValidator,
  lastName: nameValidator,
  gender: z.nativeEnum(Gender, { required_error: "Gender is required" }),
  joiningDate: dateValidator,
  
  // OPTIONAL FIELDS
  email: optionalEmailValidator.nullable(),
  bloodGroup: z.nativeEnum(BloodGroup).optional().nullable(),
  photoUrl: z.string().url("Invalid photo URL").optional().nullable(),
  phone: optionalPhoneValidator.nullable(),
  address: addressValidator.optional().nullable(),
  leavingDate: dateValidator.optional().nullable(),
});

// Export refined version for personal info validation
export const personalInfoSchema = personalInfoBaseSchema.refine(
  (data) => {
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
// 2. EMPLOYMENT DETAILS SCHEMA
// ========================================
export const employmentDetailsSchema = z.object({
  employmentStatus: z.nativeEnum(EmploymentStatus, { required_error: "Employment status is required" }),
  designation: z.nativeEnum(UserRole, { required_error: "Designation is required" }),
  department: z.string().optional().nullable(),
  qualifications: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  jobDescription: z.string().optional().nullable(),
  reportingTo: z.string().optional().nullable(),
});

// ========================================
// 3. EDUCATION HISTORY SCHEMA
// ========================================
export const educationHistorySchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.number().min(1950, "Year must be after 1950").max(new Date().getFullYear(), "Year cannot be in the future"),
  certificateUrl: z.string().url("Invalid certificate URL").optional().nullable(),
});

// ========================================
// 4. EXPERIENCE SCHEMA
// ========================================
export const experienceSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  position: z.string().min(1, "Position is required"),
  fromDate: dateValidator,
  toDate: dateValidator.optional().nullable(),
  description: z.string().optional().nullable(),
  experienceLatterUrl: z.string().url("Invalid experience letter URL").optional().nullable(),
}).refine(
  (data) => {
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
// 5. DOCUMENT SCHEMA
// ========================================
export const documentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  documentUrl: z.string().url("Invalid document URL").min(1, "Document URL is required"),
  uploadDate: z.date().optional(),
});

// ========================================
// 6. EMERGENCY CONTACT SCHEMA
// ========================================
export const emergencyContactSchema = z.object({
  name: nameValidator.optional().nullable(),
  relationship: z.string().optional().nullable(),
  phone: optionalPhoneValidator.optional().nullable(),
  address: addressValidator.optional().nullable(),
});

// ========================================
// 7. CREATE STAFF SCHEMA (Base - without refine)
// ========================================
// This is the base schema used for .extend() and .partial()
const createStaffBaseSchema = personalInfoBaseSchema.extend({
  ...employmentDetailsSchema.shape,
  educationHistory: z.array(educationHistorySchema).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  documents: z.array(documentSchema).optional().default([]),
  emergencyContact: emergencyContactSchema.optional().nullable(),
});

// ========================================
// 8. CREATE STAFF SCHEMA (Refined - with validation)
// ========================================
// This is the refined schema used for form validation
export const createStaffSchema = createStaffBaseSchema.refine(
  (data) => {
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
// 9. UPDATE STAFF SCHEMA
// ========================================
// Use base schema for .partial() to avoid TypeScript errors
export const updateStaffSchema = createStaffBaseSchema.partial();

// ========================================
// 10. TYPE EXPORTS
// ========================================
export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type EmploymentDetailsFormData = z.infer<typeof employmentDetailsSchema>;
export type EducationHistoryFormData = z.infer<typeof educationHistorySchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

