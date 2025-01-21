import { z } from 'zod';

/**
 * Class Validation Schemas
 * 
 * Following the Base Schema Pattern documented in VALIDATION_PATTERNS.md
 * - Base schemas (without .refine()) for extending/partial operations
 * - Refined schemas (with .refine()) for validation
 */

// ============================================================================
// Individual Field Validators
// ============================================================================

/**
 * Class Name Validator
 * - Required field
 * - Minimum 2 characters (after trim)
 * - Maximum 50 characters
 * - Trimmed whitespace
 */
const classNameValidator = z
  .string()
  .trim()
  .min(1, 'Class name is required')
  .min(2, 'Class name must be at least 2 characters')
  .max(50, 'Class name must not exceed 50 characters');

/**
 * Section Validator
 * - Optional field
 * - If provided, must be at least 1 character
 * - Maximum 10 characters
 * - Trimmed whitespace
 */
const sectionValidator = z
  .string()
  .trim()
  .max(10, 'Section must not exceed 10 characters')
  .optional()
  .or(z.literal(''));  // Allow empty string

/**
 * Grade Level Validator
 * - Required field
 * - Must be a non-empty string (grade code)
 */
const gradeLevelValidator = z
  .string()
  .min(1, 'Grade level is required');

/**
 * Subjects Array Validator
 * - Optional field
 * - Array of subject IDs (strings)
 * - Defaults to empty array
 */
const subjectsValidator = z
  .array(z.string())
  .optional();

/**
 * Class Teacher Validator
 * - Optional field
 * - Teacher ID (string)
 */
const classTeacherValidator = z
  .string()
  .optional();

/**
 * Temporary Class Teacher Validator
 * - Optional field
 * - Teacher ID (string)
 */
const classTempTeacherValidator = z
  .string()
  .optional();

// ============================================================================
// Base Schema (No .refine()) - For extending/partial operations
// ============================================================================

/**
 * Base Class Schema
 * Used for .extend() and .partial() operations
 * Does NOT include .refine() to avoid TypeScript errors
 */
const classBaseSchema = z.object({
  className: classNameValidator,
  classSection: sectionValidator,
  classGradeLevel: gradeLevelValidator,
  classSubjects: subjectsValidator,
  classTeacher: classTeacherValidator,
  classTempTeacher: classTempTeacherValidator,
});

// ============================================================================
// Validation Schemas (With .refine() if needed)
// ============================================================================

/**
 * Create Class Schema
 * Used for creating new classes
 * Currently no cross-field validation needed, so same as base schema
 */
export const createClassSchema = classBaseSchema;

/**
 * Update Class Schema
 * Used for updating existing classes
 * All fields are optional (partial)
 */
export const updateClassSchema = classBaseSchema.partial();

// ============================================================================
// TypeScript Types
// ============================================================================

export type CreateClassFormData = z.infer<typeof createClassSchema>;
export type UpdateClassFormData = z.infer<typeof updateClassSchema>;

