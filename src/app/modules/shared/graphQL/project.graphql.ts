import gql from 'graphql-tag';
import { ProjectQL } from '../fragments/project.fragment';
import { TaskSubmissionQL } from '../fragments/task.fragment';
import { TicketQL } from '../fragments/ticket.fragment';

export const getAllTicketQL = gql`
    query getAllTickets {
        ticket(order_by: { createdAt: desc }) {
            ...TicketQL
        }
    }
    ${TicketQL}
`;
export const getAllProjectByContractorCompaniesQL = gql`
    query getAllProjectByCcontractorCompanies($contractorId: uuid!) {
        project(
            where: { contractorId: { _eq: $contractorId } }
            order_by: { createdAt: desc }
        ) {
            ...ProjectQL
        }
    }
    ${ProjectQL}
`;
export const getAllProjectByAssetOwnersQL = gql`
    query getAllProjectByCAssetOwners($assetOwnerId: uuid!) {
        project(
            where: { assetOwnerId: { _eq: $assetOwnerId } }
            order_by: { createdAt: desc }
        ) {
            ...ProjectQL
        }
    }
    ${ProjectQL}
`;
export const getAllProjectByTaskSubmitterQL = gql`
    query getAllProjectByTaskSubmitter($userId: uuid!, $roleId: Int!) {
        project(
            where: {
                _and: [
                    { assignments: { userId: { _eq: $userId } } }
                    { assignments: { roleId: { _eq: $roleId } } }
                ]
            }
            order_by: { createdAt: desc }
        ) {
            ...ProjectQL
        }
    }
    ${ProjectQL}
`;

export const getAllProjectIdsQL = gql`
    query getAllProjectsIds {
        project(order_by: { createdAt: desc }) {
            id
            name
            createdAt
        }
    }
`;
export const getAllProjectByContractorCompaniesIdsQL = gql`
    query getAllProjectByCcontractorCompaniesIds($contractorId: uuid!) {
        project(
            where: { contractorId: { _eq: $contractorId } }
            order_by: { createdAt: desc }
        ) {
            id
            name
            createdAt
        }
    }
`;
export const getAllProjectByAssetOwnersIdsQL = gql`
    query getAllProjectByCAssetOwnersIds($assetOwnerId: uuid!) {
        project(
            where: { assetOwnerId: { _eq: $assetOwnerId } }
            order_by: { createdAt: desc }
        ) {
            id
            name
            createdAt
        }
    }
`;
export const getAllProjectByTaskSubmitterIdsQL = gql`
    query getAllProjectByTaskSubmitterIds($userId: uuid!, $roleId: Int!) {
        project(
            where: {
                _and: [
                    { assignments: { userId: { _eq: $userId } } }
                    { assignments: { roleId: { _eq: $roleId } } }
                ]
            }
            order_by: { createdAt: desc }
        ) {
           id
            name
            createdAt
        }
    }
`;
export const getTicketById = gql`
    query getTicketById($id: uuid!) {
        ticket(where: { id: { _eq: $id } }, order_by: { createdAt: desc }) {
            ...TicketQL
        }
    }
    ${TicketQL}
`;
export const getAllDisplayTypes = gql`
    query getAllDisplayTypes {
        display_type {
            id
            name
        }
    }
`;

export const updateTicket = gql`
    mutation updateTicket(
        $objects: [ticket_insert_input!]!
        $ticketId: uuid!
    ) {
        delete_ticket_assignment(where: { ticketId: { _eq: $ticketId } }) {
            affected_rows
        }
        insert_ticket(
            objects: $objects
            on_conflict: {
                constraint: ticket_pkey
                update_columns: [
                    title
                    description
                    startDate
                    targetDate
                ]
            }
        ) {
            returning {
                ...TicketQL
            }
        }
    }
    ${TicketQL}
`;
export const deleteTicket = gql`
    mutation deleteTicket($id: uuid!) {
        delete_ticket(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`;

export const deleteSubmission = gql`
    mutation deleteSubmission($taskId: uuid!,$projectId: uuid!) {
        delete_task_submission(
            where: {
                _and: [
                    { taskId: { _eq: $taskId } }
                    { projectId: { _eq: $projectId } }
                ]
            }
        ) {
            affected_rows
        }
    }
`;

export const archivePlanogram = gql`
    mutation archivePlanogram($ids: [String!]!, $archive: Boolean!) {
        update_planogram(
            where: { id: { _in: $ids } }
            _set: { archive: $archive }
        ) {
            affected_rows
        }
    }
`;
export const updateSubmission = gql`
    mutation updateSubmission(
        $objects: [task_submission_insert_input!]!
        $taskId: uuid!
        $projectId: uuid!
    ) {
        delete_task_submission(
            where: {
                _and: [
                    { taskId: { _eq: $taskId } }
                    { projectId: { _eq: $projectId } }
                ]
            }
        ) {
            affected_rows
        }
        insert_task_submission(
            objects: $objects
            on_conflict: {
                constraint: task_submission_pkey
                update_columns: [isCompleted]
            }
        ) {
            returning {
                ...TaskSubmissionQL
            }
        }
    }
    ${TaskSubmissionQL}
`;

export const emailAction = gql`
    query twilioSendGridHandler($request: twilioSendGridHandlerInput!) {
        twilioSendGridHandler(request: $request) {
            status
            data
        }
    }
`;
