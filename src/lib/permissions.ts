// Industry Types
export type IndustryType = 'GOVERNMENT' | 'EDUCATION' | 'HEALTHCARE' | 'FINANCE' | 'LEGAL';

// All Roles (Government + Education)
export type Role =
    // System Admin
    | 'SUPER_ADMIN'
    // Government Roles
    | 'ORG_ADMIN'
    | 'HR'
    | 'OFFICER'
    | 'REVIEWER'
    | 'USER'
    | 'APPLICANT'
    // Education Roles
    | 'SCHOOL_ADMIN'
    | 'TEACHER'
    | 'STUDENT'
    | 'PARENT';

// All Permissions (Government + Education)
export type Permission =
    // Common Permissions
    | 'view_dashboard'
    // Government/Document Permissions
    | 'view_letters'
    | 'create_letters'
    | 'edit_letters'
    | 'delete_letters'
    | 'view_templates'
    | 'create_templates'
    | 'edit_templates'
    | 'delete_templates'
    | 'view_hr'
    | 'manage_employees'
    | 'manage_organizations'
    | 'view_reports'
    | 'manage_stamps'
    // Education Permissions
    | 'manage_school'
    | 'manage_students'
    | 'view_students'
    | 'manage_teachers'
    | 'view_teachers'
    | 'manage_classes'
    | 'view_classes'
    | 'manage_subjects'
    | 'view_subjects'
    | 'manage_grades'
    | 'view_grades'
    | 'edit_grades'
    | 'manage_attendance'
    | 'view_attendance'
    | 'mark_attendance'
    | 'manage_timetable'
    | 'view_timetable'
    | 'manage_academic_year'
    | 'view_children_progress'
    | 'view_fees'
    | 'pay_fees'
    | 'manage_exams'
    | 'view_exams';

// Map roles to their industries
export const RoleIndustry: Record<Role, IndustryType> = {
    SUPER_ADMIN: 'GOVERNMENT', // Super admin can access all
    ORG_ADMIN: 'GOVERNMENT',
    HR: 'GOVERNMENT',
    OFFICER: 'GOVERNMENT',
    REVIEWER: 'GOVERNMENT',
    USER: 'GOVERNMENT',
    APPLICANT: 'GOVERNMENT',
    SCHOOL_ADMIN: 'EDUCATION',
    TEACHER: 'EDUCATION',
    STUDENT: 'EDUCATION',
    PARENT: 'EDUCATION',
};

// Government Role Permissions
export const GovernmentRolePermissions: Partial<Record<Role, Permission[]>> = {
    SUPER_ADMIN: [
        'view_dashboard', 'view_letters', 'create_letters', 'edit_letters', 'delete_letters',
        'view_templates', 'create_templates', 'edit_templates', 'delete_templates',
        'view_hr', 'manage_employees', 'manage_organizations', 'view_reports', 'manage_stamps'
    ],
    ORG_ADMIN: [
        'view_dashboard', 'view_letters', 'create_letters', 'edit_letters',
        'view_templates', 'create_templates', 'edit_templates',
        'view_hr', 'manage_employees', 'view_reports', 'manage_stamps', 'manage_organizations'
    ],
    HR: [
        'view_dashboard', 'view_hr', 'manage_employees', 'view_reports'
    ],
    OFFICER: [
        'view_dashboard', 'view_letters', 'create_letters', 'edit_letters',
        'view_templates', 'view_reports'
    ],
    REVIEWER: [
        'view_dashboard', 'view_letters',
        'view_reports'
    ],
    USER: [
        'view_dashboard', 'view_letters'
    ],
    APPLICANT: [
        'view_dashboard', 'view_letters', 'create_letters'
    ]
};

// Education Role Permissions
export const EducationRolePermissions: Partial<Record<Role, Permission[]>> = {
    SCHOOL_ADMIN: [
        'view_dashboard', 'manage_school',
        'manage_students', 'view_students',
        'manage_teachers', 'view_teachers',
        'manage_classes', 'view_classes',
        'manage_subjects', 'view_subjects',
        'manage_grades', 'view_grades', 'edit_grades',
        'manage_attendance', 'view_attendance', 'mark_attendance',
        'manage_timetable', 'view_timetable',
        'manage_academic_year',
        'view_reports',
        'manage_exams', 'view_exams',
        'view_letters', 'create_letters', 'edit_letters',
        'view_templates', 'create_templates', 'edit_templates'
    ],
    TEACHER: [
        'view_dashboard',
        'view_students',
        'view_classes',
        'view_subjects',
        'view_grades', 'edit_grades',
        'view_attendance', 'mark_attendance',
        'view_timetable',
        'view_exams',
        'view_letters', 'create_letters'
    ],
    STUDENT: [
        'view_dashboard',
        'view_classes',
        'view_subjects',
        'view_grades',
        'view_attendance',
        'view_timetable',
        'view_exams',
        'view_letters'
    ],
    PARENT: [
        'view_dashboard',
        'view_children_progress',
        'view_grades',
        'view_attendance',
        'view_fees', 'pay_fees',
        'view_letters'
    ]
};

// Combined Role Permissions
export const RolePermissions: Record<Role, Permission[]> = {
    ...GovernmentRolePermissions,
    ...EducationRolePermissions
} as Record<Role, Permission[]>;

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
    return RolePermissions[role]?.includes(permission) || false;
}

// Check if role belongs to education industry
export function isEducationRole(role: Role): boolean {
    return ['SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'].includes(role);
}

// Check if role belongs to government industry
export function isGovernmentRole(role: Role): boolean {
    return ['SUPER_ADMIN', 'ORG_ADMIN', 'HR', 'OFFICER', 'REVIEWER', 'USER', 'APPLICANT'].includes(role);
}

// Get the base route for a role
export function getBaseRouteForRole(role: Role): string {
    if (role === 'SUPER_ADMIN') return '/admin';
    if (isEducationRole(role)) return '/school';
    return '/org';
}

// Get industry type from organization or role
export function getIndustryFromRole(role: Role): IndustryType {
    return RoleIndustry[role] || 'GOVERNMENT';
}
