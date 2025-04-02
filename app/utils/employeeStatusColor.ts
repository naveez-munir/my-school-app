export const getEmploymentStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'OnLeave':
      return 'bg-yellow-100 text-yellow-800';
    case 'Resigned':
      return 'bg-gray-100 text-gray-800';
    case 'Terminated':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
