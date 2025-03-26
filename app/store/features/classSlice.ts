import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CreateClassDto, UpdateClassDto, ClassState } from '~/types/class';
import { classApi } from '~/services/classApi';

const initialState: ClassState = {
  classes: [],
  currentClass: null,
  loading: false,
  error: null
};

export const fetchClasses = createAsyncThunk(
  'classes/fetchAll',
  async () => {
    const response = await classApi.getAll();
    return response;
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchById',
  async (id: string) => {
    const response = await classApi.getById(id);
    return response;
  }
);

export const createClass = createAsyncThunk(
  'classes/create',
  async (data: CreateClassDto) => {
    const response = await classApi.create(data);
    return response;
  }
);

export const updateClass = createAsyncThunk(
  'classes/update',
  async ({ id, data }: { id: string; data: UpdateClassDto }) => {
    const response = await classApi.update(id, data);
    return response;
  }
);

export const deleteClass = createAsyncThunk(
  'classes/delete',
  async (id: string) => {
    await classApi.delete(id);
    return id;
  }
);

export const assignTeacher = createAsyncThunk(
  'classes/assignTeacher',
  async ({ classId, teacherId }: { classId: string; teacherId: string }) => {
    const response = await classApi.assignTeacher(classId, teacherId);
    return response;
  }
);

export const removeTeacher = createAsyncThunk(
  'classes/removeTeacher',
  async (classId: string) => {
    const response = await classApi.removeTeacher(classId);
    return response;
  }
);

export const assignTempTeacher = createAsyncThunk(
  'classes/assignTempTeacher',
  async ({ classId, teacherId }: { classId: string; teacherId: string }) => {
    const response = await classApi.assignTempTeacher(classId, teacherId);
    return response;
  }
);

export const removeTempTeacher = createAsyncThunk(
  'classes/removeTempTeacher',
  async (classId: string) => {
    const response = await classApi.removeTempTeacher(classId);
    return response;
  }
);

export const addSubjects = createAsyncThunk(
  'classes/addSubjects',
  async ({ classId, subjectIds }: { classId: string; subjectIds: string[] }) => {
    const response = await classApi.addSubjects(classId, subjectIds);
    return response;
  }
);

export const removeSubjects = createAsyncThunk(
  'classes/removeSubjects',
  async ({ classId, subjectIds }: { classId: string; subjectIds: string[] }) => {
    const response = await classApi.removeSubjects(classId, subjectIds);
    return response;
  }
);

export const fetchClassesByGradeLevel = createAsyncThunk(
  'classes/fetchByGradeLevel',
  async ({ gradeLevel, sectionId }: { gradeLevel: string; sectionId?: string }) => {
    const response = await classApi.getByGradeLevel(gradeLevel, sectionId);
    return response;
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearCurrentClass: (state) => {
      state.currentClass = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch classes';
      })
      // Create class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = [...state.classes, action.payload];
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create class';
      })
      // Update class
      .addCase(updateClass.fulfilled, (state, action) => {
        state.classes = state.classes.map(classItem => 
          classItem.id === action.payload._id ? action.payload : classItem
        );
      })
      // Delete class
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter(classItem => classItem.id !== action.payload);
      })
      // Assign teacher
      .addCase(assignTeacher.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      // Remove teacher
      .addCase(removeTeacher.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      // Assign temp teacher
      .addCase(assignTempTeacher.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      // Remove temp teacher
      .addCase(removeTempTeacher.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      // Fetch by ID
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch class';
      })
      // Fetch by grade level
      .addCase(fetchClassesByGradeLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassesByGradeLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClassesByGradeLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch classes by grade level';
      })
      // Add/Remove subjects
      .addCase(addSubjects.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(removeSubjects.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;
