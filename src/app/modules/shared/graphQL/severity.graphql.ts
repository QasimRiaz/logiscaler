import gql from 'graphql-tag';
import { DisciplineQL } from '../fragments/discipline.fragment';

export const getAllSeverity = gql`
    query {
        severity {
            id
            name
        }
    }
`;
export const getAllStatus = gql`
    query {
        status {
            id
            name
        }
    }
`;

export const getDashboardData = gql`
    query getDashboardData {
        discipline {
            ...DisciplineQL
        }
    }
    ${DisciplineQL}
`;
