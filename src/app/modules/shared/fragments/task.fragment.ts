import { gql } from 'apollo-angular';
import { DisciplineQL } from './discipline.fragment';

export const TaskSubmissionMetaQL = gql`
    fragment TaskSubmissionMetaQL on task_submission_meta {
        id
        submissionId
        fieldKey
        fieldValue
        createdAt
        url
        name
        documentType
    }
`;
export const TaskSubmissionQL = gql`
    fragment TaskSubmissionQL on task_submission {
        id
        userId
        taskId
        isCompleted
        createdAt
        updatedAt
        projectId
        user {
            id
            firstName
            lastName
        }
        meta {
            ...TaskSubmissionMetaQL
        }
    }
    ${TaskSubmissionMetaQL}
`;
export const TaskDisciplineQL = gql`
    fragment TaskDisciplineQL on task_discipline {
        taskId
        disciplineId
        createdAt
        discipline {
            ...DisciplineQL
        }
        task {
            id
            name
        }
    }
    ${DisciplineQL}
`;
export const TaskGuideQL = gql`
    fragment TaskGuideQL on task_guide {
        id
        taskId
        name
        documentType
        url
        createdAt
        fileName
    }
`;
export const TaskQL = gql`
    fragment TaskQL on task {
        id
        sectionId
        fileAllow
        name
        description
        type
        isRequired
        taskOrder
        status
        createdAt
        updatedAt
        section {
            id
            name
            order
        }
        disciplines {
            ...TaskDisciplineQL
        }
        guides {
            ...TaskGuideQL
        }
        options {
            id
            taskId
            value
        }
            admin{
            id
            firstName
            lastName
            email}
    }
    ${TaskSubmissionQL}
    ${TaskDisciplineQL}
    ${TaskGuideQL}
`;
