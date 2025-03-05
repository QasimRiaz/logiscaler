import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { TranslocoService } from '@ngneat/transloco';
import { User } from 'app/core/user/user.types';
import { user as userData } from 'app/mock-api/common/user/data';
import { CONSTANTS } from 'app/modules/shared/classes/helper/constant';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';

import { assign, cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class UserMockApi {
    private _user: User = userData;
    private _loggedInUser: UserSessionModel;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _localStorage: LocalStorageService, private _translocoService: TranslocoService,) {

        this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER, true); //JSON.parse(localStorage.getItem('aXNMb2dnZWRJbg'));

        if (this._loggedInUser) {
            this._user.id = this._loggedInUser.id;
            this._user.email = this._loggedInUser.email;
            this._user.name = this._loggedInUser.name;
            this._user.avatar = this._loggedInUser.pictureUrl;
            this._user.role = this._loggedInUser.role;
            this._user.roleId = this._loggedInUser.roleId;
            this._user.companyLogo = this._loggedInUser.companyLogo;
        }
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(() => [200, cloneDeep(this._user)]);

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({ request }) => {
                // Get the user mock-api
                const user = cloneDeep(request.body.user);

                // Update the user mock-api
                this._user = assign({}, this._user, user);

                // Return the response
                return [200, cloneDeep(this._user)];
            });
    }
}
