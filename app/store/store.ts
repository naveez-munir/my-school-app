import { configureStore } from '@reduxjs/toolkit';
import subjectsReducer from './features/subjectSlice';
import studentReducer from './features/studentSlice';
import teacherReducer from './features/teacherSlice';

export const store = configureStore({
  reducer: {
    subjects: subjectsReducer,
    students: studentReducer,
    teachers: teacherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
