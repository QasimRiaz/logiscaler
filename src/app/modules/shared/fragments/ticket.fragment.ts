import { gql } from 'apollo-angular';
import { DisciplineQL } from './discipline.fragment';
import { TaskQL, TaskSubmissionQL } from './task.fragment';

export const TicketQL = gql`
    fragment TicketQL on ticket {
        id
        title
        description
        statusId
        createdAt
        addedBy
        awsId
        severityId
        region
        startDate
        targetDate
        status{
        id
        name
        }
        admin{
        id
        firstName
        lastName}
        assignments{
        userId}
        
    }
`;
