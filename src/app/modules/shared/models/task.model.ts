import { Discipline } from "./discipline.model";
import { Section } from "./section.model";
import { User } from "./user.model";

export interface Task {
    id: string;
    sectionId: string;
    createdBy: string;
    name: string;
    description: string;
    type: string;
    isRequired: boolean;
    fileAllow: boolean;
    taskOrder: number;
    status: boolean,
    isCompleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    submissions?: TaskSubmission[];
    section?: Section;
    disciplines?: TaskDiscipline[];
    guides?: TaskGuide[];
    options?: TaskOption[];
    admin?:User;
}

export interface TaskSubmission {
    id: string;
    userId: string;
    taskId: string;
    projectId: string;
    isCompleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
    meta?: TaskSubmissionMeta[];
}

export interface TaskSubmissionMeta {
    id: string;
    submissionId: string;
    fieldKey: string;
    fieldValue: string;
    createdAt?: Date;
    file?: File | any;
    url?: string;
    name?: string;
    documentType?: string;
}

export interface TaskDiscipline {
    taskId: string;
    selected?: boolean;
    disciplineId: string;
    createdAt?: Date;
    discipline?: Discipline;
    task?: Task;
}

export interface TaskGuide {
    id?: string;
    taskId: string;
    name: string;
    documentType: string;
    url?: string;
    fileName: string;
    createdAt?: Date;
    file: File | any;
}

export interface SelectOption {
    id?: any;
    name: string;
}

export interface TaskOption {
    id?: string;
    taskId?: string;
    value: string;
}