// import { ProjectAssignment, ProjectDiscipline, ProjectTask } from "app/modules/shared/models/ticket.model";
// import { TaskSubmissionMeta } from "app/modules/shared/models/task.model";
// import { UserRole } from "app/modules/shared/models/user.model";

import { TicketAssignment } from "app/modules/shared/models/ticket.model";


export class TicketHelper {

    public static insertAsignment(assignments: TicketAssignment[]) {
        let data = [];
        if (assignments.length > 0) {
            assignments.forEach(brn => {
                data.push({ userId: brn.userId })
            })
        }
        return { data }
    }
}
//     public static insertDiscipline(disciplines: ProjectDiscipline[]) {
//         let data = [];
//         if (disciplines.length > 0) {
//             disciplines.forEach(brn => {
//                 data.push({ disciplineId: brn.disciplineId })
//             })
//         }
//         return { data }
//     }
//     public static insertTasks(tasks: ProjectTask[]) {
//         let data = [];
//         if (tasks.length > 0) {
//             tasks.forEach(brn => {
//                 data.push({ taskId: brn.taskId })
//             })
//         }
//         return { data }
//     }
//     public static insertMeta(assignments: TaskSubmissionMeta[]) {
//         let data = [];
//         if (assignments.length > 0) {
//             assignments.forEach(brn => {
//                 data.push({
//                     fieldKey: brn.fieldKey,
//                     fieldValue: brn.fieldValue,
//                     url: brn.url,
//                     name: brn.name,
//                     documentType: brn?.documentType ?? '',
//                 })
//             })
//         }
//         return { data }
//     }

// }