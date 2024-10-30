# Timetable Module - Frontend/Backend Integration Analysis

**Date:** 2025-10-17  
**Status:** Analysis Complete - Ready for Implementation  
**Backend Version:** v1.1 (Configurable Work Week)  
**Frontend Status:** Partially Implemented (Day 3 Complete)

---

## 📊 Executive Summary

### Backend Status (from nest-app):
✅ **Phase 1 & 2 Complete** (40% overall)
- All 6 schemas created with proper indexes
- All 9 DTOs with validation
- All 8 services implemented
- All 7 controllers created (~990 lines)
- Module setup complete
- **Supports configurable 5-day or 6-day work weeks**
- **Uses 0-6 day format (JavaScript Date standard)**

### Frontend Status (from my-school-app):
✅ **Day 1-3 Complete** (50% overall)
- Types defined (`app/types/timetable.ts`)
- API services created (`app/services/timetableApi.ts`)
- TanStack Query hooks (`app/hooks/useTimetableQueries.ts`)
- Period Management UI ✅
- Allocations UI ✅
- Timetable Grid UI ✅
- **Uses hardcoded 1-5 day format (Mon-Fri only)**

---

## 🚨 CRITICAL DISCREPANCIES

### 1. **Day Format Mismatch** (BREAKING CHANGE)

| Aspect | Backend (nest-app) | Frontend (my-school-app) | Impact |
|--------|-------------------|-------------------------|--------|
| **Day Range** | 0-6 (Sun-Sat) | 1-5 (Mon-Fri) | ❌ CRITICAL |
| **Day 0** | Sunday | Not supported | ❌ BREAKS 6-day schools |
| **Day 6** | Saturday | Not supported | ❌ BREAKS 6-day schools |
| **Standard** | JavaScript Date.getDay() | Custom 1-5 | ❌ Non-standard |

**Backend Implementation:**
```typescript
// timetable.schema.ts:7
@Prop({ required: true, min: 0, max: 6 })
dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
```

**Frontend Implementation:**
```typescript
// TimetableGrid.tsx:15-21
const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
]; // ❌ Missing Sunday (0) and Saturday (6)
```

**Required Fix:**
```typescript
// ✅ CORRECT - Matches backend
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

---

### 2. **API Endpoint Paths** (CONFIRMED CORRECT ✅)

| Resource | Backend Path | Frontend Path | Status |
|----------|-------------|---------------|--------|
| Periods | `/timetable/periods` | `/timetable/periods` | ✅ MATCH |
| Allocations | `/timetable/allocations` | `/timetable/allocations` | ✅ MATCH |
| Timetables | `/timetables` | `/timetables` | ✅ MATCH |
| Exceptions | `/timetable/exceptions` | Not implemented | ⚠️ TODO |
| Schedules | `/timetable/schedules` | Not implemented | ⚠️ TODO |

**Conclusion:** API paths are correct! No changes needed.

---

### 3. **Working Days Configuration**

**Backend Approach:**
- Uses existing `tenant.leavePolicy.weeklyOffDays` (already in UI at `/dashboard/settings`)
- Example: `weeklyOffDays: [0, 6]` = Sunday & Saturday off (5-day week)
- Example: `weeklyOffDays: [0]` = Sunday off only (6-day week Mon-Sat)
- Validates slots against working days
- Returns empty schedule for off days

**Frontend Current State:**
- ❌ Hardcoded 5-day week (Mon-Fri)
- ❌ No integration with `tenant.leavePolicy.weeklyOffDays`
- ❌ Grid always shows 5 columns
- ❌ Cannot create Saturday slots

**Required Frontend Changes:**
1. Fetch `tenant.leavePolicy.weeklyOffDays` from settings
2. Calculate working days: `[0,1,2,3,4,5,6].filter(d => !weeklyOffDays.includes(d))`
3. Dynamically render grid columns based on working days
4. Filter DAYS array to show only working days

---

### 4. **Conflicts Endpoint** (404 Error)

**Backend Status:** ✅ Implemented at `/timetables/:id/conflicts`

**Frontend Status:** 
- ✅ API call exists in `timetableApi.ts:167`
- ✅ Hook exists in `useTimetableQueries.ts:35`
- ❌ Currently returns 404 (was thought to be missing)

**Root Cause:** Backend endpoint exists! The 404 might be due to:
- Timetable not having conflicts calculated yet
- Route not registered properly in backend
- Need to verify backend route is active

**Action:** Test the endpoint with Postman/curl before assuming it's broken.

---

## 📋 DETAILED COMPARISON

### Type Definitions

| Field | Backend DTO | Frontend Type | Match? |
|-------|------------|---------------|--------|
| `Period.periodNumber` | `number` | `number` | ✅ |
| `Period.periodType` | `enum` | `type` | ✅ |
| `TimetableSlot.dayOfWeek` | `0-6` | `1-5` | ❌ |
| `TimetableSlot.dayName` | Optional (added by backend) | Optional | ✅ |
| `Timetable.status` | `enum` | `type` | ✅ |
| `Timetable.conflicts` | `array` | `array` | ✅ |

**Conclusion:** Types are 95% aligned. Only `dayOfWeek` range needs fixing.

---

### API Service Methods

| Method | Backend Endpoint | Frontend Implementation | Status |
|--------|-----------------|------------------------|--------|
| **Periods** |
| Create | `POST /timetable/periods` | ✅ `periodApi.create()` | ✅ |
| Get All | `GET /timetable/periods?activeOnly=true` | ✅ `periodApi.getAll(activeOnly)` | ✅ |
| Update | `PUT /timetable/periods/:id` | ✅ `periodApi.update()` | ✅ |
| Activate | `PUT /timetable/periods/:id/activate` | ✅ `periodApi.activate()` | ✅ |
| Delete | `DELETE /timetable/periods/:id` | ✅ `periodApi.delete()` | ✅ |
| **Allocations** |
| Create | `POST /timetable/allocations` | ✅ `allocationApi.create()` | ✅ |
| Get by Class | `GET /timetable/allocations/class/:id` | ✅ `allocationApi.getByClass()` | ✅ |
| Get by Teacher | `GET /timetable/allocations/teacher/:id` | ✅ `allocationApi.getByTeacher()` | ✅ |
| Update | `PUT /timetable/allocations/:id` | ✅ `allocationApi.update()` | ✅ |
| Activate | `PUT /timetable/allocations/:id/activate` | ✅ `allocationApi.activate()` | ✅ |
| Delete | `DELETE /timetable/allocations/:id` | ✅ `allocationApi.delete()` | ✅ |
| **Timetables** |
| Create | `POST /timetables` | ✅ `timetableApi.create()` | ✅ |
| Get All | `GET /timetables?classId=&status=` | ✅ `timetableApi.getAll(params)` | ✅ |
| Get by Class | `GET /timetables/class/:id` | ✅ `timetableApi.getByClass()` | ✅ |
| Add Slot | `POST /timetables/:id/slots` | ✅ `timetableApi.addSlot()` | ✅ |
| Update Slot | `PUT /timetables/:id/slots` | ✅ `timetableApi.updateSlot()` | ✅ |
| Remove Slot | `DELETE /timetables/:id/slots` | ✅ `timetableApi.removeSlot()` | ✅ |
| Update Status | `PUT /timetables/:id/status` | ✅ `timetableApi.updateStatus()` | ✅ |
| Approve | `PUT /timetables/:id/approve` | ✅ `timetableApi.approve()` | ✅ |
| Get Conflicts | `GET /timetables/:id/conflicts` | ✅ `timetableApi.getConflicts()` | ✅ |
| **Schedules** (NOT IMPLEMENTED IN FRONTEND) |
| My Schedule | `GET /timetable/schedules/my-schedule` | ❌ Missing | ⚠️ TODO |
| Student Schedule | `GET /timetable/schedules/student/:id` | ❌ Missing | ⚠️ TODO |
| Teacher Schedule | `GET /timetable/schedules/teacher/:id` | ❌ Missing | ⚠️ TODO |
| Class Schedule | `GET /timetable/schedules/class/:id` | ❌ Missing | ⚠️ TODO |
| **Exceptions** (NOT IMPLEMENTED IN FRONTEND) |
| Create Exception | `POST /timetable/exceptions` | ❌ Missing | ⚠️ TODO |
| Get Exceptions | `GET /timetable/exceptions` | ❌ Missing | ⚠️ TODO |
| Get by Date | `GET /timetable/exceptions/date/:date` | ❌ Missing | ⚠️ TODO |
| Update Exception | `PUT /timetable/exceptions/:id` | ❌ Missing | ⚠️ TODO |
| Approve Exception | `PUT /timetable/exceptions/:id/approve` | ❌ Missing | ⚠️ TODO |
| Delete Exception | `DELETE /timetable/exceptions/:id` | ❌ Missing | ⚠️ TODO |

**Summary:**
- ✅ Periods: 100% implemented
- ✅ Allocations: 100% implemented
- ✅ Timetables: 100% implemented
- ❌ Schedules: 0% implemented (4 endpoints missing)
- ❌ Exceptions: 0% implemented (6 endpoints missing)

---

## 🔧 REQUIRED CHANGES

### Priority 1: CRITICAL (Must Fix Before Testing)

#### 1.1 Update Day Format in Frontend

**Files to Change:**
- `app/components/timetable/timetables/TimetableGrid.tsx:15-21`
- `app/components/timetable/timetables/SlotEditor.tsx` (if it has day selection)

**Change:**
```typescript
// BEFORE
const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
];

// AFTER
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

#### 1.2 Implement Dynamic Working Days

**Files to Change:**
- `app/components/timetable/timetables/TimetableGrid.tsx`

**Add:**
```typescript
import { useLeavePolicy } from '~/hooks/useTenantSettings';

export function TimetableGrid({ timetable, readOnly = false }: TimetableGridProps) {
  const { data: leavePolicy } = useLeavePolicy();
  
  const workingDays = useMemo(() => {
    const weeklyOffDays = leavePolicy?.weeklyOffDays || [0, 6]; // Default: Sat-Sun off
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    return allDays.filter(day => !weeklyOffDays.includes(day));
  }, [leavePolicy]);

  const displayDays = useMemo(() => {
    return DAYS.filter(day => workingDays.includes(day.value));
  }, [workingDays]);

  // Use displayDays instead of DAYS in the grid rendering
}
```

---

### Priority 2: HIGH (Needed for Full Functionality)

#### 2.1 Implement Schedule APIs

**Create:** `app/services/scheduleApi.ts`

```typescript
import api from './apiClient';
import type { StudentSchedule, TeacherSchedule, ClassSchedule, ScheduleQueryParams } from '~/types/timetable';

export const scheduleApi = {
  getMySchedule: async (params?: ScheduleQueryParams) => {
    const response = await api.get<StudentSchedule | TeacherSchedule>(
      '/timetable/schedules/my-schedule',
      { params }
    );
    return response.data;
  },

  getStudentSchedule: async (studentId: string, params?: ScheduleQueryParams) => {
    const response = await api.get<StudentSchedule>(
      `/timetable/schedules/student/${studentId}`,
      { params }
    );
    return response.data;
  },

  getTeacherSchedule: async (teacherId: string, params?: ScheduleQueryParams) => {
    const response = await api.get<TeacherSchedule>(
      `/timetable/schedules/teacher/${teacherId}`,
      { params }
    );
    return response.data;
  },

  getClassSchedule: async (classId: string, params?: ScheduleQueryParams) => {
    const response = await api.get<ClassSchedule>(
      `/timetable/schedules/class/${classId}`,
      { params }
    );
    return response.data;
  },
};
```

**Create:** `app/hooks/useScheduleQueries.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '~/services/scheduleApi';
import type { ScheduleQueryParams } from '~/types/timetable';

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

### Priority 3: MEDIUM (Nice to Have)

#### 3.1 Implement Exception/Substitution APIs

**Create:** `app/services/exceptionApi.ts`
**Create:** `app/hooks/useExceptionQueries.ts`
**Create:** UI components for managing substitutions

---

## 📝 IMPLEMENTATION PLAN & TODO LIST

### Phase 1: Fix Critical Issues (2-3 hours)

- [ ] Update `DAYS` constant to 0-6 format in `TimetableGrid.tsx`
- [ ] Implement dynamic working days logic
- [ ] Test with 5-day and 6-day configurations

### Phase 2: Implement Schedule Views (4-5 hours)

- [ ] Create `scheduleApi.ts` and `useScheduleQueries.ts`
- [ ] Build "My Schedule" page
- [ ] Build Student/Teacher/Class schedule views

### Phase 3: Implement Exceptions (5-6 hours)

- [ ] Create exception API service and hooks
- [ ] Build substitution management UI
- [ ] Integrate exceptions into schedule views

### Phase 4: Testing (4-5 hours)

- [ ] End-to-end testing
- [ ] Error handling
- [ ] Performance testing
- [ ] UI/UX polish

---

## 🎯 SUMMARY

### What's Working ✅
- Period Management (100%)
- Allocations (100%)
- Timetable CRUD (90%)
- API endpoints aligned

### What Needs Fixing ❌
- Day format (1-5 → 0-6) - **CRITICAL**
- Dynamic working days - **CRITICAL**
- Schedule views - **HIGH**
- Exceptions - **HIGH**

**Total Estimated Time:** 15-20 hours development + 5-6 hours testing

**Ready to proceed once you approve the plan!** 🎉


