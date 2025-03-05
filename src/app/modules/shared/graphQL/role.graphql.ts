import gql from 'graphql-tag';
import { RoleQL } from '../fragments/account.fragment';

export const getAllRoles = gql`
    query getAllRoles {
        role {
            ...RoleQL
        }
    }
    ${RoleQL}
`;
export const getRoleById = gql`
    query getRoleById($id: uuid!) {
        role(where: { id: { _eq: $id } }) {
            ...RoleQL
        }
    }
    ${RoleQL}
`;
export const updateRole = gql`
    mutation updateRole($objects: [role_insert_input!]!) {
        insert_role(
            objects: $objects
            on_conflict: {
                constraint: role_pkey
                update_columns: [name, editAccess, viewAccess, deleteAccess]
            }
        ) {
            returning {
                ...RoleQL
            }
        }
    }
    ${RoleQL}
`;
export const deleteRole = gql`
    mutation deleteRole($id: uuid!) {
        delete_role(where: { id: { _eq: $id } }) {
            affected_rows
        }
        delete_user(where: { userRole: { roleId: { _eq: $id } } }) {
            affected_rows
        }
    }
`;
