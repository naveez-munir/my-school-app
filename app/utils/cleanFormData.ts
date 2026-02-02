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

function removeEmptyStrings<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  Object.keys(result).forEach(key => {
    if (result[key] === '') {
      delete result[key];
    }
  });
  return result;
}

export function cleanTeacherData(data: CreateTeacherDto): CreateTeacherDto {
  const cleanedData = { ...data } as any;

  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === '' || cleanedData[key] === null || cleanedData[key] === undefined) {
      delete cleanedData[key];
    }
  });

  if (cleanedData.educationHistory && cleanedData.educationHistory.length > 0) {
    cleanedData.educationHistory = cleanedData.educationHistory.map((item: any) => {
      const { _id, ...rest } = item;
      return removeEmptyStrings(rest);
    });
  }

  if (cleanedData.experience && cleanedData.experience.length > 0) {
    cleanedData.experience = cleanedData.experience.map((item: any) => {
      const { _id, ...rest } = item;
      return removeEmptyStrings(rest);
    });
  }

  if (cleanedData.documents && cleanedData.documents.length > 0) {
    cleanedData.documents = cleanedData.documents.map((item: any) => {
      const { _id, ...rest } = item;
      return removeEmptyStrings(rest);
    });
  }

  return cleanedData as CreateTeacherDto;
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
      return removeEmptyStrings(rest);
    });
  }

  if (cleanedData.experience && cleanedData.experience.length > 0) {
    cleanedData.experience = cleanedData.experience.map((item: any) => {
      const { _id, ...rest } = item;
      return removeEmptyStrings(rest);
    });
  }
  if (cleanedData.documents && cleanedData.documents.length > 0) {
    cleanedData.documents = cleanedData.documents.map((item: any) => {
      const { _id, ...rest } = item;
      return removeEmptyStrings(rest);
    });
  }
  if (cleanedData.emergencyContact ) {
    const { _id, ...rest } = cleanedData.emergencyContact;
    cleanedData.emergencyContact = removeEmptyStrings(rest);
  }

  return cleanedData as StaffDataType;
}
