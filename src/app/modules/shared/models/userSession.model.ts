import { UserRole } from "./user.model";

export interface UserSessionModel {
    id: string;
    roleId: string;
    role: string;
    name: string;
    email: string;
    phone: string;
    pictureUrl: string;
    companyId?: string;
    company?: any;
    companyLogo?: string;
    userRoles?: UserRole[];
    editAccess?: boolean;
    viewAccess?: boolean;
    deleteAccess?: boolean;
}
