export interface AcademicYear {
  id: string;
  startDate: string;
  endDate: string;
  displayName: string;
  isActive: boolean;
  status: 'Draft' | 'Active' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademicYearDto {
  startDate: string;
  endDate: string;
  displayName: string;
  isActive?: boolean;
  status?: 'Draft' | 'Active' | 'Closed';
}

export interface UpdateAcademicYearDto {
  startDate?: string;
  endDate?: string;
  displayName?: string;
  isActive?: boolean;
  status?: 'Draft' | 'Active' | 'Closed';
}
