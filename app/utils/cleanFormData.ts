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
