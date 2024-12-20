import { academicYearApi } from '~/services/academicYearApi';
import { createQueryHooks } from './queryHookFactory';
import type {
  AcademicYear,
  CreateAcademicYearDto,
  UpdateAcademicYearDto
} from '~/types/academicYear';

const baseHooks = createQueryHooks<AcademicYear, CreateAcademicYearDto, UpdateAcademicYearDto>(
  'academicYears',
  academicYearApi
);

export const {
  keys: academicYearKeys,
  useEntities: useAcademicYears,
  useEntity: useAcademicYear,
  useCreateEntity: useCreateAcademicYear,
  useUpdateEntity: useUpdateAcademicYear,
  useDeleteEntity: useDeleteAcademicYear
} = baseHooks;
