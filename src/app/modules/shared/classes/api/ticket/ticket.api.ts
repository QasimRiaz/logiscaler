import { inject, Injectable } from '@angular/core';
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
import { Storage } from '@angular/fire/storage';
import * as Query from 'app/modules/shared/graphQL/project.graphql';
import { CONSTANTS } from '../../helper/constant';
import { LocalStorageService } from '../../helper/localstorage';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { TicketRepository } from '../../repository/ticket.repository';
import { Ticket, TicketAssignment } from 'app/modules/shared/models/ticket.model';
import { ROLE_IDS } from '../../helper/enum';
import { Apollo } from 'apollo-angular';
// import { ProjectHelper } from './ticket-helper';
import { TaskSubmission, TaskSubmissionMeta } from 'app/modules/shared/models/task.model';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { environment } from 'environments/environment';
import { TicketHelper } from './ticket-helper';

@Injectable({
    providedIn: 'root',
})
export class TicketAPI extends TicketRepository {

    _localStorage = inject(LocalStorageService);
    _loggedInUser: UserSessionModel;
    // mapper = new ProjectHelper();
    constructor(private apollo: Apollo, private storage: Storage) {
        super();
    }

    getAllTickets(): Observable<Ticket[]> {
        this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
        var query;
        let variables: any = {};
        query = Query.getAllProjectByContractorCompaniesQL;
        // variables = {
        //     contractorId: this._loggedInUser.companyId,
        // };
        // if (this._loggedInUser.roleId.toString() == ROLE_IDS.SuperAdmin) {
        //     query = Query.getAllTicketQL;
        //     variables = {};
        // } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.ContractorAdmin) {
        //     query = Query.getAllProjectByContractorCompaniesQL;
        //     variables = {
        //         contractorId: this._loggedInUser.companyId,
        //     };
        // } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.AssetOwnerAdmin) {
        //     query = Query.getAllProjectByAssetOwnersQL;
        //     variables = {
        //         assetOwnerId: this._loggedInUser.companyId,
        //     };
        // } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.TaskSubmitter || this._loggedInUser.roleId.toString() == ROLE_IDS.Viewer) {
        //     query = Query.getAllProjectByTaskSubmitterQL;
        //     variables = {
        //         userId: this._loggedInUser.id,
        //         roleId: this._loggedInUser.roleId,
        //     };
        // }

        return this.apollo
            .subscribe<Ticket[]>({
                query: Query.getAllTicketQL,
                // variables: variables
            })
            .pipe(map((item) => item.data['ticket']));
    }

    // getAllProjectIds(): Observable<Project[]> {

    //     this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
    //     var query;
    //     let variables: any = {};
    //     query = Query.getAllProjectByContractorCompaniesIdsQL;
    //     variables = {
    //         contractorId: this._loggedInUser.companyId,
    //     };
    //     if (this._loggedInUser.roleId.toString() == ROLE_IDS.SuperAdmin) {
    //         query = Query.getAllProjectIdsQL;
    //         variables = {};
    //     } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.ContractorAdmin) {
    //         query = Query.getAllProjectByContractorCompaniesIdsQL;
    //         variables = {
    //             contractorId: this._loggedInUser.companyId,
    //         };
    //     } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.AssetOwnerAdmin) {
    //         query = Query.getAllProjectByAssetOwnersIdsQL;
    //         variables = {
    //             assetOwnerId: this._loggedInUser.companyId,
    //         };
    //     } else if (this._loggedInUser.roleId.toString() == ROLE_IDS.TaskSubmitter || this._loggedInUser.roleId.toString() == ROLE_IDS.Viewer) {
    //         query = Query.getAllProjectByTaskSubmitterIdsQL;
    //         variables = {
    //             userId: this._loggedInUser.id,
    //             roleId: this._loggedInUser.roleId,
    //         };
    //     }

    //     return this.apollo
    //         .subscribe<Project[]>({
    //             query: query,
    //             variables: variables
    //         })
    //         .pipe(map((item) => item.data['project']));
    // }


    getTicketById(id: string): Observable<Ticket> {
        return this.apollo
            .subscribe<Ticket>({
                query: Query.getTicketById,
                variables: {
                    id: id,
                },
            })
            .pipe(map((item) => item.data['ticket'][0]));
    }
    executeUpdate(ticket: Ticket, assignment: TicketAssignment[]): Observable<Ticket> {

        return this.apollo.mutate<Ticket>({
            mutation: Query.updateTicket,
            variables: {
                objects: [
                    {
                        id: ticket.id,
                        title: ticket.title,
                        description: ticket.description,
                        statusId: ticket.statusId,
                        severityId: ticket.severityId,
                        awsId: ticket.awsId,
                        region: ticket.region,
                        addedBy: ticket.addedBy,
                        startDate: ticket.startDate,
                        targetDate: ticket.targetDate,
                        assignments: TicketHelper.insertAsignment(assignment),
                    }
                ],
                ticketId: ticket.id,
            },
        }).pipe(
            map((response: any) => response.data['insert_ticket'].returning[0])
        );
    }
    deleteTicket(id: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deleteTicket,
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

    // deleteSubmission(taskId: string, projectId: string): Observable<boolean> {
    //     return new Observable<boolean>((observer) => {
    //         this.apollo
    //             .mutate<any>({
    //                 mutation: Query.deleteSubmission,
    //                 variables: {
    //                     taskId: taskId,
    //                     projectId: projectId,
    //                 },
    //             })
    //             .subscribe(
    //                 ({ data }) => {
    //                     observer.next(true);
    //                     observer.complete();
    //                 },
    //                 (error) => {
    //                     observer.next(false);
    //                     observer.error(error);
    //                 }
    //             );
    //     });
    // }
    // addSubmission(taskSubmission: TaskSubmission, taskSubmissionMeta: TaskSubmissionMeta[]): Observable<boolean> {

    //     const uploadTasks = taskSubmissionMeta
    //         .filter((guide) => guide?.file instanceof File) // Only process guides with a `File` object
    //         .map((guide) => {
    //             const file = guide.file as File;
    //             const filePath = `submissions/${guide.id}/${file.name}`;
    //             const fileName = file.name;
    //             const documentType = file.type;
    //             const storageRef = ref(this.storage, filePath);

    //             return from(uploadBytes(storageRef, file)).pipe(
    //                 switchMap(() => getDownloadURL(storageRef)),
    //                 map((downloadUrl: string) => ({
    //                     id: guide.id,
    //                     submissionId: guide.submissionId,
    //                     fieldKey: guide.fieldKey,
    //                     fieldValue: guide.fieldValue,
    //                     documentType: documentType,
    //                     name: fileName,
    //                     url: downloadUrl,
    //                 }))
    //             );
    //         });

    //     const existingAttachments = taskSubmissionMeta
    //         .filter((guide) => !(guide.file instanceof File))
    //         .map((guide) => ({

    //             id: guide.id,
    //             submissionId: guide.submissionId,
    //             fieldKey: guide.fieldKey,
    //             fieldValue: guide.fieldValue,
    //             name: guide.name,
    //             url: guide.url,
    //             documentType: guide.documentType,
    //         }));

    //     // Combine upload observables
    //     const uploadObservable =
    //         uploadTasks.length > 0 ? forkJoin(uploadTasks) : of([]);

    //     return uploadObservable.pipe(
    //         switchMap((uploadedFiles) => {
    //             // Combine uploaded files and existing attachments
    //             const objectiveAttachments = [
    //                 ...uploadedFiles,
    //                 ...existingAttachments,
    //             ];
    //             return new Observable<boolean>((observer) => {
    //                 this.apollo
    //                     .mutate<any>({
    //                         mutation: Query.updateSubmission,
    //                         variables: {
    //                             objects: [
    //                                 {
    //                                     id: taskSubmission.id,
    //                                     userId: taskSubmission.userId,
    //                                     taskId: taskSubmission.taskId,
    //                                     projectId: taskSubmission.projectId,
    //                                     isCompleted: taskSubmission.isCompleted,
    //                                     meta: ProjectHelper.insertMeta(objectiveAttachments),
    //                                 }
    //                             ],
    //                             taskId: taskSubmission.taskId,
    //                             projectId: taskSubmission.projectId,
    //                         },
    //                     })
    //                     .subscribe(
    //                         ({ data }) => {
    //                             observer.next(data);
    //                             observer.complete();
    //                         },
    //                         (error) => {
    //                             observer.next(false);
    //                             observer.error(error);
    //                         }
    //                     );
    //             });
    //         })
    //     );
    // }

    // sendAssignmentEmail(firstName: string, lastName: string, email: string[], projectName: string, role: string): Observable<boolean> {

    //     let template = CONSTANTS._projectAssignmentEmailTemplate.template;
    //     let subject = CONSTANTS._projectAssignmentEmailTemplate.subject;

    //     template = template
    //         .replace("{{firstName}}", firstName)
    //         .replace("{{lastName}}", lastName)
    //         .replace("{{email}}", email[0])
    //         .replace("{{projectName}}", projectName)
    //         .replace("{{role}}", role)
    //         .replaceAll("{{appURL}}", environment.appUrl);

    //     return this.apollo
    //         .subscribe<any>({
    //             query: Query.emailAction,
    //             variables: {
    //                 request: {
    //                     type: "sendEmail",
    //                     email: email,
    //                     subject: subject,
    //                     template: template,
    //                 },
    //             },
    //         })
    //         .pipe(map((item) => item.data));
    // }
    // sendTaskSubmissionEmail(ownerFirstName: string, ownerLastName: string, submitterName: string, email: string[], projectName: string, taskName: string): Observable<boolean> {
    //     let template = CONSTANTS._taskSubmissionEmailTemplate.template;
    //     let subject = CONSTANTS._taskSubmissionEmailTemplate.subject;

    //     template = template
    //         .replace('{{ownerFirstName}}', ownerFirstName)
    //         .replace('{{ownerLastName}}', ownerLastName)
    //         .replace('{{submitterName}}', submitterName)
    //         .replace('{{taskName}}', taskName)
    //         .replace('{{projectName}}', projectName)
    //         .replaceAll("{{appURL}}", environment.appUrl);

    //     return this.apollo
    //         .subscribe<any>({
    //             query: Query.emailAction,
    //             variables: {
    //                 request: {
    //                     type: "sendEmail",
    //                     email: email,
    //                     subject: subject,
    //                     template: template,
    //                 },
    //             },
    //         })
    //         .pipe(map((item) => item.data));
    // }
}
