# 🎯 Frontend Testing Guide (React/Remix)

## 🖥️ Component & UI Testing

### **Authentication Flow**

#### **Login Component** (`/app/components/auth/SignIn.tsx`)
**Test Scenarios:**
1. **Valid Login Flow**
   ```typescript
   // Test multi-tenant login
   tenantName: "test-school"
   identifier: "admin@school.com" | "12345-1234567-1"
   password: "validPassword"

   // Expected: Redirect to appropriate dashboard based on role
   ```

2. **Role-based Redirects**
   - Super Admin → Cross-tenant dashboard
   - Admin/Principal → School dashboard
   - Teacher → Teacher dashboard
   - Student → Student portal
   - Guardian → Guardian portal

3. **Form Validation**
   - Empty fields → Display error messages
   - Invalid email format → Validation error
   - Invalid CNI format → Pakistani format validation
   - Weak password → Password strength indicator

4. **Error Handling**
   - Invalid credentials → Display "Invalid login" toast
   - Tenant not found → "Tenant not found" error
   - Network errors → Connection error message
   - Server errors → Generic error handling

### **Student Management Testing**

#### **Student Registration Wizard** (`/app/components/student/form/`)
**Multi-step Form Testing:**

**Step 1: Basic Information**
```typescript
// Test Cases:
{
  validData: {
    cniNumber: "12345-1234567-1", // Pakistani format
    firstName: "Ahmad",
    lastName: "Ali",
    gender: "Male",
    dateOfBirth: "2010-01-15",
    gradeLevel: "5th",
    admissionDate: "2024-01-01"
  },

  invalidCNIC: "invalid-format", // Should show validation error
  futureBirthDate: "2030-01-01", // Should prevent selection
  missingRequired: {} // Should show required field errors
}
```

**Step 2: Guardian Information**
```typescript
// Auto-linking existing guardian test
{
  existingGuardian: "12345-1234567-0", // Should populate guardian data
  newGuardian: "54321-7654321-0", // Should create new guardian
  invalidPhone: "invalid-phone", // Pakistani format validation
}
```

**Step 3: Review & Submit**
- Display all entered data correctly
- Allow editing by going back to previous steps
- Submit button triggers API call with loading state
- Success → Navigate to student detail page
- Error → Display error message and allow retry

#### **Student Table** (`/app/components/student/StudentTable.tsx`)
**Data Display Testing:**
1. **Column Rendering**
   - Photo → Display avatar or initials fallback
   - Name → Format: "FirstName LastName"
   - Roll Number → Display or "Not Assigned"
   - Class → Display "ClassName Section" or "Not Assigned"
   - Guardian → Display guardian name
   - Status → Color-coded badges

2. **Table Interactions**
   - Sorting → Click column headers for asc/desc sort
   - Search → Global search across all displayed fields
   - Pagination → Page size selection (5, 10, 20, 30, 50)
   - Actions → Edit/Delete buttons with proper permissions

3. **Filtering & Search**
   ```typescript
   // Test search functionality
   searchTerms: [
     "Ahmad", // Student name
     "12345-1234567-1", // Student CNI
     "5th A", // Class information
     "Father Name", // Guardian name
     "Active" // Status
   ]
   ```

#### **Student Detail Views** (`/app/routes/dashboard/students/:id`)
**Tabbed Interface Testing:**

**Overview Tab:**
- Display comprehensive student information
- Photo rendering with fallback
- Status badges with correct colors
- Guardian information display

**Personal Info Tab:**
- Editable form with current data
- Validation on field updates
- Save button with loading states
- Success/error feedback

**Academic Tab:**
- Class assignment display
- Grade level information
- Roll number management
- Academic history

**Documents Tab:**
- Document list with view links
- Upload new documents functionality
- Delete documents with confirmation
- File type validation

**Status Tab:**
- Status change dropdown
- Exit status management for non-active students
- Attendance percentage display
- Status history (if available)

### **Teacher Management Testing**

#### **Teacher Form** (`/app/components/teacher/TeacherForm.tsx`)
**Multi-tab Form Testing:**

**Basic Information Tab:**
```typescript
{
  validTeacher: {
    cniNumber: "54321-1234567-1",
    firstName: "Fatima",
    lastName: "Khan",
    gender: "Female",
    email: "fatima.khan@school.com",
    joiningDate: "2024-01-01",
    subjects: ["Mathematics", "Physics"],
    qualifications: ["MSc Mathematics"]
  }
}
```

**Education & Experience Tab:**
- Dynamic list management (add/remove entries)
- Form validation for required fields
- Date range validation
- Certificate/document upload

**Class Assignment:**
- Available classes dropdown
- Conflict detection (teacher already assigned)
- Visual feedback for assignment status

#### **Teacher Table Features**
- Employment status color coding
- Class assignment display
- Subject tags display
- Photo rendering with fallbacks

### **Class Management Testing**

#### **Class Form** (`/app/components/class/ClassForm.tsx`)
**Create/Edit Mode Testing:**

**Create Mode:**
```typescript
{
  className: "Class 6",
  classSection: "B",
  classGradeLevel: "6th"
}
// Test unique constraint validation (className + section)
```

**Edit Mode:**
- Subject management with tag interface
- Add/remove subjects dynamically
- Teacher assignment section

#### **Teacher Assignment** (`/app/components/class/TeacherAssignmentSection.tsx`)
**Assignment Testing:**
1. **Main Teacher Assignment**
   - Teacher selection dropdown
   - Conflict prevention (teacher already assigned elsewhere)
   - Visual distinction with blue theme

2. **Temporary Teacher Assignment**
   - Separate from main teacher
   - Visual distinction with green theme
   - Remove functionality

3. **Teacher Cards Display**
   - Avatar with fallback
   - Contact information
   - Subject expertise display
   - Assigned class information

### **Fee Management Testing**

#### **Fee Structure Builder** (`/app/components/Fee/feeStructure/`)
**Complex Form Testing:**
1. **Fee Components Management**
   - Add multiple fee categories
   - Amount validation (positive numbers)
   - Due date configuration
   - Late charge settings

2. **Academic Year Selection**
   - Current year default
   - Past/future year options
   - Validation against existing structures

#### **Student Fee Management** (`/app/components/Fee/studentFee/`)
**Billing & Payment Testing:**
1. **Fee Generation**
   - Bulk generation for classes
   - Individual student fee creation
   - Bill type selection (Monthly/Quarterly/One-time)

2. **Payment Processing**
   - Multiple payment modes
   - Partial payment handling
   - Receipt generation
   - Payment history display

3. **Status Management**
   - Automatic status updates
   - Overdue detection
   - Color-coded status badges

### **Attendance System Testing**

#### **Batch Attendance Form** (`/app/components/attendance/BatchAttendanceForm.tsx`)
**Bulk Operations Testing:**
1. **User Selection**
   - Class-based filtering for students
   - Teacher/staff selection
   - Date selection with validation

2. **Bulk Actions**
   - "Mark All Present" button
   - "Mark All Absent" button
   - Individual status override
   - Reason field for absent/late

3. **Form Submission**
   - Validation before submit
   - Loading states during processing
   - Success/error feedback
   - Auto-refresh data after success

#### **Attendance Table** (`/app/components/attendance/AttendanceTable.tsx`)
**Data Display & Filtering:**
1. **Dynamic Columns**
   - User type-specific columns
   - Class information for students
   - Check-in/out times display

2. **Status Styling**
   - Present → Green badge
   - Absent → Red badge
   - Late → Yellow badge
   - Leave → Blue badge

3. **Advanced Filtering**
   - Date range selection
   - User type filtering
   - Class filtering
   - Status filtering

### **Exam System Testing**

#### **Exam Form** (`/app/components/examSection/exams/ExamForm.tsx`)
**Multi-subject Exam Creation:**
1. **Basic Information**
   - Exam type selection
   - Class selection
   - Date range validation
   - Academic year

2. **Subject Scheduling**
   - Multiple subjects per exam
   - Date and time for each subject
   - Time conflict detection
   - Marks configuration

3. **Form Validation**
   - Start date < End date
   - Subject exam dates within range
   - Start time < End time
   - Positive marks validation

#### **Result Entry** (`/app/components/examSection/examResult/ExamResultForm.tsx`)
**Result Processing:**
1. **Student Result Entry**
   - Subject-wise marks entry
   - Marks validation against maximum
   - Automatic percentage calculation
   - Grade assignment

2. **Bulk Operations**
   - Class-wise result entry
   - Rank generation
   - Result publication

### **Leave Management Testing**

#### **Student Leave** (`/app/components/leave/student/`)
**Guardian Workflow:**
1. **Leave Application**
   - Student selection (for guardians with multiple children)
   - Leave type selection
   - Date range selection
   - Supporting document upload

2. **Approval Interface** (Teacher/Admin)
   - Pending leave applications list
   - Approve/reject actions
   - Comments for decisions
   - Notification to guardians

#### **Employee Leave** (`/app/components/leave/staff/`)
**Employee Workflow:**
1. **Leave Balance Display**
   - Current year balance
   - Used vs remaining leave
   - Leave type breakdown

2. **Leave Application**
   - Leave type with balance validation
   - Date selection with overlap prevention
   - Automatic day calculation

3. **Approval Workflow**
   - Multi-level approval display
   - Status tracking
   - Approval comments

---

## 🎨 UI/UX Testing

### **Responsive Design Testing**
**Breakpoints to test:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Components to validate:**
1. **Navigation Menu**
   - Hamburger menu on mobile
   - Sidebar collapse/expand
   - Role-based menu items

2. **Data Tables**
   - Horizontal scroll on small screens
   - Column hiding/showing
   - Pagination controls

3. **Forms**
   - Stacked layout on mobile
   - Input field sizing
   - Button placement

### **Theme & Styling Testing**
1. **Color Scheme Consistency**
   - Status badges (green/red/yellow/blue)
   - Role-based styling
   - Hover states
   - Focus indicators

2. **Typography**
   - Font size hierarchy
   - Readability on all screen sizes
   - Line height and spacing

### **Performance Testing**
1. **Large Dataset Rendering**
   - 1000+ student table
   - Complex fee structures
   - Attendance reports

2. **Loading States**
   - API call loading indicators
   - Skeleton screens for slow loads
   - Error state handling

---

## 🔧 Integration Testing

### **API Integration Points**
1. **Authentication Flow**
   - Login → Token storage → API calls
   - Token refresh handling
   - Auto-logout on token expiry

2. **CRUD Operations**
   - Create → Optimistic updates
   - Read → Caching strategies
   - Update → Partial updates
   - Delete → Confirmation dialogs

3. **Real-time Features**
   - Form validation with server rules
   - Dynamic dropdowns (classes, subjects)
   - Dependent field updates

### **State Management Testing**
1. **React Query Caching**
   - Query invalidation on mutations
   - Background refetching
   - Offline handling

2. **Form State Management**
   - Multi-step form data persistence
   - Unsaved changes warning
   - Form reset on cancel

---

## 📱 User Experience Testing

### **Workflow Testing**
1. **Student Admission Process**
   - Registration → Class assignment → Fee generation → Document upload

2. **Teacher Onboarding**
   - Registration → Class assignment → Subject assignment → Document verification

3. **Daily Operations**
   - Attendance marking → Daily diary entry → Leave applications

### **Error Recovery Testing**
1. **Network Failures**
   - Offline indication
   - Retry mechanisms
   - Data persistence

2. **Validation Errors**
   - Clear error messages
   - Field highlighting
   - Recovery suggestions

---

## 📋 Frontend Testing Checklist

### **Component Testing**
- [ ] All forms validate correctly
- [ ] Tables display data properly
- [ ] Modals open/close correctly
- [ ] Navigation works on all screen sizes
- [ ] Loading states show during API calls
- [ ] Error states display meaningful messages

### **User Flow Testing**
- [ ] Complete registration workflows
- [ ] Fee payment processes
- [ ] Exam result entry and viewing
- [ ] Attendance marking and reporting
- [ ] Leave application and approval

### **Role-based Testing**
- [ ] Admin sees all features
- [ ] Teacher sees class-specific data
- [ ] Student sees own data only
- [ ] Guardian sees children's data
- [ ] Proper access control enforcement

### **Data Integrity Testing**
- [ ] API responses match UI display
- [ ] Form submissions send correct data
- [ ] Updates reflect immediately
- [ ] Relationships display correctly

### **Performance Testing**
- [ ] Tables load quickly with large datasets
- [ ] Forms respond quickly to user input
- [ ] Images load with proper fallbacks
- [ ] API calls don't block UI

This comprehensive frontend testing guide ensures all user interactions, data flows, and UI components work correctly across different user roles and scenarios.