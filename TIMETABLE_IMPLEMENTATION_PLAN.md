# Timetable Management System - Implementation Plan

**Date:** 2025-10-17
**Project:** School Management System - Timetable Module
**Estimated Time:** 3-4 days (24-32 hours)

---

## 📋 Executive Summary

This document outlines the implementation plan for the Timetable Management System based on the API documentation. The implementation will follow existing codebase patterns using TanStack Query, API service builder, and component architecture.

---

## 🎯 Implementation Scope

### Phase 1: Core Timetable Features (Priority: HIGH)
1. Period Management
2. Class Subject Allocation
3. Timetable CRUD Operations
4. Schedule Queries (Student/Teacher/Class)

### Phase 2: Advanced Features (Priority: MEDIUM)
5. Timetable Exceptions (Substitutions)

### Phase 3: Future Features (Priority: LOW)
6. Timetable Constraints (Auto-generation)
7. Timetable Templates

**This plan focuses on Phase 1 & 2 only.**

---

## 📁 File Structure

```
app/
├── types/
│   └── timetable.ts                    # All TypeScript interfaces
├── services/
│   ├── timetableApi.ts                 # API service (periods, allocations, timetables)
│   ├── timetableExceptionApi.ts        # Exception/substitution API
│   └── timetableScheduleApi.ts         # Schedule query API
├── hooks/
│   ├── usePeriodQueries.ts             # Period CRUD hooks
│   ├── useAllocationQueries.ts         # Allocation CRUD hooks
│   ├── useTimetableQueries.ts          # Timetable CRUD hooks
│   ├── useExceptionQueries.ts          # Exception CRUD hooks
│   └── useScheduleQueries.ts           # Schedule query hooks
├── components/
│   └── timetable/
│       ├── periods/
│       │   ├── PeriodList.tsx          # List all periods
│       │   ├── PeriodForm.tsx          # Create/Edit period
│       │   └── PeriodCard.tsx          # Period display card
│       ├── allocations/
│       │   ├── AllocationList.tsx      # List allocations
│       │   ├── AllocationForm.tsx      # Create/Edit allocation
│       │   └── AllocationCard.tsx      # Allocation display
│       ├── timetables/
│       │   ├── TimetableList.tsx       # List timetables
│       │   ├── TimetableGrid.tsx       # Main timetable grid view
│       │   ├── TimetableForm.tsx       # Create timetable
│       │   ├── SlotEditor.tsx          # Edit individual slot
│       │   └── ConflictBanner.tsx      # Show conflicts
│       ├── schedules/
│       │   ├── MySchedule.tsx          # Student/Teacher schedule
│       │   ├── ClassSchedule.tsx       # Class schedule view
│       │   └── ScheduleCard.tsx        # Schedule display card
│       └── exceptions/
│           ├── ExceptionList.tsx       # List substitutions
│           ├── ExceptionForm.tsx       # Create substitution
│           └── SubstitutionManager.tsx # Manage substitutions
└── routes/
    └── dashboard/
        └── timetable/
            ├── timetable.tsx           # Layout wrapper
            ├── index.tsx               # Timetable dashboard
            ├── periods/
            │   ├── index.tsx           # Period list
            │   └── new.tsx             # Create period
            ├── allocations/
            │   ├── index.tsx           # Allocation list
            │   └── new.tsx             # Create allocation
            ├── timetables/
            │   ├── index.tsx           # Timetable list
            │   ├── new.tsx             # Create timetable
            │   └── $id.tsx             # View/Edit timetable
            ├── schedule/
            │   └── index.tsx           # My schedule
            └── exceptions/
                ├── index.tsx           # Exception list
                └── new.tsx             # Create exception
```

---

## 🔧 Technical Implementation Details

### 1. TypeScript Types (`app/types/timetable.ts`)

**Estimated Time:** 2 hours

```typescript
// Period Types
export interface Period {
  id: string;
  periodNumber: number;
  periodName: string;
  startTime: string;
  endTime: string;
  periodType: 'TEACHING' | 'BREAK' | 'LUNCH' | 'ASSEMBLY';
  isActive: boolean;
  durationMinutes: number;
  notes?: string;
}

export interface CreatePeriodDto {
  periodNumber: number;
  periodName: string;
  startTime: string;
  endTime: string;
  periodType?: 'TEACHING' | 'BREAK' | 'LUNCH' | 'ASSEMBLY';
  isActive?: boolean;
  durationMinutes?: number;
  notes?: string;
}

// Allocation Types
export interface ClassSubjectAllocation {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  academicYearId: string;
  periodsPerWeek: number;
  isLabSubject: boolean;
  consecutivePeriods: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// Timetable Types
export interface TimetableSlot {
  dayOfWeek: number;
  dayName?: string;
  periodNumber: number;
  periodId: string;
  periodName?: string;
  startTime?: string;
  endTime?: string;
  subjectId: string;
  subjectName?: string;
  teacherId: string;
  teacherName?: string;
  room?: string;
  isClassTeacherSlot?: boolean;
  isBreak?: boolean;
  notes?: string;
}

export interface Timetable {
  id: string;
  classId: string;
  className?: string;
  academicYearId: string;
  academicYear?: string;
  displayName: string;
  schedule: TimetableSlot[];
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';
  effectiveFrom: string;
  effectiveTo?: string;
  generationType: 'MANUAL' | 'AUTO_GENERATED';
  conflicts?: TimetableConflict[];
  createdAt: string;
  updatedAt: string;
}

// Exception Types
export interface TimetableException {
  id: string;
  timetableId: string;
  classId: string;
  className?: string;
  exceptionDate: string;
  dayOfWeek: number;
  periodNumber: number;
  originalTeacherId: string;
  originalTeacherName?: string;
  originalSubjectId: string;
  originalSubjectName?: string;
  replacementTeacherId?: string;
  replacementTeacherName?: string;
  replacementSubjectId?: string;
  replacementSubjectName?: string;
  replacementRoom?: string;
  exceptionType: 'SUBSTITUTION' | 'CANCELLATION' | 'RESCHEDULE';
  reason: string;
  isApproved: boolean;
  notes?: string;
  createdAt: string;
}

// Schedule Types
export interface StudentSchedule {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  schedule: TimetableSlot[];
}

export interface TeacherSchedule {
  teacherId: string;
  teacherName: string;
  academicYear: string;
  classesByDay: {
    dayOfWeek: number;
    dayName: string;
    slots: TimetableSlot[];
  }[];
}
```

---

### 2. API Services

**Estimated Time:** 4 hours

#### `app/services/timetableApi.ts`

```typescript
import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type { 
  Period, 
  CreatePeriodDto, 
  ClassSubjectAllocation,
  CreateAllocationDto,
  Timetable,
  CreateTimetableDto,
  UpdateTimetableDto
} from '~/types/timetable';

// Period Service
export const basePeriodService = createEntityService<Period, CreatePeriodDto, Partial<Period>>(
  api,
  '/timetable/periods'
);

export const periodApi = {
  ...basePeriodService,
  activate: async (id: string) => {
    const response = await api.put(`/timetable/periods/${id}/activate`);
    return response.data;
  },
  deactivate: async (id: string) => {
    const response = await api.put(`/timetable/periods/${id}/deactivate`);
    return response.data;
  }
};

// Allocation Service
export const baseAllocationService = createEntityService<ClassSubjectAllocation, CreateAllocationDto, Partial<ClassSubjectAllocation>>(
  api,
  '/timetable/allocations'
);

export const allocationApi = {
  ...baseAllocationService,
  getByClass: async (classId: string, academicYearId?: string) => {
    const response = await api.get(`/timetable/allocations/class/${classId}`, {
      params: { academicYearId }
    });
    return response.data;
  },
  getByTeacher: async (teacherId: string, academicYearId?: string) => {
    const response = await api.get(`/timetable/allocations/teacher/${teacherId}`, {
      params: { academicYearId }
    });
    return response.data;
  }
};

// Timetable Service
export const baseTimetableService = createEntityService<Timetable, CreateTimetableDto, UpdateTimetableDto>(
  api,
  '/timetables'
);

export const timetableApi = {
  ...baseTimetableService,
  getByClass: async (classId: string, academicYearId?: string) => {
    const response = await api.get(`/timetables/class/${classId}`, {
      params: { academicYearId }
    });
    return response.data;
  },
  addSlot: async (id: string, slot: TimetableSlot) => {
    const response = await api.post(`/timetables/${id}/slots`, { slot });
    return response.data;
  },
  updateSlot: async (id: string, slotIndex: number, slot: TimetableSlot) => {
    const response = await api.put(`/timetables/${id}/slots`, { slotIndex, slot });
    return response.data;
  },
  removeSlot: async (id: string, slotIndex: number) => {
    const response = await api.delete(`/timetables/${id}/slots`, { data: { slotIndex } });
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/timetables/${id}/status`, { status });
    return response.data;
  },
  approve: async (id: string, notes?: string) => {
    const response = await api.put(`/timetables/${id}/approve`, { notes });
    return response.data;
  },
  getConflicts: async (id: string) => {
    const response = await api.get(`/timetables/${id}/conflicts`);
    return response.data;
  }
};
```

---

### 3. TanStack Query Hooks

**Estimated Time:** 4 hours

#### `app/hooks/usePeriodQueries.ts`

```typescript
import { createQueryHooks } from './queryHookFactory';
import { periodApi, basePeriodService } from '~/services/timetableApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const basePeriodHooks = createQueryHooks('periods', basePeriodService);

export const usePeriods = basePeriodHooks.useEntities;
export const usePeriod = basePeriodHooks.useEntity;
export const useCreatePeriod = basePeriodHooks.useCreateEntity;
export const useUpdatePeriod = basePeriodHooks.useUpdateEntity;
export const useDeletePeriod = basePeriodHooks.useDeleteEntity;

export const useActivatePeriod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => periodApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.lists() });
    }
  });
};
```

---

### 4. Components

**Estimated Time:** 12 hours

#### Key Components to Build:

1. **PeriodList.tsx** - Table with period management
2. **TimetableGrid.tsx** - Main 5x8 grid for timetable
3. **SlotEditor.tsx** - Modal for editing slots
4. **MySchedule.tsx** - Student/Teacher schedule view
5. **SubstitutionManager.tsx** - Handle teacher substitutions

---

### 5. Routes

**Estimated Time:** 3 hours

Add to `app/routes.ts`:

```typescript
route("timetable", "routes/dashboard/timetable/timetable.tsx", [
  index("routes/dashboard/timetable/index.tsx"),
  route("periods", "routes/dashboard/timetable/periods/index.tsx"),
  route("periods/new", "routes/dashboard/timetable/periods/new.tsx"),
  route("allocations", "routes/dashboard/timetable/allocations/index.tsx"),
  route("allocations/new", "routes/dashboard/timetable/allocations/new.tsx"),
  route("timetables", "routes/dashboard/timetable/timetables/index.tsx"),
  route("timetables/new", "routes/dashboard/timetable/timetables/new.tsx"),
  route("timetables/:id", "routes/dashboard/timetable/timetables/$id.tsx"),
  route("schedule", "routes/dashboard/timetable/schedule/index.tsx"),
  route("exceptions", "routes/dashboard/timetable/exceptions/index.tsx"),
  route("exceptions/new", "routes/dashboard/timetable/exceptions/new.tsx"),
])
```

---

## ⏱️ Time Estimation Breakdown

| Task | Estimated Time | Priority |
|------|----------------|----------|
| **1. TypeScript Types** | 2 hours | HIGH |
| **2. API Services** | 4 hours | HIGH |
| **3. TanStack Query Hooks** | 4 hours | HIGH |
| **4. Period Management UI** | 3 hours | HIGH |
| **5. Allocation Management UI** | 3 hours | HIGH |
| **6. Timetable Grid Component** | 6 hours | HIGH |
| **7. Schedule Views** | 3 hours | HIGH |
| **8. Exception/Substitution UI** | 4 hours | MEDIUM |
| **9. Routes & Navigation** | 3 hours | HIGH |
| **10. Testing & Bug Fixes** | 4 hours | HIGH |
| **TOTAL** | **36 hours** | **~4-5 days** |

---

## 🎯 Implementation Strategy

### Day 1: Foundation (8 hours)
- ✅ Create TypeScript types
- ✅ Build API services
- ✅ Create TanStack Query hooks
- ✅ Set up routes

### Day 2: Period & Allocation (8 hours)
- ✅ Period List & Form components
- ✅ Allocation List & Form components
- ✅ Test CRUD operations

### Day 3: Timetable Grid (8 hours)
- ✅ Timetable Grid component
- ✅ Slot Editor modal
- ✅ Conflict detection UI
- ✅ Timetable CRUD operations

### Day 4: Schedules & Exceptions (8 hours)
- ✅ My Schedule view
- ✅ Class Schedule view
- ✅ Exception/Substitution management
- ✅ Integration testing

### Day 5: Polish & Testing (4 hours)
- ✅ Bug fixes
- ✅ UI polish
- ✅ End-to-end testing
- ✅ Documentation

---

## 🚀 Key Features to Implement

### Phase 1 (Must Have)
1. ✅ Period Management (CRUD)
2. ✅ Class Subject Allocation (CRUD)
3. ✅ Manual Timetable Creation
4. ✅ Timetable Grid View (5 days x 8 periods)
5. ✅ Add/Edit/Remove Slots
6. ✅ Conflict Detection
7. ✅ Student Schedule View
8. ✅ Teacher Schedule View
9. ✅ Class Schedule View

### Phase 2 (Should Have)
10. ✅ Teacher Substitutions
11. ✅ Exception Management
12. ✅ Timetable Status Management (Draft/Active)
13. ✅ Timetable Approval Workflow

### Phase 3 (Nice to Have - Future)
14. ⏳ Auto-generation (Constraints)
15. ⏳ Templates
16. ⏳ Bulk Operations

---

## 🔄 Code Reusability

### Existing Patterns to Follow:

1. **API Service Builder** ✅
   - Use `createEntityService` for base CRUD
   - Extend with custom methods

2. **Query Hook Factory** ✅
   - Use `createQueryHooks` for standard hooks
   - Add custom hooks for specific queries

3. **Component Patterns** ✅
   - List components (Table with search/filter)
   - Form components (Create/Edit modals)
   - Detail components (View with tabs)

4. **Route Structure** ✅
   - Layout wrapper
   - Index (list)
   - New (create)
   - $id (detail/edit)

---

## 📊 Data Flow Example

### Creating a Timetable:

```
1. Admin navigates to /dashboard/timetable/timetables/new
2. Select Class & Academic Year
3. Fetch periods (usePeriods)
4. Fetch allocations for class (useAllocationsByClass)
5. Display empty 5x8 grid
6. Admin clicks on a cell (e.g., Monday Period 1)
7. SlotEditor modal opens
8. Select subject from allocations
9. Auto-populate teacher from allocation
10. Add room number
11. Save slot (useAddSlot mutation)
12. Grid updates with new slot
13. Check conflicts (useConflicts query)
14. If conflicts, show warning banner
15. Continue adding slots
16. Change status to ACTIVE (useUpdateTimetableStatus)
17. Timetable is now live
```

---

## 🎨 UI/UX Considerations

### Timetable Grid:
- 5 columns (Monday-Friday)
- 8 rows (Periods 1-8)
- Color-coded by subject
- Hover shows teacher name
- Click to edit
- Drag-and-drop (future enhancement)

### Conflict Indicators:
- Red border on conflicting slots
- Warning banner at top
- Tooltip with conflict details

### Mobile Responsiveness:
- Horizontal scroll for grid on mobile
- Stacked view for schedules
- Simplified forms

---

## ✅ Approval Checklist

Before starting implementation, confirm:

- [ ] API endpoints are ready and tested
- [ ] Academic Year module exists
- [ ] Class module exists
- [ ] Subject module exists
- [ ] Teacher module exists
- [ ] User has reviewed this plan
- [ ] Time estimate is acceptable
- [ ] Phased approach is approved

---

## 📝 Notes

1. **No Code Duplication**: All services use `createEntityService` and `createQueryHooks`
2. **Consistent Patterns**: Follow existing student/teacher/class patterns
3. **TanStack Query**: All data fetching uses React Query
4. **Type Safety**: Full TypeScript coverage
5. **Mobile First**: Responsive design from the start

---

## 🤝 Next Steps

**After Approval:**
1. Create task list with subtasks
2. Start with Day 1 (Foundation)
3. Daily progress updates
4. Test each module before moving to next
5. Final review and deployment

---

**Estimated Total Time: 36 hours (4-5 days)**
**Complexity: Medium-High**
**Risk Level: Low (following established patterns)**

---

**Ready to proceed? Please approve this plan and I'll start implementation!** 🚀

