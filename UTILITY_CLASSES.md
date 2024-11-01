# Tailwind Utility Classes Reference

This document lists all custom utility classes available in `app/app.css` for consistent, responsive design across the application.

---

## 📝 **TEXT UTILITIES**

### **Responsive Text Sizes**
```tsx
className="text-responsive"        // 12px mobile → 14px tablet+
className="text-responsive-lg"     // 14px mobile → 16px tablet+
className="text-responsive-xl"     // 16px mobile → 18px tablet+
```

### **Text Style Combinations**
```tsx
className="text-body"              // text-xs sm:text-sm text-gray-900
className="text-body-secondary"    // text-xs sm:text-sm text-gray-500
className="text-label"             // text-xs sm:text-sm font-medium text-gray-700
className="text-heading"           // text-sm sm:text-base font-semibold text-gray-900
className="text-section-title"     // text-xs font-semibold text-gray-600 uppercase tracking-wide
className="text-page-title"        // text-base sm:text-lg font-semibold text-gray-700
```

**Usage Examples:**
```tsx
// Before
<div className="text-xs sm:text-sm text-gray-900">Student Name</div>

// After
<div className="text-body">Student Name</div>
```

---

## 🎨 **LAYOUT UTILITIES**

### **Flex Layouts**
```tsx
className="flex-center"    // flex items-center gap-2
className="flex-start"     // flex items-start gap-3
className="flex-between"   // flex items-center justify-between
```

**Usage Examples:**
```tsx
// Before
<div className="flex items-center gap-2">

// After
<div className="flex-center">
```

---

## 📦 **CARD & CONTAINER UTILITIES**

```tsx
className="card"           // bg-white border border-gray-300 rounded-lg
className="card-padded"    // bg-white border border-gray-300 rounded-lg p-4 sm:p-6
className="info-box"       // bg-gray-50 rounded-lg p-4 border border-gray-200
className="info-box-hover" // bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors
```

**Usage Examples:**
```tsx
// Before
<div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">

// After
<div className="card-padded">
```

---

## 📊 **TABLE UTILITIES**

```tsx
className="table-cell"        // px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 whitespace-nowrap
className="table-header"      // px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
className="table-sort-header" // flex items-center cursor-pointer
```

**Usage Examples:**
```tsx
// Before
<th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">

// After
<th className="table-header">

// Before
<td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 whitespace-nowrap">

// After
<td className="table-cell">
```

---

## 🔘 **BUTTON UTILITIES**

```tsx
className="btn-base"       // px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm
className="btn-primary"    // px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700
className="btn-secondary"  // px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm border text-gray-500 hover:bg-gray-50
className="btn-danger"     // px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700
```

**Usage Examples:**
```tsx
// Before
<button className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700">

// After
<button className="btn-primary">

// Before
<button className="px-2.5 sm:px-3 py-1 sm:py-1.5 border text-gray-500 rounded text-xs sm:text-sm disabled:opacity-50 cursor-pointer">

// After
<button className="btn-secondary disabled:opacity-50 cursor-pointer">
```

---

## 🎯 **ICON UTILITIES**

```tsx
className="icon-sm"  // h-3 w-3 sm:h-3.5 sm:w-3.5
className="icon-md"  // h-3.5 w-3.5 sm:h-4 sm:w-4
className="icon-lg"  // h-4 w-4 sm:h-5 sm:w-5
```

**Usage Examples:**
```tsx
// Before
<ChevronUp className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />

// After
<ChevronUp className="ml-1 icon-sm" />

// Before
<Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

// After
<Eye className="icon-md" />
```

---

## 📏 **SPACING UTILITIES**

```tsx
className="space-y-responsive"  // space-y-3 sm:space-y-4
className="gap-responsive"      // gap-3 sm:gap-4
```

**Usage Examples:**
```tsx
// Before
<div className="space-y-3 sm:space-y-4">

// After
<div className="space-y-responsive">
```

---

## 📝 **FORM UTILITIES**

```tsx
className="form-input"   // mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-900
className="form-label"   // block text-xs sm:text-sm font-medium text-gray-700
className="form-select"  // mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-500 cursor-pointer
```

**Usage Examples:**
```tsx
// Before
<label className="block text-xs sm:text-sm font-medium text-gray-700">Search</label>
<input className="mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-900" />

// After
<label className="form-label">Search</label>
<input className="form-input" />
```

---

## 🎯 **MIGRATION STRATEGY**

### **Step 1: Start with Student Module**
Update `StudentsTable.tsx` to use utility classes

### **Step 2: Replicate to Other Modules**
Apply the same pattern to:
- Fee Module
- Attendance Module
- Leave Module
- Teacher Module
- Staff Module
- etc.

### **Step 3: Benefits**
- ✅ **Reduced code duplication** - `text-xs sm:text-sm` → `text-body`
- ✅ **Better readability** - Intent is clear from class name
- ✅ **Easier maintenance** - Change once in `app.css`, applies everywhere
- ✅ **Consistent design** - Same spacing, sizing, colors across all modules
- ✅ **Faster development** - Less typing, fewer mistakes

---

## 📊 **BEFORE vs AFTER COMPARISON**

### **Table Header Example:**
```tsx
// BEFORE (54 characters)
<th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">

// AFTER (28 characters) - 48% reduction!
<th className="table-header">
```

### **Button Example:**
```tsx
// BEFORE (107 characters)
<button className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700">

// AFTER (30 characters) - 72% reduction!
<button className="btn-primary">
```

### **Text Example:**
```tsx
// BEFORE (42 characters)
<div className="text-xs sm:text-sm text-gray-900">

// AFTER (23 characters) - 45% reduction!
<div className="text-body">
```

---

## 🚀 **NEXT STEPS**

1. ✅ Utility classes created in `app/app.css`
2. ⏳ Update Student module components
3. ⏳ Replicate pattern to other modules
4. ⏳ Test responsive behavior on mobile/tablet/desktop

**Ready to start updating the Student module!**


TASK:
Review the migration documentation and tell me:

What is the NEXT priority task from the migration plan?
What are the critical missing features from the "Must-Have Before Go-Live" checklist?
Provide a ranked list of what to implement next (top 3 priorities)
REQUIREMENTS:
Check MONGODB_MIGRATION_MASTER.md - Section "Critical Success Criteria"
Check MONGODB_MIGRATION_PHASE_3_4.md - Pending tasks
Look for items marked [ ] (not completed)
Focus on: Customer APIs, Supplier APIs, Expense APIs, Bill V2 enhancements
OUTPUT FORMAT:
Provide a SHORT summary:

Next Task: [Name]
Estimated Time: [Hours]
Why Priority: [1-2 sentences]
Dependencies: [What's needed first]
Files to Create/Modify: [List]
RULES:
Follow existing patterns (React Query + Offline + Smart Hooks)
Maintain tenant isolation
No code changes until approv