import { z } from 'zod';

/**
 * Subject Validation Schemas
 * 
 * Following the Base Schema Pattern documented in VALIDATION_PATTERNS.md
 * - Base schemas (without .refine()) for extending/partial operations
 * - Refined schemas (with .refine()) for validation
 */

// ============================================================================
// Individual Field Validators
// ============================================================================

/**
 * Subject Name Validator
 * - Required field
 * - Minimum 2 characters
 * - Maximum 100 characters
 * - Trimmed whitespace
 */
const subjectNameValidator = z
  .string()
  .min(1, 'Subject name is required')
  .min(2, 'Subject name must be at least 2 characters')
  .max(100, 'Subject name must not exceed 100 characters')
  .trim();

/**
 * Subject Code Validator
 * - Required field
 * - Minimum 2 characters
 * - Maximum 20 characters
 * - Only uppercase letters, numbers, and hyphens allowed
 * - Trimmed whitespace
 */
const subjectCodeValidator = z
  .string()
  .min(1, 'Subject code is required')
  .min(2, 'Subject code must be at least 2 characters')
  .max(20, 'Subject code must not exceed 20 characters')
  .regex(
    /^[A-Z0-9-]+$/,
    'Subject code must contain only uppercase letters, numbers, and hyphens (e.g., MATH-101, ENG-01)'
  )
  .trim();

// ============================================================================
// Base Schema (No .refine()) - For extending/partial operations
// ============================================================================

/**
 * Base Subject Schema
 * Used for .extend() and .partial() operations
 * Does NOT include .refine() to avoid TypeScript errors
 */
const subjectBaseSchema = z.object({
  subjectName: subjectNameValidator,
  subjectCode: subjectCodeValidator,
});

// ============================================================================
// Validation Schemas (With .refine() if needed)
// ============================================================================

/**
 * Create Subject Schema
 * Used for creating new subjects
 * Currently no cross-field validation needed, so same as base schema
 */
export const createSubjectSchema = subjectBaseSchema;

/**
 * Update Subject Schema
 * Used for updating existing subjects
 * All fields are optional (partial)
 */
export const updateSubjectSchema = subjectBaseSchema.partial();

// ============================================================================
// TypeScript Types
// ============================================================================

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>;

