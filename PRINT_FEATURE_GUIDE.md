# Print Feature - Complete Guide

**Last Updated**: October 24, 2025  
**Status**: Active

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [The Bug We Fixed](#the-bug-we-fixed)
3. [Architecture & How It Works](#architecture--how-it-works)
4. [Implementation Guide](#implementation-guide)
5. [Troubleshooting](#troubleshooting)
6. [Code Templates](#code-templates)
7. [Best Practices](#best-practices)
8. [Technical Details](#technical-details)

---

## Quick Start

### Adding a Print Feature to a New Module

**Step 1**: Create the print component

```tsx
// app/components/module/ModulePrint.tsx
export const ModulePrint = ({ data }) => (
  <div className="hidden print:block">
    <style>{`
      @media print {
        body * { visibility: hidden !important; }
        #module-print, #module-print * { visibility: visible !important; }
        #module-print { position: absolute; left: 0; top: 0; width: 100%; }
        @page { size: A4; margin: 0.5cm; }
      }
    `}</style>
    <div id="module-print" className="p-6 bg-white">
      {/* Your print content here */}
    </div>
  </div>
);
```

**Step 2**: Integrate in detail view

```tsx
// app/components/module/ModuleDetailView.tsx
export const ModuleDetailView = () => (
  <>
    <ModulePrint data={data} />
    <div className="screen-only">  {/* ← CRITICAL: Add this class */}
      {/* Detail view content */}
      <button onClick={() => window.print()}>Print</button>
    </div>
  </>
);
```

**Step 3**: Integrate in table view

```tsx
// app/components/module/ModuleSection.tsx
const [dataToPrint, setDataToPrint] = useState(null);

const handlePrint = (id) => {
  const data = items.find(item => item.id === id);
  setDataToPrint(data);
  setTimeout(() => {
    window.print();
    setDataToPrint(null);
  }, 100);
};

return (
  <>
    <Table onPrint={handlePrint} />
    {dataToPrint && <ModulePrint data={dataToPrint} />}
  </>
);
```

**Checklist**:
- [ ] Print component has unique ID (e.g., `#module-print`)
- [ ] Uses `hidden print:block` wrapper
- [ ] CSS has `!important` on visibility rules
- [ ] Detail view wrapper has `screen-only` class
- [ ] Table view uses conditional rendering
- [ ] Print trigger uses `setTimeout(100ms)`
- [ ] Tested from both table and detail views
- [ ] Print preview shows 1 page with content

---

## The Bug We Fixed

### Problem: 3 Blank Pages When Printing from Detail View

**Symptoms**:
- Printing from table view → ✅ Works (1 page)
- Printing from detail view → ❌ Shows 3 blank pages

**Root Cause**:

The detail view (`SalaryDetailView.tsx`) always renders both:
1. `<SalarySlipPrint />` - The print component
2. Massive detail view content (cards, tables, attendance breakdown)

The print component uses `visibility: hidden` to hide all content:
```css
body * {
  visibility: hidden;  /* Hides elements but KEEPS their space */
}
```

**The Problem**: `visibility: hidden` hides elements visually but they **still occupy space** in the layout.

**Page Layout Before Fix**:
```
Page 1: Sidebar (hidden but takes ~1 page of blank space)
Page 2-3: Detail view content (hidden but takes 2-3 pages of blank space)
Page 3: Salary slip (finally visible)
```

### Solution: Two-Part Fix

**1. Add `screen-only` class to detail view wrapper**

```tsx
// app/components/account/salary/SalaryDetailView.tsx (line 91)
<div className="py-6 px-4 sm:px-6 lg:px-8 screen-only">
  {/* Detail view content */}
</div>
```

The `screen-only` class uses `display: none !important` during print, which **completely removes** the element from the layout (no space occupied).

**2. Add `!important` to print CSS rules**

```tsx
// app/components/account/salary/SalarySlipPrint.tsx (lines 26-30)
<style>{`
  @media print {
    body * { visibility: hidden !important; }
    #salary-slip-print, #salary-slip-print * { visibility: visible !important; }
  }
`}</style>
```

This ensures CSS specificity and prevents conflicts with other styles.

**Result After Fix**:
```
Page 1: Salary slip (visible) ✅ ONLY PAGE
```

### Key Lesson: CSS Property Differences

| Property | Visibility | Space Occupied | Use Case |
|----------|-----------|----------------|----------|
| `visibility: hidden` | Hidden | ✅ Yes | Hide sidebar/header (minimal space) |
| `display: none` | Hidden | ❌ No | Remove detail view (massive content) |

---

## Architecture & How It Works

### Component Structure

```
Dashboard Layout
├── Sidebar (hidden during print)
├── Header (hidden during print)
└── Main Content
    └── SalaryDetailView
        ├── SalarySlipPrint (hidden on screen, visible on print)
        └── Detail View Content (visible on screen, removed on print via screen-only)
```

### Print Flow

**Table View**:
```
User clicks Print
  ↓
setState: salaryToPrint = data
  ↓
Component re-renders → Shows SalarySlipPrint
  ↓
setTimeout(100ms) → Wait for DOM render
  ↓
window.print() → Opens print dialog
  ↓
CSS @media print applies
  ↓
User prints/cancels
  ↓
setState: salaryToPrint = null → Cleanup
```

**Detail View**:
```
User clicks Print
  ↓
window.print() → Opens print dialog
  (SalarySlipPrint already rendered)
  ↓
CSS @media print applies:
  - .screen-only → display: none (removes detail view)
  - body * → visibility: hidden (hides sidebar/header)
  - #salary-slip-print → visibility: visible (shows print content)
  ↓
User prints/cancels
```

### CSS Cascade During Print

**Step 1**: Remove detail view from layout
```css
.screen-only {
  display: none !important;  /* Completely removes from layout */
}
```

**Step 2**: Hide remaining elements
```css
body * {
  visibility: hidden !important;  /* Hides but keeps minimal space */
}
```

**Step 3**: Show print content
```css
#salary-slip-print, #salary-slip-print * {
  visibility: visible !important;  /* Makes print content visible */
}
```

---

## Implementation Guide

### File Structure

```
app/
├── app.css                                    # Global print styles
├── components/
│   └── account/
│       └── salary/
│           ├── SalarySection.tsx              # Table view
│           ├── SalaryDetailView.tsx           # Detail view
│           └── SalarySlipPrint.tsx            # Print component
```

### Step-by-Step Implementation

**Step 1: Create Print Component**

Create a dedicated print component (e.g., `ModulePrint.tsx`):

```tsx
interface ModulePrintProps {
  data: YourDataType;
}

export const ModulePrint: React.FC<ModulePrintProps> = ({ data }) => {
  return (
    <div className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #module-print, #module-print * {
            visibility: visible !important;
          }
          #module-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0.5cm;
          }
        }
      `}</style>
      
      <div id="module-print" className="p-6 bg-white">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">School Name</h1>
          <h2 className="text-xl">Document Title</h2>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          {/* Your content here */}
        </div>
        
        {/* Footer (fixed at bottom) */}
        <div className="print:fixed print:bottom-6 print:left-6 print:right-6">
          <div className="border-t-2 border-gray-800 pt-2">
            <p className="text-xs text-center">
              Computer-generated document
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Step 2: Integrate in Detail View**

```tsx
import { ModulePrint } from './ModulePrint';

export const ModuleDetailView = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Always render print component */}
      <ModulePrint data={data} />
      
      {/* Detail view content with screen-only class */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 screen-only">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6">
            <h1>Detail View</h1>
            <button onClick={handlePrint}>Print</button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Your detail view content */}
          </div>
        </div>
      </div>
    </>
  );
};
```

**Step 3: Integrate in Table View**

```tsx
import { useState } from 'react';
import { ModulePrint } from './ModulePrint';

export const ModuleSection = () => {
  const [dataToPrint, setDataToPrint] = useState<YourDataType | null>(null);

  const handlePrint = (id: string) => {
    const data = items.find(item => item.id === id);
    if (data) {
      setDataToPrint(data);
      setTimeout(() => {
        window.print();
        setDataToPrint(null);
      }, 100);
    }
  };

  return (
    <div>
      <Table data={items} onPrint={handlePrint} />
      {dataToPrint && <ModulePrint data={dataToPrint} />}
    </div>
  );
};
```

**Step 4: Ensure Global CSS**

Make sure `app/app.css` has:

```css
@media print {
  .screen-only {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 0.5cm;
  }
}
```

---

## Troubleshooting

### Issue 1: Print Shows 3 Blank Pages

**Symptom**: Print preview shows multiple blank pages before content

**Cause**: Detail view content is hidden but still occupying space

**Fix**: Add `screen-only` class to detail view wrapper

```tsx
// Before
<div className="py-6 px-4">
  {/* Detail view content */}
</div>

// After
<div className="py-6 px-4 screen-only">
  {/* Detail view content */}
</div>
```

### Issue 2: Print Shows 1 Blank Page (No Content)

**Symptom**: Print preview shows 1 page but it's completely blank

**Cause**: CSS visibility rules don't have `!important`

**Fix**: Add `!important` to print CSS

```css
/* Before */
body * { visibility: hidden; }
#module-print * { visibility: visible; }

/* After */
body * { visibility: hidden !important; }
#module-print * { visibility: visible !important; }
```

### Issue 3: Footer Not at Bottom

**Symptom**: Footer appears in the middle of the page

**Cause**: Missing `print:fixed` positioning

**Fix**: Add Tailwind print utilities

```tsx
<div className="print:fixed print:bottom-6 print:left-6 print:right-6">
  {/* Footer content */}
</div>
```

### Issue 4: Print Dialog Doesn't Open

**Symptom**: Nothing happens when clicking print button

**Cause**: Missing `setTimeout` before `window.print()`

**Fix**: Add delay to ensure DOM is rendered

```tsx
// Before
const handlePrint = () => {
  setDataToPrint(data);
  window.print();
};

// After
const handlePrint = () => {
  setDataToPrint(data);
  setTimeout(() => {
    window.print();
  }, 100);
};
```

### Issue 5: Content Overflows Page

**Symptom**: Content is cut off or spans multiple pages

**Cause**: Content too large for A4 page

**Fix**: Adjust font sizes and spacing

```tsx
// Use smaller fonts for print
<div className="text-sm print:text-xs">
  {/* Content */}
</div>
```

---

## Code Templates

### Complete Print Component Template

```tsx
import React from 'react';

interface ModulePrintProps {
  data: {
    id: string;
    // Add your data fields
  };
}

export const ModulePrint: React.FC<ModulePrintProps> = ({ data }) => {
  return (
    <div className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #module-print, #module-print * {
            visibility: visible !important;
          }
          #module-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0.5cm;
          }
        }
      `}</style>

      <div id="module-print" className="p-6 bg-white">
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold">Lincoln High School</h1>
          <h2 className="text-xl">Document Title</h2>
          <p className="text-sm text-gray-600">Academic Year 2024-2025</p>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-gray-800 p-3 bg-gray-50">
            <p className="text-xs text-gray-600">Field Label</p>
            <p className="text-sm font-semibold">{data.field}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-6">
          <table className="w-full border-2 border-gray-800">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-2 border-gray-800 p-2 text-left text-sm">Column 1</th>
                <th className="border-2 border-gray-800 p-2 text-right text-sm">Column 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-2 border-gray-800 p-2 text-sm">Data</td>
                <td className="border-2 border-gray-800 p-2 text-right text-sm">Value</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Section (fixed above footer) */}
        <div className="print:fixed print:bottom-20 print:left-6 print:right-6">
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2">
                <p className="text-sm">Employee Signature</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2">
                <p className="text-sm">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (fixed at bottom) */}
        <div className="print:fixed print:bottom-6 print:left-6 print:right-6">
          <div className="border-t-2 border-gray-800 pt-2">
            <div className="flex justify-between text-xs">
              <p>Computer-generated document. No signature required.</p>
              <p>Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Detail View Template

```tsx
import React from 'react';
import { ModulePrint } from './ModulePrint';

export const ModuleDetailView = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print component - always rendered */}
      <ModulePrint data={data} />

      {/* Detail view - hidden during print */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 screen-only">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header with print button */}
          <div className="flex justify-between items-center p-6 border-b">
            <h1 className="text-2xl font-bold">Detail View</h1>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Your detail view content */}
          </div>
        </div>
      </div>
    </>
  );
};
```

### Table View Template

```tsx
import React, { useState } from 'react';
import { ModulePrint } from './ModulePrint';

export const ModuleSection = () => {
  const [dataToPrint, setDataToPrint] = useState<DataType | null>(null);

  const handlePrint = (id: string) => {
    const data = items.find(item => item.id === id);
    if (data) {
      setDataToPrint(data);
      setTimeout(() => {
        window.print();
        setDataToPrint(null);
      }, 100);
    }
  };

  return (
    <div>
      {/* Table with print action */}
      <table>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <button onClick={() => handlePrint(item.id)}>
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conditionally render print component */}
      {dataToPrint && <ModulePrint data={dataToPrint} />}
    </div>
  );
};
```

---

## Best Practices

### Naming Conventions

✅ **DO**:
- Use unique IDs: `#salary-slip-print`, `#timetable-print`, `#receipt-print`
- Name print components: `ModulePrint.tsx` (e.g., `SalarySlipPrint.tsx`)
- Use descriptive state: `salaryToPrint`, `receiptToPrint`

❌ **DON'T**:
- Use generic IDs: `#print`, `#document`
- Reuse IDs across different modules
- Use vague names: `data`, `item`

### CSS Standards

**Borders**: `border-2 border-gray-800`
**Background**: `bg-gray-50` for alternating rows/sections
**Text Sizes**: `text-sm` for content, `text-xs` for labels/footer
**Spacing**: `p-6` for main container, `p-2` for table cells

### Testing Requirements

Before committing, test:

1. **Table View Print**
   - [ ] Click print from table row
   - [ ] Print preview shows 1 page
   - [ ] Content is visible and correct
   - [ ] Footer at bottom
   - [ ] Close preview - print component disappears

2. **Detail View Print**
   - [ ] Navigate to detail page
   - [ ] Click print button
   - [ ] Print preview shows 1 page
   - [ ] Content is visible and correct
   - [ ] Footer at bottom
   - [ ] Close preview - returns to detail view

3. **Cross-Browser**
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari

### Code Review Checklist

When reviewing print feature PRs:

- [ ] Print component has unique ID
- [ ] Wrapper uses `hidden print:block`
- [ ] CSS uses `!important` for visibility rules
- [ ] Detail view wrapper has `screen-only` class
- [ ] Table view uses conditional rendering
- [ ] Print trigger uses `setTimeout(100ms)`
- [ ] State cleanup after print (table view)
- [ ] No console errors
- [ ] Follows naming conventions
- [ ] Follows CSS standards
- [ ] All tests passed

---

## Technical Details

### Why `setTimeout(100ms)`?

When conditionally rendering the print component, React needs time to:
1. Update the virtual DOM
2. Commit changes to real DOM
3. Apply styles and layout

Without the delay, `window.print()` may be called before the print component is fully rendered, resulting in a blank page.

### Why `!important`?

The print component's CSS needs to override:
- Global styles from `app.css`
- Tailwind utility classes
- Component-specific styles
- Dashboard layout styles

Using `!important` ensures the print styles always take precedence.

### Why `position: absolute`?

The print component needs to:
- Position itself at the top-left of the page
- Ignore the normal document flow
- Overlay on top of hidden content

`position: absolute` with `left: 0; top: 0;` achieves this.

### Why `visibility: hidden` instead of `display: none`?

For the `body *` rule, we use `visibility: hidden` because:
- It hides elements but keeps minimal space
- Allows the print component to position absolutely
- Works better with `position: absolute`

For the detail view, we use `display: none` because:
- It completely removes massive content from layout
- Prevents blank pages
- More efficient for large content

### CSS Specificity

```
Specificity hierarchy (lowest to highest):
1. Element selectors: body, div, p
2. Class selectors: .screen-only
3. ID selectors: #salary-slip-print
4. Inline styles: style="..."
5. !important: Overrides everything
```

Our print CSS uses:
- `body *` (0,0,0,1) with `!important`
- `#salary-slip-print` (0,1,0,0) with `!important`

This ensures they always win.

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `window.print()` | ✅ | ✅ | ✅ | ✅ |
| `@media print` | ✅ | ✅ | ✅ | ✅ |
| `visibility: hidden` | ✅ | ✅ | ✅ | ✅ |
| `display: none` | ✅ | ✅ | ✅ | ✅ |
| `position: absolute` | ✅ | ✅ | ✅ | ✅ |
| Tailwind `print:` | ✅ | ✅ | ✅ | ✅ |
| `@page size` | ✅ | ✅ | ⚠️ Limited | ✅ |

### Performance Considerations

**Table View** (Conditional Rendering):
- ✅ Print component only in DOM when needed
- ✅ Minimal memory footprint
- ✅ Fast cleanup after print

**Detail View** (Always Rendered):
- ⚠️ Print component always in DOM
- ⚠️ Slightly higher memory usage
- ✅ Instant print (no re-render needed)

Both approaches are acceptable. Choose based on your use case.

---

## Debugging Tips

### Enable Print Media Emulation

**Chrome DevTools**:
1. Open DevTools (F12)
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
3. Type "Rendering"
4. Select "Show Rendering"
5. Under "Emulate CSS media type", select "print"

Now you can see print styles without opening print preview!

### Inspect Print Layout

1. Open print preview (`Cmd+P` or `Ctrl+P`)
2. Right-click in preview → "Inspect"
3. DevTools opens with print media active
4. Inspect elements and styles

### Common Console Errors

**Error**: `Cannot read property 'print' of undefined`
**Fix**: Ensure `window.print()` is called in browser environment

**Error**: `Element with ID already exists`
**Fix**: Use unique IDs for each print component

**Error**: `Maximum update depth exceeded`
**Fix**: Don't call `window.print()` inside render or useEffect without dependencies

### Debug Checklist

When print doesn't work:

1. [ ] Check browser console for errors
2. [ ] Verify print component has unique ID
3. [ ] Confirm `screen-only` class on detail view
4. [ ] Check CSS has `!important`
5. [ ] Verify `setTimeout` before `window.print()`
6. [ ] Test in print media emulation mode
7. [ ] Inspect element in print preview
8. [ ] Compare with working implementation

---

## Examples from Codebase

### Working Implementation: Salary Slip

**Files**:
- `app/components/account/salary/SalarySlipPrint.tsx` - Print component
- `app/components/account/salary/SalaryDetailView.tsx` - Detail view
- `app/components/account/salary/SalarySection.tsx` - Table view

**Key Features**:
- ✅ Unique ID: `#salary-slip-print`
- ✅ Uses `screen-only` class in detail view
- ✅ CSS has `!important` rules
- ✅ Fixed footer at bottom
- ✅ Conditional rendering in table view
- ✅ Proper state management

**Print Preview**: 1 page, content visible, footer at bottom ✅

---

## Summary

### The Pattern

1. **Create** dedicated print component with unique ID
2. **Add** inline CSS with `@media print` and `!important`
3. **Integrate** in detail view with `screen-only` class
4. **Integrate** in table view with conditional rendering
5. **Test** from both views

### The Fix

1. **Add** `screen-only` class to detail view wrapper
2. **Add** `!important` to print CSS visibility rules
3. **Result**: 1 page print with visible content ✅

### Key Takeaways

- `visibility: hidden` keeps space, `display: none` removes it
- Always use `!important` in print CSS
- Always add `screen-only` to detail views
- Always use `setTimeout` before `window.print()`
- Always test from both table and detail views

---

**Questions or Issues?**

1. Check the troubleshooting section
2. Review the code templates
3. Compare with working examples
4. Use debugging tips

---

