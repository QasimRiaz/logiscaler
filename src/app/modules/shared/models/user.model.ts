import { Company } from "./company.model";
import { Role } from "./role.model";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    pictureUrl: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    userRole?: UserRole[];
    // projectAssignment?: ProjectAssignment[];
    // taskSubmission?: TaskSubmission[];

}

export interface UserRole {
    roleId: string;
    userId: string;
    role?: Role;
}