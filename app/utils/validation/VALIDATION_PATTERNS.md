# Zod Validation Patterns & Best Practices

## ⚠️ Critical: Understanding Zod Schema Chaining

### The Problem

When you use `.refine()` or `.superRefine()` on a Zod schema, it returns a **refined schema** that **DOES NOT** have methods like `.extend()` or `.partial()`.

This causes TypeScript errors like:
```
Property 'extend' does not exist on type 'ZodEffects<...>'
Property 'partial' does not exist on type 'ZodEffects<...>'
```

---

## ✅ Solution: Base Schema Pattern

**ALWAYS** create a base schema without `.refine()`, then create refined versions as needed.

### Pattern Structure

```typescript
// 1. BASE SCHEMA (no refine) - for extending and partial
const baseSchema = z.object({
  field1: z.string(),
  field2: z.number(),
});

// 2. REFINED SCHEMA - for validation with refine
export const refinedSchema = baseSchema.refine(
  (data) => {
    // validation logic
    return true;
  },
  { message: "Error message" }
);

// 3. PARTIAL SCHEMA - use BASE schema, not refined
export const partialSchema = baseSchema.partial();

// 4. EXTENDED SCHEMA - use BASE schema, not refined
export const extendedSchema = baseSchema.extend({
  field3: z.string(),
});
```

---

## 📋 Real-World Examples

### Example 1: Basic Info with Cross-Field Validation

```typescript
// ❌ WRONG - Cannot extend or partial a refined schema
export const basicInfoSchema = z.object({
  joiningDate: z.string(),
  leavingDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.leavingDate && data.joiningDate) {
      return new Date(data.leavingDate) > new Date(data.joiningDate);
    }
    return true;
  },
  { message: "Leaving date must be after joining date" }
);

// This will ERROR!
export const createSchema = basicInfoSchema.extend({ ... });
```

```typescript
// ✅ CORRECT - Use base schema pattern
const basicInfoBaseSchema = z.object({
  joiningDate: z.string(),
  leavingDate: z.string().optional(),
});

// Refined version for form validation
export const basicInfoSchema = basicInfoBaseSchema.refine(
  (data) => {
    if (data.leavingDate && data.joiningDate) {
      return new Date(data.leavingDate) > new Date(data.joiningDate);
    }
    return true;
  },
  { message: "Leaving date must be after joining date" }
);

// Use base schema for extending
export const createSchema = basicInfoBaseSchema.extend({
  additionalField: z.string(),
});
```

### Example 2: Create and Update Schemas

```typescript
// ❌ WRONG
export const createSchema = z.object({ ... }).refine(...);
export const updateSchema = createSchema.partial(); // ERROR!
```

```typescript
// ✅ CORRECT
const baseSchema = z.object({ ... });

export const createSchema = baseSchema.refine(...);
export const updateSchema = baseSchema.partial(); // Works!
```

### Example 3: Multi-Level Schema Composition

```typescript
// Base schemas (no refine)
const personalInfoBaseSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const addressBaseSchema = z.object({
  street: z.string(),
  city: z.string(),
});

// Composed base schema
const userBaseSchema = personalInfoBaseSchema.extend({
  address: addressBaseSchema,
  role: z.enum(["admin", "user"]),
});

// Refined versions
export const personalInfoSchema = personalInfoBaseSchema.refine(...);
export const addressSchema = addressBaseSchema.refine(...);
export const createUserSchema = userBaseSchema.refine(...);

// Partial/Update schemas - use base schemas
export const updateUserSchema = userBaseSchema.partial();
export const updatePersonalInfoSchema = personalInfoBaseSchema.partial();
```

---

## 🎯 When to Use Each Pattern

### Use `.refine()` when:
- You need cross-field validation (e.g., date ranges, conditional requirements)
- You need custom validation logic beyond Zod's built-in validators
- This is the **final** schema that will be used for validation

### Use Base Schema when:
- You need to `.extend()` the schema later
- You need to create a `.partial()` version
- You need to compose multiple schemas together
- This schema will be a building block for other schemas

---

## 📝 Naming Conventions

Follow these naming conventions to make the pattern clear:

```typescript
// Base schemas (no refine) - use "Base" suffix
const basicInfoBaseSchema = z.object({ ... });
const createTeacherBaseSchema = z.object({ ... });

// Refined schemas (with refine) - no suffix
export const basicInfoSchema = basicInfoBaseSchema.refine(...);
export const createTeacherSchema = createTeacherBaseSchema.refine(...);

// Partial schemas - use "partial" or "update" prefix/suffix
export const updateTeacherSchema = createTeacherBaseSchema.partial();
export const partialBasicInfoSchema = basicInfoBaseSchema.partial();
```

---

## 🔄 Migration Checklist

When refactoring existing validation schemas:

- [ ] Identify schemas that use `.refine()` or `.superRefine()`
- [ ] Check if these schemas are used with `.extend()` or `.partial()`
- [ ] Create base schema versions (without refine)
- [ ] Update refined schemas to use base schemas
- [ ] Update `.extend()` and `.partial()` calls to use base schemas
- [ ] Update naming to follow conventions
- [ ] Test all validation scenarios

---

## 🚨 Common Mistakes to Avoid

### 1. Chaining refine with extend
```typescript
// ❌ WRONG
const schema = z.object({ ... }).refine(...).extend({ ... });
```

### 2. Using partial on refined schema
```typescript
// ❌ WRONG
const createSchema = z.object({ ... }).refine(...);
const updateSchema = createSchema.partial();
```

### 3. Forgetting to export base schema when needed
```typescript
// ❌ WRONG - base schema is not accessible
const baseSchema = z.object({ ... });
export const refinedSchema = baseSchema.refine(...);
// Other files cannot extend baseSchema!

// ✅ CORRECT - export base if needed elsewhere
export const baseSchema = z.object({ ... });
export const refinedSchema = baseSchema.refine(...);
```

---

## 📚 Additional Resources

- [Zod Documentation - Refine](https://zod.dev/?id=refine)
- [Zod Documentation - Extend](https://zod.dev/?id=extend)
- [Zod Documentation - Partial](https://zod.dev/?id=partial)

---

## 🎓 Summary

**Golden Rule:** 
> If you need to use `.extend()` or `.partial()` on a schema, **NEVER** apply `.refine()` to it. Always create a base schema without `.refine()`, then create refined versions as needed.

**Pattern:**
```typescript
const base = z.object({ ... });           // For extending/partial
export const refined = base.refine(...);  // For validation
export const partial = base.partial();    // For updates
export const extended = base.extend(...); // For composition
```

This pattern has been applied to:
- ✅ Student validation schemas
- ✅ Teacher validation schemas
- 🔄 Apply to all future validation schemas

