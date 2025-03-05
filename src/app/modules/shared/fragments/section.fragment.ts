import { gql } from 'apollo-angular';
import { TaskQL } from './task.fragment';

export const SectionQL = gql`
    fragment SectionQL on section {
        id
        name
        order
        status
        createdAt
        updatedAt
        tasks {
            ...TaskQL
        }
    }
    ${TaskQL}
`;
export const SectionListingQL = gql`
    fragment SectionListingQL on section {
        id
        name
        order
        tasks(order_by: { taskOrder: asc }) {
            id
            sectionId
            name
            description
            type
            isRequired
            taskOrder
            status
            disciplines {
                taskId
                disciplineId
                discipline {
                    id
                    name
                    icon
                }
            }
            guides {
                id
            }
                section{
                id
                name
                }
        }
    }
`;
