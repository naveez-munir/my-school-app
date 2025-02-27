import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examApi } from '~/services/examApi';
import type {
  CreateExamDto,
  ExamState,
  UpdateExamDto,
  ExamQueryDto,
} from '~/types/exam';

const initialState: ExamState = {
  exams: [],
  upcomingExams: [],
  currentExam: null,
  loading: false,
  error: null
};

// Fetch all exams with optional filters
export const fetchExams = createAsyncThunk(
  'exams/fetchAll',
  async (params?: ExamQueryDto) => {
    const response = await examApi.getAll(params);
    return response;
  }
);

// Fetch upcoming exams
export const fetchUpcomingExams = createAsyncThunk(
  'exams/fetchUpcoming',
  async (classId?: string) => {
    const response = await examApi.getUpcoming(classId);
    return response;
  }
);

export const fetchExamById = createAsyncThunk(
  'exams/fetchById',
  async (id: string) => {
    const response = await examApi.getById(id);
    return response;
  }
);

export const createExam = createAsyncThunk(
  'exams/create',
  async (data: CreateExamDto) => {
    const response = await examApi.create(data);
    return response;
  }
);

export const updateExam = createAsyncThunk(
  'exams/update',
  async ({ id, data }: { id: string; data: UpdateExamDto }) => {
    const response = await examApi.update(id, data);
    return response;
  }
);

export const updateExamStatus = createAsyncThunk(
  'exams/updateStatus',
  async ({ 
    id, 
    status 
  }: { 
    id: string; 
    status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared' 
  }) => {
    const response = await examApi.updateStatus(id, status);
    return response;
  }
);

export const deleteExam = createAsyncThunk(
  'exams/delete',
  async (id: string) => {
    await examApi.delete(id);
    return id;
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearCurrentExam: (state) => {
      state.currentExam = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all exams
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exams';
      })

      // Fetch upcoming exams
      .addCase(fetchUpcomingExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingExams.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingExams = action.payload;
      })
      .addCase(fetchUpcomingExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch upcoming exams';
      })

      // Fetch exam by ID
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exam';
      })

      // Create exam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = [...state.exams, action.payload];
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create exam';
      })

      // Update exam
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.map(exam => 
          exam.id === action.payload.id ? action.payload : exam
        );
        if (state.currentExam && state.currentExam.id === action.payload.id) {
          state.currentExam = action.payload;
        }
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update exam';
      })

      // Update exam status
      .addCase(updateExamStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.map(exam => 
          exam.id === action.payload.id ? action.payload : exam
        );
        if (state.currentExam && state.currentExam.id === action.payload.id) {
          state.currentExam = action.payload;
        }
        // Update in upcoming exams list if present
        state.upcomingExams = state.upcomingExams.map(exam => 
          exam.id === action.payload.id ? action.payload : exam
        );
      })
      .addCase(updateExamStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update exam status';
      })

      // Delete exam
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.filter(exam => exam.id !== action.payload);
        state.upcomingExams = state.upcomingExams.filter(exam => exam.id !== action.payload);
        if (state.currentExam && state.currentExam.id === action.payload) {
          state.currentExam = null;
        }
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete exam';
      });
  },
});

export const { clearCurrentExam } = examSlice.actions;

export default examSlice.reducer;
