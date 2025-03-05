import { Injectable } from '@angular/core';
import {
    Observable,
    pipe,
    from,
    concatMap,
    of,
    finalize,
    switchMap, catchError, throwError, forkJoin,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import * as Query from 'app/modules/shared/graphQL/company.graphql';
import { CompanyRepository } from '../../repository/assetOwner.repository';
import { Company } from 'app/modules/shared/models/company.model';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import { LocalStorageService } from '../../helper/localstorage';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { CONSTANTS } from '../../helper/constant';
import { ROLE_IDS } from '../../helper/enum';

@Injectable({
    providedIn: 'root',
})
export class CompanyAPI extends CompanyRepository {

    _localStorage = inject(LocalStorageService);
    _loggedInUser: UserSessionModel;
    constructor(private apollo: Apollo, private storage: Storage) {
        super();
    }

    getAllCompanies(typeId: number): Observable<Company[]> {
        this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
        var query;
        let variables: any = {};
        query = Query.getAllCompanies;
        variables = {
            typeId: typeId,
        };
        if (this._loggedInUser.roleId.toString() == ROLE_IDS.AssetOwnerAdmin) {
            query = Query.getCompanyById;
            variables = {
                id: this._loggedInUser.companyId,
                typeId: typeId,
            };
        } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.ContractorAdmin) {
            if (typeId == 1) {
                query = Query.getAllCompanies;
                variables = {
                    typeId: typeId,
                };
            } else {
                query = Query.getCompanyById;
                variables = {
                    id: this._loggedInUser.companyId,
                    typeId: typeId,
                };

            }
        }
        return this.apollo
            .subscribe<Company[]>({
                query: query,
                variables: variables
            })
            .pipe(map((item) => item.data['company']));
    }

    getCompanyById(id: string, typeId: number): Observable<Company> {
        return this.apollo
            .subscribe<Company>({
                query: Query.getCompanyById,
                variables: {
                    id: id,
                    typeId: typeId,
                },
            })
            .pipe(map((item) => item.data['company'][0]));
    }

    updateCompany(company: Company, file: File | any): Observable<Company> {
        // If the file is an instance of File, upload it and get the URL
        if (file instanceof File) {
            const fileName = `logo/${company.id}`;
            const storageRef = ref(this.storage, fileName);

            return from(uploadBytes(storageRef, file)).pipe(
                switchMap(() => getDownloadURL(storageRef)),
                switchMap((downloadUrl: string) => {
                    // console.log(downloadUrl);

                    company.logo = downloadUrl;  // Update the company with the file URL

                    // Run the mutation with the updated company object
                    return this.apollo
                        .mutate<Company>({
                            mutation: Query.updateCompany,
                            variables: {
                                objects: [
                                    {
                                        id: company.id,
                                        name: company.name,
                                        typeId: company.typeId,
                                        status: company.status,
                                        createdBy: company.createdBy,
                                        logo: company.logo,  // Include the updated logo URL if file was uploaded
                                    },
                                ],
                            },
                        })
                        .pipe(map((item) => item.data['insert_company'].returning[0]));
                })
            );
        } else {
            // If no file is provided or it's not a valid File, run the mutation without the file
            return this.apollo
                .mutate<Company>({
                    mutation: Query.updateCompany,
                    variables: {
                        objects: [
                            {
                                id: company.id,
                                name: company.name,
                                typeId: company.typeId,
                                status: company.status,
                                createdBy: company.createdBy,
                                logo: company.logo,  // Keep the existing logo
                            },
                        ],
                    },
                })
                .pipe(map((item) => item.data['insert_company'].returning[0]));
        }
    }
    deleteAssetOwner(id: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deleteCompany,
                    variables: {
                        id: id,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        observer.next(false);
                        observer.error(error);
                    }
                );
        });
    }
    deleteContractor(id: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deleteCompany,
                    variables: {
                        id: id,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        observer.next(false);
                        observer.error(error);
                    }
                );
        });
    }

}