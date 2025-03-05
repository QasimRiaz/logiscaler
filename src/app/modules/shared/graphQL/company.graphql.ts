import gql from 'graphql-tag';
import { CompanyQL } from '../fragments/company.fragment';

export const getAllCompanies = gql`
    query getAllCompanies($typeId: Int!) {
        company(where: { typeId: { _eq: $typeId } }) {
            ...CompanyQL
        }
    }
    ${CompanyQL}
`;

export const getCompanyById = gql`
    query getCompanyById($id: uuid!, $typeId: Int!) {
        company(
            where: {
                _and: [{ id: { _eq: $id } }, { typeId: { _eq: $typeId } }]
            }
        ) {
            ...CompanyQL
        }
    }
    ${CompanyQL}
`;

export const updateCompany = gql`
    mutation updateCompany($objects: [company_insert_input!]!) {
        insert_company(
            objects: $objects
            on_conflict: {
                constraint: contractor_pkey
                update_columns: [name, status,logo]
            }
        ) {
            returning {
                ...CompanyQL
            }
        }
    }
    ${CompanyQL}
`;
export const deleteCompany = gql`
    mutation deleteCompany($id: uuid!) {
        delete_company(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`;

