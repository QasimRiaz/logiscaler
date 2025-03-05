import { gql } from 'apollo-angular';
import { DisciplineQL } from './discipline.fragment';
import { TaskQL, TaskSubmissionQL } from './task.fragment';

export const ProjectQL = gql`
    fragment ProjectQL on project {
        id
        createdAt
        createdBy
        assetOwnerId
        contractorId
        name
        description
        startDate
        targetDate
        workPermit
        emailNotification
        status
        assetOwner {
            id
            name
        }
        contractor {
            id
            name
        }
        assignments {
            projectId
            userId
            roleId
            createdAt
        }
        disciplines {
            projectId
            disciplineId
            createdAt
            discipline {
                ...DisciplineQL
            }
        }
        tasks{
            projectId
            taskId
            task {
                ...TaskQL
            }
            submission {
                ...TaskSubmissionQL
            }
        }
            admin{
            id
            firstName
            lastName
            email}
    }
    ${DisciplineQL}
    ${TaskSubmissionQL}
    ${TaskQL}
`;
