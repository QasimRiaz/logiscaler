import {
    TaskDiscipline,
    TaskGuide,
    TaskOption,
} from 'app/modules/shared/models/task.model';
import { UserRole } from 'app/modules/shared/models/user.model';

export class UserHelper {
    public static insertRole(role: UserRole) {
        if (role?.roleId != undefined) {
            return {
                data: [
                    {
                        roleId: role.roleId,
                        // companyId: role.companyId,
                    },
                ],
            };
        }
    }

    public static insertAttachments(attachments: TaskGuide[]) {
        let data = [];
        if (attachments.length > 0) {
            attachments.forEach((brn) => {
                data.push({
                    name: brn.name,
                    fileName: brn.fileName,
                    url: brn.url,
                    documentType: brn.documentType,
                });
            });
        }
        return { data };
    }

    public static insertDisciplines(disciplines: TaskDiscipline[]) {
        let data = [];
        if (disciplines.length > 0) {
            disciplines.forEach((brn) => {
                data.push({ disciplineId: brn.disciplineId });
            });
        }
        return { data };
    }

    public static insertOption(options: TaskOption[]) {
        let data = [];
        if (options.length > 0) {
            options.forEach((brn) => {
                data.push({ value: brn.value, id: brn.id });
            });
        }
        return { data };
    }
}
