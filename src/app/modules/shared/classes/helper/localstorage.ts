import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from '@angular/common';
import { Crypto } from './crypto';
import { UserSessionModel } from '../../models/userSession.model';
import { CONSTANTS } from './constant';
import { Role, RoleAccess, UserRoleAccess } from '../../models/role.model';
import { User } from '../../models/user.model';
import { ROLE_IDS } from './enum';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor(private router: Router, private location: Location) { }

    public set(key: string, value: object) {
        localStorage.setItem(key, Crypto.encryptData(value));
    }

    get(key: string, flag: boolean = false): UserSessionModel {
        ////console.log(key);

        let user = Crypto.decryptData(localStorage.getItem(key));

        if (!user) {
            if (!flag) {
                this.router.navigate(['/sign-out']);
            }
            return null;
        }

        return user;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }

    initiateUserSession(user: User): UserSessionModel {

        let userName = user.firstName + " " + user.lastName;
        let userRole = user.userRole?.[0]?.role;

        let userSession: UserSessionModel = {
            id: user.id,
            roleId: userRole?.id,
            name: userName,
            role: userRole?.name,
            email: user.email,
            phone: user.phone,
            pictureUrl: user.pictureUrl,
            editAccess: userRole?.editAccess,
            viewAccess: userRole?.viewAccess,
            deleteAccess: userRole?.deleteAccess,
        }
        return userSession;
    }
    isSuperAdmin() {

        try {
            let _currentUser = this.get(CONSTANTS.LOGGED_IN_USER);
            return _currentUser.roleId.toString() == ROLE_IDS.SuperAdmin;
        } catch (error) {
            console.error('Error in isAdmin:', error);
            this.router.navigate(['/sign-out']);
            return false;
        }
    }

    isAssetOwner() {
        try {
            let _currentUser = this.get(CONSTANTS.LOGGED_IN_USER);

            if (_currentUser)
                return _currentUser.roleId.toString() == ROLE_IDS.AssetOwnerAdmin; //_currentUser.orgRoles.findIndex(r => r.roleId == UserRole.EVENT_ORGANIZER) == 0; // statement updated by Feroze
            else
                return null;
        } catch (error) {
            console.error('Error in isAdmin:', error);
            this.router.navigate(['/sign-out']);
            return false;
        }

    }
    isContractor() {
        try {
            let _currentUser = this.get(CONSTANTS.LOGGED_IN_USER);
            if (_currentUser)
                return _currentUser.roleId.toString() == ROLE_IDS.ContractorAdmin;
            else
                return null;
        } catch (error) {
            console.error('Error in isAdmin:', error);
            this.router.navigate(['/sign-out']);
            return false;
        }

    }

    isTaskSubmitter() {
        try {
            let _currentUser = this.get(CONSTANTS.LOGGED_IN_USER);

            if (_currentUser)
                return _currentUser.roleId.toString() == ROLE_IDS.TaskSubmitter; //_currentUser.sponsorRoles.findIndex(r => r.roleId == UserRole.SPONSOR) == 0; // statement updated by Feroze
            else
                return null;
        } catch (error) {
            console.error('Error in isAdmin:', error);
            this.router.navigate(['/sign-out']);
            return false;
        }
    }

    // getCurrentModuleAccess(moduleId: string): any {
    //     // Ensure _loggedInUser and moduleAccess are available
    //     let _currentUser = this.get(CONSTANTS.LOGGED_IN_USER);
    //     if (!_currentUser || !_currentUser.moduleAccess) {
    //         console.error("Logged-in user data or moduleAccess is missing");
    //         return null;
    //     }

    //     // Find the moduleAccess object for the given moduleId
    //     const currentModuleAccess = _currentUser.moduleAccess.find(
    //         (modAccess: any) => modAccess.moduleId === moduleId
    //     );

    //     if (!currentModuleAccess) {
    //         console.warn(`No access found for moduleId: ${moduleId}`);
    //         return null;
    //     }

    //     // Return the access details for the current module
    //     return currentModuleAccess.moduleAccess;
    // }

}