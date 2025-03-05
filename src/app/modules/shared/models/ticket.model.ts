import { Company } from "./company.model";
import { Discipline } from "./discipline.model";
import { Task, TaskSubmission } from "./task.model";
import { User } from "./user.model";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    awsId: string;
    statusId: string;
    severityId: string;
    region: string;
    // startDate: Date;
    // targetDate: Date;
    // workPermit: boolean;
    // emailNotification: boolean;
    // status: boolean;
    // createdBy: string;
    addedBy?: string;
    createdAt: Date;
    startDate: Date;
    targetDate: Date;
    // updatedAt?: Date;
    // assetOwner?: Company;
    // contractor?: Company;
    assignments?: TicketAssignment[];
    // disciplines?: ProjectDiscipline[];
    // tasks?: ProjectTask[];
    admin?: User;
    status?: Status;
    severity?: Status;
}
export interface Status {
    id: string;
    name: string;
}   
export interface TicketAssignment {
    userId: string;
    ticketId: string;
    createdAt?: Date;
}
