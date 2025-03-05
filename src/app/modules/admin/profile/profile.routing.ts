import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UserUsecases } from 'app/modules/shared/classes/usecases/user/user.usecases';
import { GetAllRolesUsecase } from 'app/modules/shared/classes/usecases/role/get-all-roles.usecase';


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

export default [
    {
        path: ':id',
        component: ProfileComponent,
        resolve: {
            contact: personnelResolver,
            roles: () => inject(GetAllRolesUsecase).execute(),
        },
    }
] as Routes;
