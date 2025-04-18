import type { CreateStaffRequest, UpdateStaffRequest } from "~/types/staff";
import type { CreateTeacherDto } from "~/types/teacher";

export function cleanFormData<T>(data: T): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== 'object' || data instanceof Date) {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .map(item => cleanFormData(item))
      .filter(item => {
        if (item === null || item === undefined) return false;
        if (typeof item === 'object' && Object.keys(item).length === 0) return false;
        return true;
      });
  }
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    if (typeof value === 'object') {
      const cleanedValue = cleanFormData(value);
      if (Array.isArray(cleanedValue) && cleanedValue.length > 0) {
        result[key] = cleanedValue;
      } else if (typeof cleanedValue === 'object' && Object.keys(cleanedValue).length > 0) {
        result[key] = cleanedValue;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

export function cleanTeacherData(data: CreateTeacherDto): CreateTeacherDto {
  const cleanedData = { ...data };

  if (cleanedData.classTeacherOf === '') {
    delete cleanedData.classTeacherOf;
  }

  if (cleanedData.educationHistory && cleanedData.educationHistory.length > 0) {
    // @ts-ignore
    cleanedData.educationHistory = cleanedData.educationHistory.map(({ _id, ...rest }) => rest);
  }

  if (cleanedData.experience && cleanedData.experience.length > 0) {
    // @ts-ignore
    cleanedData.experience = cleanedData.experience.map(({ _id, ...rest }) => rest);
  }

  if (cleanedData.documents && cleanedData.documents.length > 0) {
    // @ts-ignore
    cleanedData.documents = cleanedData.documents.map(({ _id, ...rest }) => rest);
  }

  return cleanedData;
}

type StaffDataType = CreateStaffRequest | UpdateStaffRequest;

export function cleanStaffData(data: StaffDataType): StaffDataType {
  const cleanedData = { ...data } as any;

  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === '') {
      delete cleanedData[key];
    }
  });

  if (cleanedData.educationHistory && cleanedData.educationHistory.length > 0) {
    cleanedData.educationHistory = cleanedData.educationHistory.map((item: any) => {
      const { _id, ...rest } = item;
      return rest;
    });
  }

  if (cleanedData.experience && cleanedData.experience.length > 0) {
    cleanedData.experience = cleanedData.experience.map((item: any) => {
      const { _id, ...rest } = item;
      return rest;
    });
  }
  if (cleanedData.documents && cleanedData.documents.length > 0) {
    cleanedData.documents = cleanedData.documents.map((item: any) => {
      const { _id, ...rest } = item;
      return rest;
    });
  }
  if (cleanedData.emergencyContact ) {
    const { _id, ...rest } = cleanedData.emergencyContact;
    cleanedData.emergencyContact = rest;
  }

  return cleanedData as StaffDataType;
}
