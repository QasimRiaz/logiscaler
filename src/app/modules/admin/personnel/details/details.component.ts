import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, map, Observable, startWith, Subject, takeUntil, switchMap, mergeMap } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ListComponent } from '../list/list.component';
import { GetAllRolesUsecase } from 'app/modules/shared/classes/usecases/role/get-all-roles.usecase';
import { Role } from 'app/modules/shared/models/role.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LogService } from 'app/modules/shared/classes/logs/log.service';
import { Utility } from 'app/modules/shared/classes/helper/utility';
import { CONSTANTS } from 'app/modules/shared/classes/helper/constant';
import { User, UserRole } from 'app/modules/shared/models/user.model';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { UserUsecases } from 'app/modules/shared/classes/usecases/user/user.usecases';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Company } from 'app/modules/shared/models/company.model';
import { CompanyUsecases } from 'app/modules/shared/classes/usecases/company/company.usecases';
import { ROLE_IDS } from 'app/modules/shared/classes/helper/enum';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSortModule,
        MatSelectModule,
        TranslocoModule,
        MatTableModule,
        MatRadioModule,
        MatDialogModule,
        MatSidenavModule,
        DatePipe,
        MatDatepickerModule, AsyncPipe,
        FormsModule,
        ReactiveFormsModule, MatAutocompleteModule,
        RouterLink,
        MatTooltipModule,

    ]
})
export class DetailsComponent implements OnInit, OnDestroy {

    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    editMode: boolean = false;
    tagsEditMode: boolean = false;
    // contact: Contact;
    personnelForm: UntypedFormGroup;
    // _loggedInUser: UserSessionModel;
    // _emailTemplates: TenantEmailTemplate[] = [];
    // _welcomeEmailTemplate: TenantEmailTemplate[] = [];
    // selectedEmailTemplate: TenantEmailTemplate;

    // organizations: Tenant[] = [];
    roles: Role[] = [];
    // events: EventModel[] = [];
    filteredOptions: Observable<string[]>;
    filteredRoles: any[];
    background: string = "https://angular-material.fusetheme.com/assets/images/cards/20-640x480.jpg";

    user: User;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    roleId: number = 0;
    pictureUrl: string = '';
    file: any;
    // userRole: number = 2;
    userRole: any = [];
    companies: Company[] = [];
    emailValidator: boolean = false;
    phoneValidator: boolean = false;
    susscessMessage: boolean = false;
    disableEmailInput: boolean = false;
    showPassword: boolean = true;
    resetPassword: boolean = false;
    showCompany: boolean = true;
    editable: boolean = true;
    showRoles: boolean = true;
    emailCheck: boolean = true;
    activeLang: string = '';
    disableLang: string | any = '';
    isSaving: boolean = false;
    _loggedInUser: UserSessionModel;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ListComponent,
        private _rolesService: GetAllRolesUsecase,
        private _userService: UserUsecases,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private logger: LogService,
        private _companyService: CompanyUsecases,
        private _translocoService: TranslocoService,
        private _snackBar: MatSnackBar,
        private _localStorage: LocalStorageService,
        // private _mailchimpService: MailchimpTransactionalService,
        // private logger: LogService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        try {
            this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
            this.activeLang = this._translocoService.getActiveLang();
            let allLangs = this._translocoService.getAvailableLangs();
            if (Array.isArray(allLangs)) {
                this.disableLang = allLangs.find(lang => lang['id'] !== this.activeLang) || '';
                this.disableLang = this.disableLang.id;
            } else {
                this.disableLang = ''; // Default to an empty string or handle as needed
            }

            this.logger.info("User landed on user edit page");
            this.logger.info("Fetching user data");

            // Open the drawer
            // this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);

            // Create the form

            // this.userRole = 2;
            this.personnelForm = this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                role: ['', Validators.required],
                password: ['', Validators.required],
                email: ['', [Validators.email, Validators.required]],
                pictureUrl: [''],
            });
            // this._companyService.companys$
            //     .pipe(takeUntil(this._unsubscribeAll))
            //     .subscribe((companyList: Company[]) => {
            //         this.companies = companyList;
            //         this._changeDetectorRef.markForCheck();
            //     });

            //console.log(this.personnelForm.get('emailCheck').value);
            // Get the contact
            this._userService.user$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((user: User) => {

                    // Get the contact
                    this.user = user;

                    this.logger.info("Fetching user data successfully", this.user);
                    // console.log(this.user);

                    // if (this.personnel.email !== "") {
                    //     this.disableEmailInput = true;
                    // } else {
                    //     this.personnelForm.reset();
                    //     this.disableEmailInput = false;
                    // }
                    // Patch values to the form
                    if (user !== null && user.id != null) {
                        this.showPassword = false;
                        this.personnelForm.get('password').clearValidators();
                        Utility.setFormControlValueSingle(this.personnelForm, 'firstName', this.user.firstName);
                        Utility.setFormControlValueSingle(this.personnelForm, 'lastName', this.user.lastName);
                        Utility.setFormControlValueSingle(this.personnelForm, 'role', this.user.userRole?.[0].roleId.toString());
                        Utility.setFormControlValueSingle(this.personnelForm, 'email', this.user.email);
                        this.pictureUrl = user.pictureUrl;
                    } else {
                        this.showPassword = true;
                    }

                    this._rolesService.roles$
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((roleList: Role[]) => {

                            this.roles = roleList;
                            // console.log(this.roles);
                            // if (this._localStorage.isSuperAdmin()) {
                            //     this.roles = Utility.getSuperAdminRoles();
                            // } else if (this._localStorage.isAssetOwner()) {
                            //     this.roles = Utility.getAssetAdminRoles();
                            // } else {
                            //     this.roles = Utility.getContractorAdminRoles();
                            // }

                            // Mark for check
                            this._changeDetectorRef.markForCheck();
                        });

                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                    this._contactsListComponent.matDrawer.open();

                });

            this.personnelForm.updateValueAndValidity();
        } catch (error) {
            this.logger.error("Fetching user data failed", error);
        }

        // Get the organizations

        // this.editMode = true;

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._contactsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the contact
     */
    async updateContact(): Promise<void> {

        try {
            this.isSaving = true;
            // const regex = /\{([^}]+)\}/g;
            // const matches = [];
            // //console.log(this.selectedEmailTemplate);
            // // Get the contact object
            // this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
            const _account = this.personnelForm.getRawValue();
            this.logger.info("User click on save account button", _account);
            // if (this.emailCheck && this.selectedEmailTemplate == undefined) {
            //     // this.logger.info("Welcome Email Template is missing");
            //     this._snackBar.open("Please select the default Welcome Email Template.", "close", {
            //         duration: 5 * 3000,
            //     });
            //     return;
            // }
            let userRole: UserRole;
            var createdBy = '';
            var acoountId = this.user.id != null ? this.user.id : Utility.generateUUID();

            // if (this._localStorage.isAdmin()) {
            //     organizationId = _account.company.id;
            // } else if (this._localStorage.isSponsor()) {
            //     organizationId = this._loggedInUser.organizationId;
            // }
            if (_account.role != undefined) {
                userRole = {
                    userId: acoountId,
                    roleId: _account.role,
                    // companyId: _account.company.id
                }
            }
            //console.log(this.userOrgRole);
            // console.log(_account);

            const personnel: User = {
                id: acoountId,
                firstName: _account.firstName,
                lastName: _account.lastName,
                pictureUrl: this.pictureUrl,
                email: _account.email.toLowerCase(),
                createdBy: this.user.id != null ? this.user.createdBy : this._loggedInUser.id,
                createdAt: this.user.id != null ? this.user.createdAt : Utility.parseToDate(),
                status: this.user.id != null ? this.user.status : true,
                updatedAt: Utility.parseToDate(),
            }

            if (this.user.id == null) {
                // const password = Utility.generatePassword();
                const password = _account.password;
                this.logger.info("Checking user email in database", _account?.email);
                this._userService.checkUserEmail(_account.email).subscribe(
                    (emailResponse) => {
                        if (emailResponse.length > 0) {
                            this.logger.info("User email in database already exist", emailResponse);
                            // this._snackBar.open(this._translocoService.translate('Email already exists.'), 'close', {
                            //     duration: 5 * 3000,
                            // });
                            // this.isSaving = false;
                            this.personnelForm.get('email')?.setErrors({ emailExists: true });
                            this.isSaving = false;
                            this._changeDetectorRef.markForCheck();
                            // Return an observable that completes immediately
                        } else if ( //!this.personnel.createdInFirebase &&//
                            emailResponse.length == 0) {
                            this.logger.info("User email in database did not exist", emailResponse);
                            this.logger.info("Sending request for user creation in firebase and database");
                            this._userService.createUserInFireBase(_account.email, password).subscribe(async (userExists: boolean) => {
                                // console.log(userExists);
                                if (userExists) {
                                    await this.updateAccount(personnel, userRole, this.file).then(() => {
                                        // this._userService.sendWelcomeEmail(personnel.firstName, personnel.lastName, [personnel.email], password).subscribe(
                                        //     (response) => {
                                        //         // //console.log(response);
                                        //         this.logger.info("Welcome email sent successfully", response);
                                        //     },
                                        //     (error) => {
                                        //         this.logger.error("Error in sending email.", error);
                                        //     }
                                        // );

                                        // /* Sending welcome email to new user created - End */
                                        // this._snackBar.open("Account has been created.", "close", {
                                        //     duration: 5 * 3000,
                                        // });

                                        // this._activityService.executeUpdate()

                                        this.isSaving = false;
                                        this._router.navigate(['../'], {
                                            relativeTo: this._activatedRoute,
                                        });
                                        this.toggleEditMode(false);
                                    })
                                }
                            }, error => {
                                this.isSaving = false;
                                //console.log(error);
                                this.logger.error("User creation failed", error);
                                this._snackBar.open(this._translocoService.translate('Error! Please try again later.'), 'close', {
                                    duration: 5 * 3000,
                                });

                            })
                        } else {
                            this.logger.info("User email in database did not exist", emailResponse);
                            this.logger.info("Sending request for user creation in database");
                            this.updateAccount(personnel, userRole, this.file);
                        }
                    })

            } else {
                if (!this.user) {
                    this.updateAccount(personnel, userRole, this.file);
                } else {
                    if (this.user.email != _account.email) {
                        this._userService.checkUserEmail(_account.email).subscribe((emailResponse) => {
                            if (emailResponse.length > 0) {
                                this.logger.info("User email in database already exists", emailResponse);
                                // this._snackBar.open(this._translocoService.translate('Email already exists.'), 'close', {
                                //     duration: 5 * 3000,
                                // });
                                // this.isSaving = false;
                                this.personnelForm.get('email')?.setErrors({ emailExists: true });
                                this.isSaving = false;
                                this._changeDetectorRef.markForCheck();
                            } else {
                                this.updateAccount(personnel, userRole, this.file);
                            }
                        });
                    } else {
                        this.updateAccount(personnel, userRole, this.file);
                    }
                }
            }
        } catch (error) {
            this.logger.error("Error in Updating Users Data", error);
        }

    }

    async updateAccount(personnel, userRole, file) {
        // const newEmail = personnel.email;
        // const password = personnel.password ?? "";
        this._userService.executeUpdate(personnel, userRole, this.file).subscribe(() => {
            this.toggleEditMode(false);
            // this.logger.info("User updated successfully");
            if (this.user.id != null) {
                this.logger.info("Account updated successfully");
                this._snackBar.open(this._translocoService.translate('Account has been updated.'), 'close', {
                    duration: 5 * 3000,
                });
            } else {
                this.logger.info("Account added successfully");
                this._snackBar.open(this._translocoService.translate('Account has been added.'), 'close', {
                    duration: 5 * 3000,
                });
            }
            this.isSaving = false;
            this._router.navigate(['../'], {
                relativeTo: this._activatedRoute,
            });
        }, error => {
            this.isSaving = false;
            // this.logger.error("User updating failed", error);
            this._snackBar.open(this._translocoService.translate('Error! Please try again later.'), 'close', {
                duration: 5 * 3000,
            });
        });
        // await this._facadeService.updateAccountInFirebase(this.personnel.email, newEmail, password).subscribe((re) => {
        //     if (re) {
        //         this._facadeService.updateAccount(_account, userSpnRole, userOrgRole, tenantId, sponsorCompanyId).subscribe(() => {
        //             this.toggleEditMode(false);
        //             // this.logger.info("User updated successfully");
        //             this._snackBar.open("Account has been updated.", "close", {
        //                 duration: 5 * 3000,
        //             });
        //             this.isSaving = false;
        //             this._router.navigate(['../'], {
        //                 relativeTo: this._activatedRoute,
        //             });
        //         }, error => {
        //             this.isSaving = false;
        //             this.logger.error("User updating failed", error);
        //             this._snackBar.open("Error! Please try again later.", "close", {
        //                 duration: 5 * 3000,
        //             });
        //         });
        //     } else {
        //         this.isSaving = false;
        //         this.logger.error("User updating failed in firebase");
        //         this._snackBar.open("Error! Please try again later.", "close", {
        //             duration: 5 * 3000,
        //         });
        //     }
        // });
    };
    changePassword(): void {
        this.resetPassword = true;
        // this._facadeService.sendResetEmail(this.personnel.email).subscribe(() => {
        //     this._snackBar.open("Password reset email has been sent successfully.", "close", {
        //         duration: 5 * 3000,
        //     });
        // });

    }
    // validateEmail(email: string) {
    //     this.emailValidator = false;
    //     this._facadeService.getEmail(email).subscribe((account: Personnel) => {
    //         if (account && (Object.keys(account).length !== 0))
    //             this.emailValidator = true;
    //     });
    // }

    // validatePhone(phone: string) {
    //     this.phoneValidator = false;
    //     this._facadeService.getPhone(phone).subscribe((account: Personnel) => {
    //         if (account && (Object.keys(account).length !== 0))
    //             this.phoneValidator = true;
    //     });
    // }

    /**
     * Delete the contact
     */
    // deleteContact(): void {
    //     // Open the confirmation dialog
    //     const confirmation = this._fuseConfirmationService.open({
    //         title: 'Delete contact',
    //         message: 'Are you sure you want to delete this contact? This action cannot be undone!',
    //         actions: {
    //             confirm: {
    //                 label: 'Delete'
    //             }
    //         },

    //     });

    //     // Subscribe to the confirmation dialog closed action
    //     confirmation.afterClosed().subscribe((result) => {

    //         // If the confirm button pressed...
    //         if (result === 'confirmed') {
    //             // Get the current contact's id
    //             const id = this.contact.id;

    //             // Get the next/previous contact's id
    //             const currentContactIndex = this.contacts.findIndex(item => item.id === id);
    //             const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.contacts.length - 1)) ? -1 : 1);
    //             const nextContactId = (this.contacts.length === 1 && this.contacts[0].id === id) ? null : this.contacts[nextContactIndex].id;

    //             // Delete the contact
    //             this._contactsService.deleteContact(id)
    //                 .subscribe((isDeleted) => {

    //                     // Return if the contact wasn't deleted...
    //                     if (!isDeleted) {
    //                         return;
    //                     }

    //                     // Navigate to the next contact if available
    //                     if (nextContactId) {
    //                         this._router.navigate(['../', nextContactId], { relativeTo: this._activatedRoute });
    //                     }
    //                     // Otherwise, navigate to the parent
    //                     else {
    //                         this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    //                     }

    //                     // Toggle the edit mode off
    //                     this.toggleEditMode(false);
    //                 });

    //             // Mark for check
    //             this._changeDetectorRef.markForCheck();
    //         }
    //     });

    // }

    /**
    * Upload avatar
    *
    * @param fileList
    */
    uploadAvatar(fileList: FileList): void {
        // Return if no file is selected
        if (!fileList || fileList.length === 0) {
            this.pictureUrl = null;
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const file = fileList[0];

        // Validate the file type
        if (!allowedTypes.includes(file.type)) {
            console.error('Invalid file type');
            return;
        }

        this.file = file;

        // Use FileReader to read the file and update the preview URL
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            this.pictureUrl = event.target?.result as string;
            this._changeDetectorRef.detectChanges();
        };
        reader.readAsDataURL(this.file);
    }


    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        // const avatarFormControl = this.personnelForm.get('avatar');
        // // Set the avatar as null
        // avatarFormControl.setValue(null);
        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;
        this.pictureUrl = null;
        this.user.pictureUrl = null;
        this.file = null;
        this.personnelForm.get('pictureUrl').setValue(null);
        // Update the contact
        // this.contact.avatar = null;
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

}
