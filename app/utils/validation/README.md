# Validation Schemas

This directory contains all Zod validation schemas for the application.

## 📁 Structure

```
validation/
├── README.md                      # This file
├── VALIDATION_PATTERNS.md         # ⚠️ MUST READ - Zod patterns & best practices
├── commonValidators.ts            # Reusable field validators
├── studentValidation.ts           # Student-related schemas
├── teacherValidation.ts           # Teacher-related schemas
└── ...                            # Other domain schemas
```

## ⚠️ IMPORTANT: Read Before Creating Schemas

**Before creating or modifying any validation schema, READ:**
- [`VALIDATION_PATTERNS.md`](./VALIDATION_PATTERNS.md) - Critical patterns to avoid common Zod errors

## 🎯 Quick Reference

### Creating a New Validation Schema

```typescript
/**
 * [Domain] Validation Schemas
 * 
 * IMPORTANT: This file follows the Base Schema Pattern.
 * See: app/utils/validation/VALIDATION_PATTERNS.md
 */

// 1. Base schema (no .refine()) - for extending/partial
const baseSchema = z.object({
  field1: z.string(),
  field2: z.number(),
});

// 2. Refined schema (with .refine()) - for validation
export const createSchema = baseSchema.refine(
  (data) => {
    // validation logic
    return true;
  },
  { message: "Error message" }
);

// 3. Update schema - use BASE schema
export const updateSchema = baseSchema.partial();
```

### Common Validators

Reuse validators from `commonValidators.ts`:

```typescript
import {
  cniValidator,
  nameValidator,
  dateValidator,
  phoneValidator,
  emailValidator,
  addressValidator,
} from "./commonValidators";

const schema = z.object({
  cniNumber: cniValidator,
  firstName: nameValidator,
  email: emailValidator,
  // ...
});
```

## 🚨 Common Mistakes

### ❌ WRONG: Using .partial() on refined schema
```typescript
const createSchema = z.object({ ... }).refine(...);
const updateSchema = createSchema.partial(); // ERROR!
```

### ✅ CORRECT: Use base schema for .partial()
```typescript
const baseSchema = z.object({ ... });
const createSchema = baseSchema.refine(...);
const updateSchema = baseSchema.partial(); // Works!
```

### ❌ WRONG: Using .extend() on refined schema
```typescript
const basicSchema = z.object({ ... }).refine(...);
const extendedSchema = basicSchema.extend({ ... }); // ERROR!
```

### ✅ CORRECT: Use base schema for .extend()
```typescript
const baseSchema = z.object({ ... });
const basicSchema = baseSchema.refine(...);
const extendedSchema = baseSchema.extend({ ... }); // Works!
```

## 📚 Resources

- [Zod Documentation](https://zod.dev/)
- [VALIDATION_PATTERNS.md](./VALIDATION_PATTERNS.md) - Detailed patterns and examples
- [commonValidators.ts](./commonValidators.ts) - Reusable validators

## 🔄 Checklist for New Schemas

- [ ] Read `VALIDATION_PATTERNS.md`
- [ ] Use base schema pattern if using `.refine()`
- [ ] Reuse common validators where possible
- [ ] Add JSDoc comments explaining the schema purpose
- [ ] Export both create and update schemas if needed
- [ ] Test validation with valid and invalid data
- [ ] Document any custom validation logic

