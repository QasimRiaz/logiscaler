import gql from 'graphql-tag';
import { PersonnelQL } from '../fragments/account.fragment';

export const Personnel = gql`
    query Personnel($archive: Boolean!) {
        user(where: { archive: { _eq: $archive } }) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const AllPersonnel = gql`
    query AllPersonnel($archive: Boolean!) {
        user(where: { status: { _eq: $archive } }) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;

export const filterAccounts = gql`
    query filterAccounts(
        $where: user_bool_exp!
        $limit: Int!
        $offset: Int!
        $orderBy: [user_order_by!]!
    ) @cached {
        user_aggregate(where: $where) {
            aggregate {
                totalCount: count
            }
        }
        user(
            where: $where
            limit: $limit
            offset: $offset
            order_by: $orderBy
        ) {
            ...AccountQL
        }
    }
`;
export const filterAccountBySponsorsOrgs = gql`
    query filterAccountBySponsorsOrgs($where: user_bool_exp!) @cached {
        user_aggregate(where: $where) {
            aggregate {
                totalCount: count
            }
        }
        user(where: $where, order_by: { firstName: asc }) {
            ...AccountQL
        }
    }
`;

export const generateReportQL = gql`
    query generateReportQL($where: user_bool_exp!) {
        user(where: $where) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const filterQL = gql`
    query filterQL($where: user_bool_exp!) @cached {
        user(where: $where) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;

export const getPersonnelById = gql`
    query getPersonnelById($id: uuid!) {
        user(where: { id: { _eq: $id } }, order_by: { createdAt: desc }) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getUsersByCompanyId = gql`
    query getUsersByCompanyId($id: uuid!) {
        user(
            where: { userRole: { companyId: { _eq: $id } } }
            order_by: { firstName: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;

export const emailAction = gql`
    query twilioSendGridHandler($request: twilioSendGridHandlerInput!) {
        twilioSendGridHandler(request: $request) {
            status
            data
        }
    }
`;

export const getPersonnelsByCountryId = gql`
    query getPersonnelsByCountryId($countryId: uuid!) {
        user(
            where: { country: { countryId: { _eq: $countryId } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByCountryIds = gql`
    query getPersonnelsByCountryIds($countryId: [uuid!]!) {
        user(
            where: { country: { countryId: { _in: $countryId } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByBranchId = gql`
    query getPersonnelsByBranchId($id: String!) {
        user(
            where: { branch: { branchId: { _eq: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByBranchIds = gql`
    query getPersonnelsByBranchIds($id: [String!]!) {
        user(
            where: { branch: { branchId: { _in: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByPosition = gql`
    query getPersonnelsByPosition($id: String!) {
        user(
            where: { userPosition: { positionId: { _eq: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByPositions = gql`
    query getPersonnelsByPositions($id: [String!]!) {
        user(
            where: { userPosition: { positionId: { _in: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByRegionId = gql`
    query getPersonnelsByRegionId($id: String!) {
        user(
            where: { region: { regionId: { _eq: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsByRegionIds = gql`
    query getPersonnelsByRegionIds($id: [String!]!) {
        user(
            where: { region: { regionId: { _in: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsBySubRegionId = gql`
    query getPersonnelsBySubRegionId($id: String!) {
        user(
            where: { subRegion: { subRegionId: { _eq: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getPersonnelsBySubRegionIds = gql`
    query getPersonnelsBySubRegionIds($id: [String!]!) {
        user(
            where: { subRegion: { subRegionId: { _in: $id } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getBranchManagers = gql`
    query getBranchManagers($positionId: String!) {
        user(
            where: { userPosition: { positionId: { _eq: $positionId } } }
            order_by: { createdAt: desc }
        ) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;
export const getContentByAccount = gql`
    query getContentByAccount($id: String!) {
        campaign(where: { addedBy: { _eq: $id } }) {
            id
        }
        event(where: { addedBy: { _eq: $id } }) {
            id
        }
        lead_submission(where: { addedBy: { _eq: $id } }) {
            id
        }
        sponsor_company(where: { addedBy: { _eq: $id } }) {
            id
        }
        user_campaign_role(where: { userId: { _eq: $id } }) {
            userId
            campaignId
            roleId
        }
    }
`;
export const getOrganizationAccounts = gql`
    query getOrganizationAccounts($organizationId: String!) {
        user(
            where: {
                _or: [
                    { createdBy: { _eq: $organizationId } }
                    { organizationId: { _eq: $organizationId } }
                ]
            }
            order_by: { firstName: asc }
        ) {
            ...AccountQL
        }
    }
`;
export const getAccountsByRoleEventAdmin = gql`
    query getAccountsByRole($levelId: [String!]!) {
        user(where: { userRole: { roleId: { _in: $levelId } } }) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;

export const getAccountByUsername = gql`
    query getAccountByUsername($username: String!) {
        user(where: { username: { _eq: $username } }) {
            ...AccountQL
        }
    }
`;

export const getPersonnelByEmail = gql`
    query getPersonnelByEmail($email: String!) {
        user(where: { email: { _eq: $email } }) {
            ...PersonnelQL
        }
    }
    ${PersonnelQL}
`;

export const getAccountByPhone = gql`
    query getAccountByPhone($phone: String!) {
        user(where: { phone: { _eq: $phone } }) {
            ...AccountQL
        }
    }
`;

export const AddAccount = gql`
    mutation insert_user($objects: [user_insert_input!]!) {
        insert_user(
            objects: $objects
            on_conflict: {
                constraint: user_pkey
                update_columns: [
                    firstName
                    lastName
                    email
                    phone
                    picture
                    countryCode
                ]
            }
        ) {
            returning {
                ...AccountQL
            }
        }
    }
`;
export const AddAccountAndUserRole = gql`
    mutation insert_user(
        $objects: [user_insert_input!]!
        $userId: uuid!
    ) {
        delete_user_role(
            where: {
                _and: [
                    { userId: { _eq: $userId } }
                ]
            }
        ) {
            affected_rows
        }
        insert_user(
            objects: $objects
            on_conflict: {
                constraint: user_pkey
                update_columns: [firstName, lastName, email,pictureUrl]
            }
        ) {
            returning {
                ...PersonnelQL
            }
        }
    }
    ${PersonnelQL}
`;
export const updateUserPicture = gql`
    mutation UpdateUser($id: String!, $pictureUrl: String!) {
        update_user(where: { id: { _eq: $id } }, _set: { photo: $pictureUrl }) {
            AffectedRowsQLi: affected_rows
        }
    }
`;
export const updateWelcomeEmail = gql`
    mutation updateWelcomeEmail($accounts: [user_insert_input!]!) {
        insert_user(
            objects: $accounts
            on_conflict: {
                constraint: user_pkey
                update_columns: [lastWelcomeEmailSend]
            }
        ) {
            affected_rows
        }
    }
`;
export const checkUserEmail = gql`
    query CheckUserEmail($email: String!) {
        user(where: { email: { _eq: $email } }) {
            id
        }
    }
`;

export const importUsersList = gql`
    mutation SaveUsersListMutation($users: [user_insert_input!]!) {
        insert_user(
            objects: $users
            on_conflict: {
                constraint: user_pkey
                update_columns: [firstName, lastName]
            }
        ) {
            returning {
                ...AccountQL
            }
        }
    }
`;

export const DeleteAccountQL = gql`
    mutation DeleteAccountQL($request: fbadminInput!) {
        DeleteFirebaseUsers: firebaseAdminSDK(request: $request) {
            data
            status
        }
    }
`;
export const CreateAccountQL = gql`
    mutation CreateAccountQL($request: fbadminInput!) {
        CreateFirebaseUsers: firebaseAdminSDK(request: $request) {
            data
            status
        }
    }
`;
export const archivePersonnels = gql`
    mutation archivePersonnels($ids: [String!]!, $archive: Boolean!) {
        update_user(where: { id: { _in: $ids } }, _set: { status: $archive }) {
            affected_rows
        }
    }
`;
export const deleteUser = gql`
    mutation deleteUser($id: uuid!) {
        delete_user(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`;

