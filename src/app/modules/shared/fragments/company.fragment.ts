import { gql } from 'apollo-angular';

export const CompanyQL = gql`
    fragment CompanyQL on company {
        id
        name
        typeId
        status
        createdBy
        createdAt
        logo
        projects {
            id
        }
        contractorProjects {
            id
        }
        users {
            userId
            roleId
        }
    }
`;
