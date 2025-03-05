import { Task } from "./task.model";

export interface Section {
    id: string;
    name: string;
    order: number;
    status: boolean,
    isCompleted?:boolean;
    createdAt?: Date;
    updatedAt?: Date;
    tasks?: Task[];
}
