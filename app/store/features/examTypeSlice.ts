import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examTypeApi } from '~/services/examTypeApi';
import type { 
  ExamTypeState, 
  ExamType, 
  CreateExamTypeDto, 
  UpdateExamTypeDto 
} from '~/types/examType';

const initialState: ExamTypeState = {
  examTypes: [],
  currentExamType: null,
  loading: false,
  error: null
};

export const fetchExamTypes = createAsyncThunk(
  'examTypes/fetchAll',
  async (activeOnly?: boolean) => {
    const response = await examTypeApi.getAll(activeOnly);
    return response;
  }
);

export const fetchExamTypeById = createAsyncThunk(
  'examTypes/fetchById',
  async (id: string) => {
    const response = await examTypeApi.getById(id);
    return response;
  }
);

export const createExamType = createAsyncThunk(
  'examTypes/create',
  async (data: CreateExamTypeDto) => {
    const response = await examTypeApi.create(data);
    return response;
  }
);

export const updateExamType = createAsyncThunk(
  'examTypes/update',
  async ({ id, data }: { id: string; data: UpdateExamTypeDto }) => {
    const response = await examTypeApi.update(id, data);
    return response;
  }
);

export const deleteExamType = createAsyncThunk(
  'examTypes/delete',
  async (id: string) => {
    await examTypeApi.delete(id);
    return id;
  }
);

export const toggleExamTypeStatus = createAsyncThunk(
  'examTypes/toggleStatus',
  async (id: string) => {
    const response = await examTypeApi.toggleStatus(id);
    return response;
  }
);

const examTypeSlice = createSlice({
  name: 'examTypes',
  initialState,
  reducers: {
    clearCurrentExamType: (state) => {
      state.currentExamType = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all exam types
      .addCase(fetchExamTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examTypes = action.payload;
      })
      .addCase(fetchExamTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exam types';
      })

      // Fetch exam type by ID
      .addCase(fetchExamTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExamType = action.payload;
      })
      .addCase(fetchExamTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exam type';
      })

      // Create exam type
      .addCase(createExamType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamType.fulfilled, (state, action) => {
        state.loading = false;
        state.examTypes = [...state.examTypes, action.payload];
      })
      .addCase(createExamType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create exam type';
      })

      // Update exam type
      .addCase(updateExamType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamType.fulfilled, (state, action) => {
        state.loading = false;
        state.examTypes = state.examTypes.map(examType => 
          examType._id === action.payload._id ? action.payload : examType
        );
        if (state.currentExamType && state.currentExamType._id === action.payload._id) {
          state.currentExamType = action.payload;
        }
      })
      .addCase(updateExamType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update exam type';
      })

      // Delete exam type
      .addCase(deleteExamType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamType.fulfilled, (state, action) => {
        state.loading = false;
        state.examTypes = state.examTypes.filter(examType => examType._id !== action.payload);
        if (state.currentExamType && state.currentExamType._id === action.payload) {
          state.currentExamType = null;
        }
      })
      .addCase(deleteExamType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete exam type';
      })

      // Toggle exam type status
      .addCase(toggleExamTypeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleExamTypeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.examTypes = state.examTypes.map(examType => 
          examType._id === action.payload._id ? action.payload : examType
        );
        if (state.currentExamType && state.currentExamType._id === action.payload._id) {
          state.currentExamType = action.payload;
        }
      })
      .addCase(toggleExamTypeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle exam type status';
      });
  },
});

export const { clearCurrentExamType } = examTypeSlice.actions;

export default examTypeSlice.reducer;
