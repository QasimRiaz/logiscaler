// import { Project } from "./ticket.model";
import { UserRole } from "./user.model";

export interface Company {
    id: string;
    typeId: number;
    name: string;
    status: boolean;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
    logo?: string;
    // projects?: Project[];
    // contractorProjects?: Project[];
    users?: UserRole[];
}