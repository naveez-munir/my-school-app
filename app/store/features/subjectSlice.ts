import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subjectApi } from '~/services/subjectApi';
import type { CreateSubjectDto, SubjectState, UpdateSubjectDto } from '~/types/subject';

const initialState: SubjectState = {
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null
};

// Simplified to fetch all subjects at once
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchAll',
  async () => {
    const response = await subjectApi.getAll();
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

const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    }
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
        state.subjects = [...state.subjects, action.payload];
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
        state.subjects = state.subjects.map(subject => 
          subject._id === action.payload._id ? action.payload : subject
        );
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

export const { clearCurrentSubject } = subjectSlice.actions;

export default subjectSlice.reducer; 
