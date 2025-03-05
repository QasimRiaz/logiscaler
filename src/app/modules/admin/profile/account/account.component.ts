import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    signal,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CONSTANTS } from 'app/modules/shared/classes/helper/constant';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { Utility } from 'app/modules/shared/classes/helper/utility';
import { LogService } from 'app/modules/shared/classes/logs/log.service';
import { GetAllRolesUsecase } from 'app/modules/shared/classes/usecases/role/get-all-roles.usecase';
import { UserUsecases } from 'app/modules/shared/classes/usecases/user/user.usecases';
import { Role } from 'app/modules/shared/models/role.model';
import { User, UserRole } from 'app/modules/shared/models/user.model';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    //   providers: [provideNativeDateAdapter()],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        TextFieldModule,
        TranslocoModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsAccountComponent implements OnInit {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    pictureUrl: any;
    file: any;
    isSaving: boolean = false;
    personnelForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;
    _loggedInUser: UserSessionModel;
    activeLang: string = '';
    disableLang: string | any = '';
    roles: Role[] = [];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _activatedRoute: ActivatedRoute,
        private logger: LogService,
        private _router: Router,
        private _rolesService: GetAllRolesUsecase,
        private _service: UserUsecases,
        private _localStorage: LocalStorageService,
        private _translocoService: TranslocoService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        // Create the form
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

            this.logger.info('User landed on user profile page');
            this.logger.info('Fetching user profile data');

            this.personnelForm = this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                role: ['', Validators.required],
                company: ['', Validators.required],
                password: ['', Validators.required],
                email: ['', [Validators.email]],
                pictureUrl: [''],
            });


            this._service.user$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((user: User) => {

                    // Get the contact
                    this.user = user;

                    // Patch values to the form
                    if (user !== null && user.id != null) {
                        // this.showPassword = false;
                        this.personnelForm.get('password').clearValidators();
                        Utility.setFormControlValueSingle(this.personnelForm, 'firstName', this.user.firstName);
                        Utility.setFormControlValueSingle(this.personnelForm, 'lastName', this.user.lastName);
                        Utility.setFormControlValueSingle(this.personnelForm, 'role', this.user.userRole?.[0].role.name.toString());
                        // Utility.setFormControlValueSingle(this.personnelForm, 'company', this.user.userRole[0].company.name);
                        Utility.setFormControlValueSingle(this.personnelForm, 'email', this.user.email);
                        // this.roleChange({ value: this.personnelForm.get('role').value })
                    } else {
                        // this.showPassword = true;
                    }
                    this._rolesService.roles$
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((roleList: Role[]) => {

                            this.roles = roleList;
                            // console.log(this.roles);
                            if (this._localStorage.isSuperAdmin()) {
                                this.roles = Utility.getSuperAdminRoles();
                            } else if (this._localStorage.isAssetOwner()) {
                                this.roles = Utility.getAssetAdminRoles();
                            } else {
                                this.roles = Utility.getContractorAdminRoles();
                            }

                            // Mark for check
                            this._changeDetectorRef.markForCheck();
                        });
                    // Toggle the edit mode of
                });
        } catch (error) {
            this.logger.error('Fetching user profile data failed', error);
        }
    }

    displayFn(company: any): string {
        return company && company.name ? company.name : '';
    }
    displayRl(role: any): string {
        return role && role.name ? role.name : '';
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
                pictureUrl: _account.pictureUrl,
                email: _account.email,
                createdBy: this.user.id != null ? this.user.createdBy : this._loggedInUser.id,
                createdAt: this.user.id != null ? this.user.createdAt : Utility.parseToDate(),
                status: this.user.id != null ? this.user.status : true,
                updatedAt: Utility.parseToDate(),
            }

            if (this.user.id == null) {
                // const password = Utility.generatePassword();
                const password = _account.password;
                this.logger.info("Checking user email in database", _account?.email);
                this._service.checkUserEmail(_account.email).subscribe(
                    (emailResponse) => {
                        if (emailResponse.length > 0) {
                            // this.logger.info("User email in database already exist", emailResponse);
                            this._snackBar.open("Email already exists.", "close", {
                                duration: 5 * 3000,
                            });

                            // Return an observable that completes immediately
                        } else if ( //!this.personnel.createdInFirebase &&//
                            emailResponse.length == 0) {
                            // this.logger.info("User email in database did not exist", emailResponse);
                            // this.logger.info("Sending request for user creation in firebase and database");
                            this._service.createUserInFireBase(_account.email, password).subscribe(async (userExists: boolean) => {
                                // console.log(userExists);
                                if (userExists) {
                                    await this.updateAccount(personnel, userRole, this.file).then(() => {
                                        this._service.sendWelcomeEmail(personnel.firstName, personnel.lastName, [personnel.email], password).subscribe(
                                            (response) => {
                                                // //console.log(response);
                                                // this.logger.info("Welcome email sent successfully", response);
                                            },
                                            (error) => {
                                                this.logger.error("Error in sending email.", error);
                                            }
                                        );

                                        // /* Sending welcome email to new user created - End */
                                        // this._snackBar.open("Account has been created.", "close", {
                                        //     duration: 5 * 3000,
                                        // });

                                        // this._activityService.executeUpdate()


                                        this._router.navigate(['../'], {
                                            relativeTo: this._activatedRoute,
                                        });

                                    })
                                }
                            }, error => {

                                //console.log(error);
                                // this.logger.error("User creation failed", error);
                                this._snackBar.open("Error!Please try again later.", "close", {
                                    duration: 5 * 3000,
                                });

                            })
                        } else {
                            // this.logger.info("User email in database did not exist", emailResponse);
                            // this.logger.info("Sending request for user creation in database");
                            this.updateAccount(personnel, userRole, this.file);
                        }
                    })

            } else {
                if (!this.user) {
                    this.updateAccount(personnel, userRole, this.file);
                } else {
                    if (this.user.email != _account.email) {
                        this._service.checkUserEmail(_account.email).subscribe((emailResponse) => {
                            if (emailResponse.length > 0) {
                                // this.logger.info("User email in database already exists", emailResponse);
                                this._snackBar.open("Email already exists.", "close", {
                                    duration: 5 * 3000,
                                });

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
            // this.logger.error("Error in Updating Users Data", error);
        }

    }
    async updateAccount(personnel, userRole, file) {
        // const newEmail = personnel.email;
        // const password = personnel.password ?? "";
        this._service.executeUpdate(personnel, userRole, this.file).subscribe(() => {

            // this.logger.info("User updated successfully");
            this._snackBar.open("Account has been updated.", "close", {
                duration: 5 * 3000,
            });

            this._router.navigate(['../'], {
                relativeTo: this._activatedRoute,
            });
        }, error => {

            // this.logger.error("User updating failed", error);
            this._snackBar.open("Error! Please try again later.", "close", {
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
        //             
        //             this._router.navigate(['../'], {
        //                 relativeTo: this._activatedRoute,
        //             });
        //         }, error => {
        //             
        //             this.logger.error("User updating failed", error);
        //             this._snackBar.open("Error! Please try again later.", "close", {
        //                 duration: 5 * 3000,
        //             });
        //         });
        //     } else {
        //         
        //         this.logger.error("User updating failed in firebase");
        //         this._snackBar.open("Error! Please try again later.", "close", {
        //             duration: 5 * 3000,
        //         });
        //     }
        // });
    };

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void {
        // Return if no file was selected
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const file = fileList[0];

        // Return if the file type is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        this.file = file;
        // Create a FileReader to read the file as a data URL
        const reader = new FileReader();
        reader.onload = () => {
            this.pictureUrl = reader.result as string;
            this._changeDetectorRef.markForCheck();
        };

        // Read the file
        reader.readAsDataURL(file);

        // Upload the avatar
        // if (this.personnel.photo) {
        //     this._facadeService.updateAvatar(this.personnel, file).subscribe(() => {
        //         this._snackBar.open("Profile picture has been updated.", "Close", {
        //             duration: 3000, // Display snackbar for 5 seconds
        //         });
        //     });
        //     //this.toggleEditMode(false);
        // } else {
        //     this._facadeService.addAvatar(this.personnel, file).subscribe(() => {
        //         this._snackBar.open("Profile picture has been updated.", "Close", {
        //             duration: 3000, // Display snackbar for 5 seconds
        //         });
        //     });
        //     // this.toggleEditMode(false);
        // }
        //this.account.picture=
    }

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
