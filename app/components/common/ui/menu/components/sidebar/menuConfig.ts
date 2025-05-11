import type { MenuItem } from './types';

const AdminRoles = ['tenant_admin', 'admin', 'principal', 'accountant']
const parentRoles = ['guardian']
const studentRoles = ['student']
const teacherRoles = ['teacher']
const staffRoles = ['staff']

export const MENU_ITEMS: MenuItem[] = [
  // Super Admin Menu Items
  { 
    name: 'home', 
    label: 'Dashboard', 
    path: '/admin/dashboard',
    icon: 'home',
    roles: ['super_admin']
  },
  { 
    name: 'tenants', 
    label: 'Tenants', 
    path: '/admin/tenants',
    icon: 'building',
    roles: ['super_admin']
  },
  { 
    name: 'tenantConfig', 
    label: 'Tenant Configuration', 
    path: '/admin/tenant-config',
    icon: 'cog',
    roles: ['super_admin']
  },
  
  // Admin Menu Items 
  { 
    name: 'home', 
    label: 'Dashboard', 
    path: '/dashboard',
    icon: 'home',
    roles: AdminRoles
  },
  { 
    name: 'students', 
    label: 'Students', 
    path: '/dashboard/students',
    icon: 'users',
    roles: AdminRoles
  },
  { 
    name: 'teachers', 
    label: 'Teachers', 
    path: '/dashboard/teachers',
    icon: 'users',
    roles: AdminRoles
  },
  { 
    name: 'classes', 
    label: 'Classes', 
    path: '/dashboard/classes',
    icon: 'bookOpen',
    roles: AdminRoles
  },
  { 
    name: 'courses', 
    label: 'Courses', 
    path: '/dashboard/courses',
    icon: 'bookOpen',
    roles: AdminRoles
  },
  { 
    name: 'staffSection', 
    label: 'Staff', 
    path: '/dashboard/staff',
    icon: 'briefcase',
    roles: AdminRoles
  },
  { 
    name: 'leaveSection', 
    label: 'Leave Management', 
    path: '/dashboard/leave',
    icon: 'clock',
    roles: AdminRoles,
    children: [
      { 
        name: 'staff-leave', 
        label: 'Staff Leave', 
        path: '/dashboard/leave/staff',
        icon: 'userCheck',
        roles: AdminRoles
      },
      { 
        name: 'student-pending-leave', 
        label: 'Student Pending Leaves', 
        path: '/dashboard/leave/student/pending',
        icon: 'users',
        roles: AdminRoles
      },
      { 
        name: 'student-leaves', 
        label: 'Student Leaves', 
        path: '/dashboard/leave/student',
        icon: 'users',
        roles: AdminRoles
      }
    ]
  },
  { 
    name: 'exams', 
    label: 'Examination', 
    path: '/dashboard/exams',
    icon: 'graduationCap',
    roles: AdminRoles,
    children: [
      { 
        name: 'exam-types', 
        label: 'Exam Types', 
        path: '/dashboard/exam-types',
        icon: 'award',
        roles: AdminRoles
      },
      { 
        name: 'exams-list', 
        label: 'Exams', 
        path: '/dashboard/exams',
        icon: 'graduationCap',
        roles: AdminRoles
      },
      { 
        name: 'results', 
        label: 'Results', 
        path: '/dashboard/exams/results',
        icon: 'fileText',
        roles: AdminRoles
      }
    ]
  },
  { 
    name: 'feeSection', 
    label: 'Fee Management', 
    path: '/dashboard/fee',
    icon: 'dollarSign',
    roles: AdminRoles,
    children: [
      { 
        name: 'fee-category', 
        label: 'Fee Category', 
        path: '/dashboard/fee/category',
        icon: 'fileSpreadsheet',
        roles: AdminRoles
      },
      { 
        name: 'fee-payment', 
        label: 'Fee Payment', 
        path: '/dashboard/fee/payment',
        icon: 'creditCard',
        roles: AdminRoles
      },
      { 
        name: 'fee-structure', 
        label: 'Fee Structure', 
        path: '/dashboard/fee/structure',
        icon: 'receipt',
        roles: AdminRoles
      },
      { 
        name: 'student-discount', 
        label: 'Student Discount', 
        path: '/dashboard/fee/discount',
        icon: 'pieChart',
        roles: AdminRoles
      },
      { 
        name: 'student-fee', 
        label: 'Student Fee', 
        path: '/dashboard/fee/student',
        icon: 'dollarSign',
        roles: AdminRoles
      }
    ]
  },
  { 
    name: 'accountSection', 
    label: 'Accounts', 
    path: '/dashboard/accounts',
    icon: 'dollarSign',
    roles: AdminRoles,
    children: [
      { 
        name: 'salary-structure', 
        label: 'Salary Structure', 
        path: '/dashboard/accounts/salary-structure',
        icon: 'fileSpreadsheet',
        roles: AdminRoles
      },
      { 
        name: 'salary', 
        label: 'Salary', 
        path: '/dashboard/accounts/salary',
        icon: 'creditCard',
        roles: AdminRoles
      },
      { 
        name: 'expenses', 
        label: 'Expenses', 
        path: '/dashboard/accounts/expenses',
        icon: 'receipt',
        roles: AdminRoles
      },
      { 
        name: 'payment', 
        label: 'Payment', 
        path: '/dashboard/accounts/payment',
        icon: 'dollarSign',
        roles: AdminRoles
      }
    ]
  },
  { 
    name: 'management', 
    label: 'Management', 
    path: '/dashboard/management',
    icon: 'calendar',
    roles: AdminRoles
  },
  { 
    name: 'attendance', 
    label: 'Attendance', 
    path: '/dashboard/attendance',
    icon: 'clipboardCheck',
    roles: AdminRoles
  },
  { 
    name: 'dailyDiary', 
    label: 'Daily Diary', 
    path: '/dashboard/daily-diary',
    icon: 'book',
    roles: AdminRoles
  },
  
  // Staff Menu Items
  {
    name: 'staffHome',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    roles: staffRoles
  },
  {
    name: 'staffProfile',
    label: 'Profile',
    path: '/dashboard/profile',
    icon: 'user',
    roles: staffRoles
  },
  {
    name: 'staffLeave',
    label: 'Leave Section',
    path: '/dashboard/leave',
    icon: 'clock',
    roles: staffRoles
  },
  {
    name: 'staffSalary',
    label: 'Salary Details',
    path: '/dashboard/salary',
    icon: 'dollarSign',
    roles: staffRoles
  },
  
  // Teacher Menu Items
  {
    name: 'teacherHome',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    roles: teacherRoles
  },
  {
    name: 'teacherProfile',
    label: 'Profile',
    path: '/dashboard/profile',
    icon: 'user',
    roles: teacherRoles
  },
  {
    name: 'teacherLeave',
    label: 'Leave Section',
    path: '/dashboard/leave',
    icon: 'clock',
    roles: teacherRoles
  },
  {
    name: 'teacherSalary',
    label: 'Salary Details',
    path: '/dashboard/salary',
    icon: 'dollarSign',
    roles: teacherRoles
  },
  {
    name: 'teacherDairy',
    label: 'Dairy Section',
    path: '/dashboard/dairy',
    icon: 'book',
    roles: teacherRoles
  },
  {
    name: 'teacherClasses',
    label: 'My Classes',
    path: '/dashboard/classes',
    icon: 'bookOpen',
    roles: teacherRoles
  },
  {
    name: 'teacherExams',
    label: 'Exams',
    path: '/dashboard/exams',
    icon: 'graduationCap',
    roles: teacherRoles,
    children: [
      { 
        name: 'teacher-exams-list', 
        label: 'Exams', 
        path: '/dashboard/exams',
        icon: 'graduationCap',
        roles: teacherRoles
      },
      { 
        name: 'teacher-results', 
        label: 'Results', 
        path: '/dashboard/exams/results',
        icon: 'fileText',
        roles: teacherRoles
      }
    ]
  },
  
  // Student Menu Items
  {
    name: 'studentHome',
    label: 'Profile',
    path: '/dashboard/students/profile',
    icon: 'home',
    roles: studentRoles
  },
  {
    name: 'studentLeave',
    label: 'Leave Section',
    path: '/dashboard/students/leave',
    icon: 'clock',
    roles: studentRoles
  },
  {
    name: 'studentAcademic',
    label: 'Academic Result Section',
    path: '/dashboard/students/result',
    icon: 'graduationCap',
    roles: studentRoles
  },
  {
    name: 'studentDairy',
    label: 'Dairy Section',
    path: '/dashboard/students/dairy',
    icon: 'book',
    roles: studentRoles
  },
  {
    name: 'studentExams',
    label: 'Examinations',
    path: '/dashboard/students/exams',
    icon: 'award',
    roles: studentRoles
  },
  // Guardian Menu Items
  {
    name: 'guardianHome',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    roles: parentRoles
  },
  {
    name: 'guardianProfile',
    label: 'Profile',
    path: '/dashboard/profile',
    icon: 'user',
    roles: parentRoles
  },
  {
    name: 'guardianChildren',
    label: 'My Children',
    path: '/dashboard/guardian/children',
    icon: 'users',
    roles: parentRoles
  },
  {
    name: 'guardianLeave',
    label: 'Leave Section',
    path: '/dashboard/guardian/leave',
    icon: 'clock',
    roles: parentRoles
  },
  {
    name: 'guardianAcademic',
    label: 'Academic Section',
    path: '/dashboard/guardian/academic',
    icon: 'graduationCap',
    roles: parentRoles
  },
  {
    name: 'guardianFees',
    label: 'Fee Section',
    path: '/dashboard/guardian/fees',
    icon: 'dollarSign',
    roles: parentRoles
  },
  {
    name: 'guardianDairy',
    label: 'Dairy Section',
    path: '/dashboard/guardian/dairy',
    icon: 'book',
    roles: parentRoles
  },
  
  // Settings available to all users
  { 
    name: 'settings', 
    label: 'Settings', 
    path: '/dashboard/guardian/settings',
    icon: 'settings',
    roles: ['super_admin', 'tenant_admin', 'admin', 'principal', 'accountant', 'teacher', 'student', 'staff', 'guardian']
  }
];
