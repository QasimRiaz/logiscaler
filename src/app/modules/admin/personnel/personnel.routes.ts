import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { PersonnelComponent } from "./personnel.component";
import { inject } from "@angular/core";
import { ListComponent } from "./list/list.component";
import { DetailsComponent } from "./details/details.component";
import { catchError, throwError } from "rxjs";
import { GetAllRolesUsecase } from "app/modules/shared/classes/usecases/role/get-all-roles.usecase";
import { UserUsecases } from "app/modules/shared/classes/usecases/user/user.usecases";
import { CompanyUsecases } from "app/modules/shared/classes/usecases/company/company.usecases";


const personnelResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const personnelService = inject(UserUsecases);
    const router = inject(Router);

    return personnelService.getUserById(route.paramMap.get('id')).pipe(
        // Error here means the requested contact is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateContactsDetails = (
    component: DetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/users')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: PersonnelComponent,
        children: [
            {
                path: '',
                component: ListComponent,
                resolve: {
                    personnels: () => inject(UserUsecases).getAllUsers(true),
                },
                children: [
                    {
                        path: ':id',
                        component: DetailsComponent,
                        resolve: {
                            contact: personnelResolver,
                            roles: () => inject(GetAllRolesUsecase).execute(),
                            // positions: () => inject(GetAllPositionsUsecase).execute(),
                            // countries: () => inject(GetAllCountriesUsecase).execute(true),
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ],
            }
        ]
    }
] as Routes;