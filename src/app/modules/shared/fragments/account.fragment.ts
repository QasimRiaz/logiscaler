import gql from 'graphql-tag';

export const RoleQL = gql`
    fragment RoleQL on role {
        id
editAccess
viewAccess
deleteAccess
        name
    }
`;

export const PersonnelQL = gql`
    fragment PersonnelQL on user {
        id
        firstName
        lastName
        email
        phone
        status
        createdAt
        pictureUrl
        createdAt
        createdBy
        userRole {
            userId
            roleId
            role {
                id
                name
                editAccess
                viewAccess
                deleteAccess
            }
        }
    }
`;
