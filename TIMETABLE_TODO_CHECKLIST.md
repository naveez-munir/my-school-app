# Timetable Integration - TODO Checklist

**Date:** 2025-10-17  
**Status:** Ready for Implementation  
**Estimated Total Time:** 15-20 hours

---

## 🚨 CRITICAL FIXES (Must Do First)

### ✅ Task 1: Fix Day Format (0-6 instead of 1-5)

**Priority:** 🔴 CRITICAL  
**Time:** 30 minutes  
**Files:**
- `app/components/timetable/timetables/TimetableGrid.tsx:15-21`

**Change:**
```typescript
// BEFORE (WRONG - Only Mon-Fri)
const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
];

// AFTER (CORRECT - Sun-Sat, matches backend)
const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];
```

**Why:** Backend uses 0-6 (JavaScript Date standard). Frontend currently uses 1-5 which breaks 6-day schools.

---

### ✅ Task 2: Implement Dynamic Working Days

**Priority:** 🔴 CRITICAL  
**Time:** 1-2 hours  
**Files:**
- `app/components/timetable/timetables/TimetableGrid.tsx`

**Add:**
```typescript
import { useLeavePolicy } from '~/hooks/useTenantSettings';

export function TimetableGrid({ timetable, readOnly = false }: TimetableGridProps) {
  const { data: leavePolicy } = useLeavePolicy();
  
  // Calculate working days from weekly off days
  const workingDays = useMemo(() => {
    const weeklyOffDays = leavePolicy?.weeklyOffDays || [0, 6]; // Default: Sat-Sun off
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    return allDays.filter(day => !weeklyOffDays.includes(day));
  }, [leavePolicy]);

  // Filter DAYS to show only working days
  const displayDays = useMemo(() => {
    return DAYS.filter(day => workingDays.includes(day.value));
  }, [workingDays]);

  // Use displayDays instead of DAYS in grid rendering
  return (
    <div className="grid grid-cols-[auto_repeat({displayDays.length},1fr)]">
      {/* Render displayDays.length columns instead of hardcoded 5 */}
    </div>
  );
}
```

**Why:** Grid must dynamically show 5 or 6 columns based on school's work week configuration.

---

### ✅ Task 3: Test Critical Fixes

**Priority:** 🔴 CRITICAL  
**Time:** 1 hour

**Test Cases:**

1. **5-Day School (Mon-Fri)**
   - Set `weeklyOffDays: [0, 6]` in `/dashboard/settings`
   - Create timetable → Grid should show 5 columns (Mon-Fri)
   - Try adding Sunday slot → Should fail with error
   - Try adding Saturday slot → Should fail with error

2. **6-Day School (Mon-Sat)**
   - Set `weeklyOffDays: [0]` in settings
   - Create timetable → Grid should show 6 columns (Mon-Sat)
   - Add Saturday Period 1 → Should succeed
   - Try adding Sunday slot → Should fail

3. **6-Day School (Sun-Fri)**
   - Set `weeklyOffDays: [6]` in settings
   - Create timetable → Grid should show 6 columns (Sun-Fri)
   - Add Sunday Period 1 → Should succeed
   - Try adding Saturday slot → Should fail

---

## 📅 SCHEDULE VIEWS (High Priority)

### ✅ Task 4: Create Schedule API Service

**Priority:** 🟡 HIGH  
**Time:** 1 hour  
**File:** `app/services/scheduleApi.ts` (NEW)

**Implement:**
```typescript
export const scheduleApi = {
  getMySchedule: async (params?: ScheduleQueryParams) => {
    const response = await api.get('/timetable/schedules/my-schedule', { params });
    return response.data;
  },
  
  getStudentSchedule: async (studentId: string, params?: ScheduleQueryParams) => {
    const response = await api.get(`/timetable/schedules/student/${studentId}`, { params });
    return response.data;
  },
  
  getTeacherSchedule: async (teacherId: string, params?: ScheduleQueryParams) => {
    const response = await api.get(`/timetable/schedules/teacher/${teacherId}`, { params });
    return response.data;
  },
  
  getClassSchedule: async (classId: string, params?: ScheduleQueryParams) => {
    const response = await api.get(`/timetable/schedules/class/${classId}`, { params });
    return response.data;
  },
};
```

---

### ✅ Task 5: Create Schedule Query Hooks

**Priority:** 🟡 HIGH  
**Time:** 30 minutes  
**File:** `app/hooks/useScheduleQueries.ts` (NEW)

**Implement:**
```typescript
export const useMySchedule = (params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: ['my-schedule', params],
    queryFn: () => scheduleApi.getMySchedule(params),
  });
};

export const useStudentSchedule = (studentId: string, params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: ['student-schedule', studentId, params],
    queryFn: () => scheduleApi.getStudentSchedule(studentId, params),
    enabled: !!studentId,
  });
};

export const useTeacherSchedule = (teacherId: string, params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: ['teacher-schedule', teacherId, params],
    queryFn: () => scheduleApi.getTeacherSchedule(teacherId, params),
    enabled: !!teacherId,
  });
};

export const useClassSchedule = (classId: string, params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: ['class-schedule', classId, params],
    queryFn: () => scheduleApi.getClassSchedule(classId, params),
    enabled: !!classId,
  });
};
```

---

### ✅ Task 6: Create "My Schedule" Page

**Priority:** 🟡 HIGH  
**Time:** 2 hours  
**File:** `app/routes/dashboard/timetable/my-schedule.tsx` (NEW)

**Features:**
- Display current user's schedule (auto-detects student or teacher)
- Date picker for specific day
- Week view toggle
- Shows exceptions/substitutions

---

### ✅ Task 7: Create Schedule View Components

**Priority:** 🟡 HIGH  
**Time:** 2-3 hours  
**Files:**
- `app/routes/dashboard/timetable/schedules/student/$id.tsx` (NEW)
- `app/routes/dashboard/timetable/schedules/teacher/$id.tsx` (NEW)
- `app/routes/dashboard/timetable/schedules/class/$id.tsx` (NEW)

**Features:**
- Admin can view any student/teacher/class schedule
- Selector for choosing student/teacher/class
- Date range picker
- Print-friendly view
- Export to PDF

---

## 🔄 EXCEPTIONS/SUBSTITUTIONS (High Priority)

### ✅ Task 8: Create Exception API Service

**Priority:** 🟡 HIGH  
**Time:** 1 hour  
**File:** `app/services/exceptionApi.ts` (NEW)

**Implement:**
```typescript
export const exceptionApi = {
  create: async (dto: CreateExceptionDto) => { ... },
  getAll: async (params?: ExceptionQueryParams) => { ... },
  getByDate: async (date: string, classId?: string) => { ... },
  getByTimetable: async (timetableId: string) => { ... },
  update: async (id: string, dto: UpdateExceptionDto) => { ... },
  approve: async (id: string, notes?: string) => { ... },
  delete: async (id: string) => { ... },
};
```

---

### ✅ Task 9: Create Exception Query Hooks

**Priority:** 🟡 HIGH  
**Time:** 30 minutes  
**File:** `app/hooks/useExceptionQueries.ts` (NEW)

---

### ✅ Task 10: Create Exception Management UI

**Priority:** 🟡 HIGH  
**Time:** 3-4 hours  
**Files:**
- `app/components/timetable/exceptions/ExceptionList.tsx` (NEW)
- `app/components/timetable/exceptions/SubstitutionForm.tsx` (NEW)
- `app/routes/dashboard/timetable/exceptions/index.tsx` (NEW)

**Features:**
- List all exceptions with filters (date, class, status)
- Create substitution (select date, period, substitute teacher)
- Approve/reject exceptions
- Suggest available substitute teachers
- Visual indicator for substituted periods in schedules

---

## 🧪 TESTING (Must Do)

### ✅ Task 11: Backend Verification

**Priority:** 🔴 CRITICAL  
**Time:** 1 hour

**Verify:**
- [ ] `/timetable/periods` endpoints work
- [ ] `/timetable/allocations` endpoints work
- [ ] `/timetables` CRUD works
- [ ] `/timetables/:id/conflicts` returns data (not 404)
- [ ] `/timetable/schedules/my-schedule` works
- [ ] `/timetable/exceptions` endpoints work
- [ ] Day validation rejects off days (e.g., Sunday when `weeklyOffDays: [0]`)

---

### ✅ Task 12: Frontend Integration Testing

**Priority:** 🔴 CRITICAL  
**Time:** 2-3 hours

**Test:**
- [ ] Period management (create, edit, delete)
- [ ] Allocation management (create, edit, delete)
- [ ] Timetable creation with dynamic working days
- [ ] Slot add/edit/delete
- [ ] Conflict detection
- [ ] Status workflow (DRAFT → ACTIVE)
- [ ] My Schedule view (student and teacher)
- [ ] Admin schedule views
- [ ] Exception creation and approval
- [ ] Schedule shows substitutions correctly

---

## 📊 PROGRESS TRACKING

| Task | Priority | Time | Status |
|------|----------|------|--------|
| 1. Fix Day Format | 🔴 CRITICAL | 30m | ⏳ Pending |
| 2. Dynamic Working Days | 🔴 CRITICAL | 1-2h | ⏳ Pending |
| 3. Test Critical Fixes | 🔴 CRITICAL | 1h | ⏳ Pending |
| 4. Schedule API Service | 🟡 HIGH | 1h | ⏳ Pending |
| 5. Schedule Query Hooks | 🟡 HIGH | 30m | ⏳ Pending |
| 6. My Schedule Page | 🟡 HIGH | 2h | ⏳ Pending |
| 7. Schedule View Components | 🟡 HIGH | 2-3h | ⏳ Pending |
| 8. Exception API Service | 🟡 HIGH | 1h | ⏳ Pending |
| 9. Exception Query Hooks | 🟡 HIGH | 30m | ⏳ Pending |
| 10. Exception Management UI | 🟡 HIGH | 3-4h | ⏳ Pending |
| 11. Backend Verification | 🔴 CRITICAL | 1h | ⏳ Pending |
| 12. Frontend Integration Testing | 🔴 CRITICAL | 2-3h | ⏳ Pending |

**Total Estimated Time:** 15-20 hours

---

## 🎯 RECOMMENDED WORKFLOW

### Day 1 (3-4 hours)
1. ✅ Task 1: Fix day format (30m)
2. ✅ Task 2: Dynamic working days (1-2h)
3. ✅ Task 3: Test critical fixes (1h)
4. ✅ Task 11: Backend verification (1h)

### Day 2 (4-5 hours)
5. ✅ Task 4: Schedule API service (1h)
6. ✅ Task 5: Schedule query hooks (30m)
7. ✅ Task 6: My Schedule page (2h)
8. ✅ Task 7: Schedule view components (2-3h)

### Day 3 (5-6 hours)
9. ✅ Task 8: Exception API service (1h)
10. ✅ Task 9: Exception query hooks (30m)
11. ✅ Task 10: Exception management UI (3-4h)

### Day 4 (2-3 hours)
12. ✅ Task 12: Frontend integration testing (2-3h)
13. ✅ Bug fixes and polish

---

## ✅ COMPLETION CRITERIA

**Module is complete when:**
- [ ] Grid dynamically shows 5 or 6 columns based on work week
- [ ] Can create timetables for both 5-day and 6-day schools
- [ ] Students can view their schedule
- [ ] Teachers can view their schedule (all classes)
- [ ] Admin can view any student/teacher/class schedule
- [ ] Admin can create and approve substitutions
- [ ] Schedules show substitutions correctly
- [ ] All tests pass
- [ ] No console errors
- [ ] Mobile responsive

**Ready to start implementation!** 🚀


