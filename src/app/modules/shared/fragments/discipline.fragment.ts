import { gql } from 'apollo-angular';

export const DisciplineQL = gql`
    fragment DisciplineQL on discipline {
        id
        name
        icon
        status
        createdBy
        createdAt
    }
`;
