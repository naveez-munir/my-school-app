import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  Student, 
  StudentState, 
  CreateStudentDto, 
  UpdateStudentDto, 
  SearchStudentDto 
} from '~/types/student';
import { studentApi } from '~/services/studentApi';

const initialState: StudentState = {
  students: [],
  currentStudent: null,
  loading: false,
  error: null
};

// Async Thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (params?: SearchStudentDto) => {
    console.log('>>>>>>>>>>>>>> redux call')
    const response = await studentApi.getAll(params);
    return response;
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (id: string) => {
    const response = await studentApi.getById(id);
    return response;
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (data: CreateStudentDto) => {
    const response = await studentApi.create(data);
    return response;
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, data }: { id: string; data: UpdateStudentDto }) => {
    const response = await studentApi.update(id, data);
    return response;
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id: string) => {
    await studentApi.delete(id);
    return id;
  }
);

export const fetchStudentsByClass = createAsyncThunk(
  'students/fetchByClass',
  async (classId: string) => {
    const response = await studentApi.getByClass(classId);
    return response;
  }
);

export const fetchStudentsByGradeLevel = createAsyncThunk(
  'students/fetchByGradeLevel',
  async (gradeLevel: string) => {
    const response = await studentApi.getByGradeLevel(gradeLevel);
    return response;
  }
);

// Slice
const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch students';
      })

      // Fetch student by ID
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.currentStudent = action.payload;
      })

      // Create student
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create student';
      })

      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(student => student.id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update student';
      })

      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(student => student.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete student';
      });
  },
});

export const { clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;
