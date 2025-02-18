import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { subjectApi } from '~/services/subjectApi';
import type { CreateSubjectDto, Subject, UpdateSubjectDto } from '~/types/subject';

// State interface
interface SubjectState {
  subjects: Subject[];
  currentSubject: Subject | null;
  loading: boolean;
  error: string | null;
  filters: {
    subjectName?: string;
    subjectCode?: string;
  };
}

// Initial state
const initialState: SubjectState = {
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchAll',
  async (filters: { subjectName?: string; subjectCode?: string } = {}) => {
    const response = await subjectApi.getAll(filters);
    return response;
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchById',
  async (id: string) => {
    const response = await subjectApi.getById(id);
    return response;
  }
);

export const createSubject = createAsyncThunk(
  'subjects/create',
  async (data: CreateSubjectDto) => {
    const response = await subjectApi.create(data);
    return response;
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/update',
  async ({ id, data }: { id: string; data: UpdateSubjectDto }) => {
    const response = await subjectApi.update(id, data);
    return response;
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/delete',
  async (id: string) => {
    await subjectApi.delete(id);
    return id;
  }
);

// Slice
const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SubjectState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subjects';
      })

      // Fetch subject by ID
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subject';
      })

      // Create subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create subject';
      })

      // Update subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjects.findIndex(subject => subject._id === action.payload._id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update subject';
      })

      // Delete subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter(subject => subject._id !== action.payload);
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete subject';
      });
  },
});


export const { setFilters, clearFilters, clearCurrentSubject } = subjectSlice.actions;


export default subjectSlice.reducer;
