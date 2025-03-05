import gql from 'graphql-tag';
import { SectionListingQL, SectionQL } from '../fragments/section.fragment';
import { TaskQL } from '../fragments/task.fragment';

export const getAllSections = gql`
    query getAllSections {
        section(order_by:{order:asc}) {
            ...SectionListingQL
        }
    }
    ${SectionListingQL}
`;
export const getOnlySections = gql`
    query getOnlySections {
        section(order_by:{order:asc}) {
            id
            name
            order
            tasks{
            id}
        }
    }
`;
export const getTaskById = gql`
    query getTaskById($id: uuid!) {
        task(where: { id: { _eq: $id } }) {
            ...TaskQL
        }
    }
    ${TaskQL}
`;
export const getSectionByName = gql`
    query getSectionByName($name: String!) {
        section(where: { name: { _eq: $name } }) {
            ...SectionQL
        }
    }
    ${SectionQL}
`;
export const getTasksByDisciplines = gql`
    query getTasksByDisciplines($disciplineId: [uuid!]!) {
        task_discipline(where: { disciplineId: { _in: $disciplineId } }) {
            taskId
            disciplineId
            discipline {
                id
                name
            }
            task {
                ...TaskQL
            }
        }
    }
    ${TaskQL}
`;
export const updateTask = gql`
    mutation insert_task($objects: [task_insert_input!]!, $taskId: uuid!) {
        delete_task_guide(where: { _and: [{ taskId: { _eq: $taskId } }] }) {
            affected_rows
        }
        delete_task_discipline(
            where: { _and: [{ taskId: { _eq: $taskId } }] }
        ) {
            affected_rows
        }
        delete_task_option(where: { _and: [{ taskId: { _eq: $taskId } }] }) {
            affected_rows
        }
        insert_task(
            objects: $objects
            on_conflict: {
                constraint: task_pkey
                update_columns: [
                    name
                    isRequired
                    type
                    description
                    fileAllow
                    taskOrder
                    status
                    sectionId
                ]
            }
        ) {
            returning {
                ...TaskQL
            }
        }
    }
    ${TaskQL}
`;
export const updateSection = gql`
    mutation updateSection($objects: [section_insert_input!]!) {
        insert_section(
            objects: $objects
            on_conflict: {
                constraint: section_pkey
                update_columns: [name, status]
            }
        ) {
            returning {
                ...SectionQL
            }
        }
    }
    ${SectionQL}
`;

export const deleteSection = gql`
    mutation deleteSection($id: uuid!) {
        delete_section(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`;
export const deleteTask = gql`
    mutation deleteTask($id: uuid!) {
        delete_task(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`;
export const UpdateTaskOrder = gql`
    mutation UpdateTaskOrder($tasks: [task_insert_input!]!) {
        insert_task(
            objects: $tasks
            on_conflict: { constraint: task_pkey, update_columns: [taskOrder] }
        ) {
            returning {
                id
                taskOrder
            }
        }
    }
`;
export const updateSectionOrder = gql`
    mutation updateSectionOrder($sections: [section_insert_input!]!) {
        insert_section(
            objects: $sections
            on_conflict: { constraint: section_pkey, update_columns: [order] }
        ) {
            returning {
                id
                order
            }
        }
    }
`;
