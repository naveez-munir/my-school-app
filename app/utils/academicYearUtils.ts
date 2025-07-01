export interface AcademicYearOption {
  value: string;
  label: string;
}

export function generateAcademicYears(): AcademicYearOption[] {
  const currentYear = new Date().getFullYear();
  const years: AcademicYearOption[] = [];

  for (let i = -5; i <= 20; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    const academicYear = `${startYear}-${endYear}`;
    years.push({
      value: academicYear,
      label: academicYear,
    });
  }

  return years;
}

export function getCurrentAcademicYear(): string {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const academicStartYear = currentMonth < 4 ? currentYear - 1 : currentYear;
  const academicEndYear = academicStartYear + 1;

  return `${academicStartYear}-${academicEndYear}`;
}
