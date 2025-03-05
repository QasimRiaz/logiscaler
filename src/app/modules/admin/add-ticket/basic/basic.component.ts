import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CONSTANTS } from 'app/modules/shared/classes/helper/constant';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { Utility } from 'app/modules/shared/classes/helper/utility';
import { LogService } from 'app/modules/shared/classes/logs/log.service';
import { SeverityUsecases } from 'app/modules/shared/classes/usecases/severity/severity.usecases';
import { TicketUsecases } from 'app/modules/shared/classes/usecases/ticket/ticket.usecases';
import {
    SelectOption,
    Task,
    TaskDiscipline,
    TaskGuide,
    TaskOption,
} from 'app/modules/shared/models/task.model';
import { Status, Ticket, TicketAssignment } from 'app/modules/shared/models/ticket.model';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { Subject, takeUntil } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { User } from 'app/modules/shared/models/user.model';
import { UserUsecases } from 'app/modules/shared/classes/usecases/user/user.usecases';
@Component({
    selector: 'app-details-project',
    templateUrl: './basic.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        FormsModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        RouterLink,
    ],
})
export class DetailsComponent implements OnInit, OnDestroy {

    private _loggedInUser: UserSessionModel;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    ticketForm: UntypedFormGroup;
    ticket: Ticket;
    severity: Status[] = [];
    status: Status[] = [];
    isSaving: boolean = false;
    uploadedFiles: File[] = [];
    users: User[] = [];
    attachments: {
        attachmentURL: string;
        fileName: string;
        objectiveId?: string;
    }[] = [];
    allFiles: any[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ticketUsecase: TicketUsecases,
        private _statusUsecase: SeverityUsecases,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private logger: LogService,
        private _translocoService: TranslocoService,
        private _snackBar: MatSnackBar,
        private _localStorage: LocalStorageService,
        private _userService: UserUsecases,
        // private _mailchimpService: MailchimpTransactionalService,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        try {

            this.logger.info('User landed on task edit page');
            this.logger.info('Fetching task data');
            this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);

            this.ticketForm = this._formBuilder.group({
                step1: this._formBuilder.group({
                    title: ['', Validators.required],
                    awsId: ['', Validators.required],
                    description: ['', Validators.required],
                    region: ['', Validators.required],
                    severity: ['', Validators.required],
                    status: ['', Validators.required],
                    startDate: ['', Validators.required],
                    targetDate: ['', Validators.required],
                    userAssignment: [''],
                }),
                // step2: this._formBuilder.group({
                //     firstName: ['', Validators.required],
                //     lastName: ['', Validators.required],
                //     userName: ['', Validators.required],
                //     about: [''],
                // }),
                // step3: this._formBuilder.group({
                //     byEmail: this._formBuilder.group({
                //         companyNews: [true],
                //         featuredProducts: [false],
                //         messages: [true],
                //     }),
                //     pushNotifications: ['everything', Validators.required],
                // }),
            });

            // Get the contact
            this._ticketUsecase.ticket$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((ticket: Ticket) => {
                    // Get the contact
                    this.ticket = ticket;
                    console.log(this.ticket);
                    this.logger.info(
                        'Fetching task data successfully',
                        this.ticket
                    );
                    // Patch values to the form
                    if (ticket !== null && ticket.id != null) {

                        // const formGroup = [];
                        // if (task.guides.length > 0) {
                        //     // Iterate through them
                        //     task.guides.forEach((guide) => {
                        //         // Create an email form group
                        //         formGroup.push(
                        //             this._formBuilder.group({
                        //                 name: [guide.name],
                        //                 file: [guide.url],
                        //                 fileName: [guide.fileName],
                        //             })
                        //         );
                        //     });
                        //     formGroup.forEach((firstNameGroup) => {
                        //         (this.taskForm.get('guides') as UntypedFormArray).push(
                        //             firstNameGroup
                        //         );
                        //     });
                        // } else {
                        //     // Create an email form group
                        //     formGroup.push(
                        //         this._formBuilder.group({
                        //             email: [''],
                        //             fileName: [''],
                        //             label: [''],
                        //         })
                        //     );
                        // }

                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.title',
                            this.ticket.title
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.description',
                            this.ticket.description
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.awsId',
                            this.ticket.awsId
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.region',
                            this.ticket.region
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.severity',
                            this.ticket.severityId
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.status',
                            this.ticket.statusId
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.startDate',
                            this.ticket.startDate
                        );
                        Utility.setFormControlValueSingle(
                            this.ticketForm,
                            'step1.targetDate',
                            this.ticket.targetDate
                        );
                        Utility.setFormControlValueSingle(this.ticketForm, 'step1.userAssignment', this.ticket.assignments.map(item => item.userId));

                        // this.ticket.disciplines.forEach((element) => {
                        //     this.selectDiscipline({
                        //         value: element.discipline,
                        //     });
                        // });
                        // this.ticket.options.forEach((element) => {
                        //     this.addOption({
                        //         value: element.value,
                        //         id: element.id,
                        //     });
                        // });
                    }
                    // Toggle the edit mode off

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });

            this._statusUsecase.status$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((items: Status[]) => {
                    this.status = items;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });

            this._statusUsecase.severity$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((items: Status[]) => {
                    this.severity = items;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });

            this._userService.users$.pipe(
                takeUntil(this._unsubscribeAll))
                .subscribe((personnels: User[]) => {
                    this.logger.info("Fetching user accounts data successfully");
                    this.users = personnels;
                })

            this.ticketForm.updateValueAndValidity();
        } catch (error) {
            this.logger.error('Fetching task data failed', error);
        }

        // Get the organizations

        // this.editMode = true;
    }

    // selectDiscipline(event: any): void {
    //     const selectedOption = event?.option?.value || event.value;

    //     if (!this.selectedDisciplines.includes(selectedOption)) {
    //         this.selectedDisciplines.push(selectedOption);
    //     }

    //     this.taskForm
    //         .get('discipline')
    //         ?.setValue(this.selectedDisciplines.map((d) => d.id));
    // }

    // filterDisciplines(value: string): void {
    //     const filterValue = value.toLowerCase();

    //     if (filterValue) {
    //         this.filteredDisciplines = this.discipline.filter((icon) =>
    //             icon.name.toLowerCase().includes(filterValue)
    //         );
    //     } else {
    //         // If the search value is empty, reset to the original list
    //         this.filteredDisciplines = [...this.discipline];
    //     }
    // }
    /**
     * Removes a discipline from the selected list.
     */
    // remove(selectedOption: any): void {
    //     const index = this.selectedDisciplines.indexOf(selectedOption);

    //     if (index >= 0) {
    //         this.selectedDisciplines.splice(index, 1);
    //     }

    //     this.taskForm
    //         .get('discipline')
    //         ?.setValue(this.selectedDisciplines.map((d) => d.id));
    // }
    /**
     * Removes a discipline from the selected list.
     */
    // removeOption(selectedOption: any): void {
    //     const index = this.selectedOptions.indexOf(selectedOption);

    //     if (index >= 0) {
    //         this.selectedOptions.splice(index, 1);
    //     }

    //     this.taskForm
    //         .get('option')
    //         ?.setValue(this.selectedOptions.map((d) => d));
    // }
    // multiOptionRequired() {
    //     let value = this.taskForm.get('type').value;
    //     return Utility.multiOptionRequiredFor.includes(value);
    // }

    // addOption(event: any, id?: string): void {
    //     this.logger.info(
    //         'User click on add new option in field on lead data fields step',
    //         event?.value
    //     );
    //     const input = event ? event.input : null;
    //     const value = event ? event.value : '';
    //     if (input) {
    //         input.value = '';
    //     }
    //     if (!this.selectedOptions.includes(value)) {
    //         this.selectedOptions.push({
    //             id: id ? id : Utility.generateUUID(),
    //             name: value,
    //         });
    //     }
    //     // this.taskForm.get('options')?.setValue(this.selectedOptions.map((d) => d));
    // }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Update the contact
     */
    async saveBasicForm(): Promise<void> {
        try {
            this.isSaving = true;
            const _account = this.ticketForm.getRawValue();
            this.logger.info('User click on save task button', _account.step1);
            var acoountId = this.ticket!= null && this.ticket.id != null ? this.ticket.id : Utility.generateUUID();
            var assignments: TicketAssignment[] = [];
            console.log(_account.step1);
            if (_account.step1.userAssignment.length > 0) {
                _account.step1.userAssignment.forEach(submitterId => {
                    assignments.push({
                        ticketId: acoountId,
                        userId: submitterId,
                    })
                })
            }
            const ticket: Ticket = {
                id: acoountId,
                title: _account.step1.title,
                awsId: _account.step1.awsId,
                addedBy:
                    this.ticket.id != null
                        ? this.ticket.addedBy
                        : this._loggedInUser.id,
                description: _account.step1.description,
                severityId: _account.step1.severity,
                statusId: _account.step1.status,
                region: _account.step1.region,
                startDate: Utility.parseToDate(_account.step1.startDate),
                targetDate: Utility.parseToDate(_account.step1.targetDate),
                createdAt: Utility.parseToDate(),
            };
            // this.logger.info("User email in database did not exist", emailResponse);
            // this.logger.info("Sending request for user creation in firebase and database")
            await this.updateAccount(ticket, assignments);
        } catch (error) {
            // this.logger.error("Error in Updating Users Data", error);
        }
    }

    async updateAccount(ticket, assignments: TicketAssignment[]) {
        // const newEmail = personnel.email;
        // const password = personnel.password ?? "";
        this._ticketUsecase
            .executeUpdate(ticket, assignments)
            .subscribe(
                () => {
                    this.logger.info('Ticket added successfully');
                    this._snackBar.open('Ticket has been added.', 'close', {
                        duration: 5 * 3000,
                    });
                    this.isSaving = false;
                    this._router.navigate(['/dashboard'], {
                        relativeTo: this._activatedRoute,
                    });
                },
                (error) => {
                    this.isSaving = false;
                    this.logger.error('Ticket adding failed', error);
                    this._snackBar.open(
                        'Error! Please try again later.',
                        'close',
                        {
                            duration: 5 * 3000,
                        }
                    );
                }
            );
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // attachFiles(i, guideForm): void {
    //     // Create a file input element programmatically
    //     const input = document.createElement('input');
    //     input.type = 'file';
    //     input.accept = '*'; // Specify acceptable file types

    //     // Listen to the 'change' event when the user selects a file
    //     input.addEventListener('change', (event: Event) => {
    //         const fileInput = event.target as HTMLInputElement;
    //         if (fileInput?.files && fileInput.files.length > 0) {
    //             const file = fileInput.files[0];
    //             // Update the form control with the file name
    //             this.uploadedFiles.push(file);
    //             this.mergeFiles();
    //             guideForm.get('file')?.setValue(file);
    //             guideForm.get('fileName')?.setValue(file.name);
    //         }
    //     });
    //     // Trigger the file input
    //     input.click();
    // }

    // mergeFiles(): void {
    //     this.allFiles = [...this.uploadedFiles, ...this.attachments];
    // }
}
