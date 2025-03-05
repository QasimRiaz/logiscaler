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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
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
        MatSlideToggleModule, AsyncPipe,
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
    roleForm: UntypedFormGroup;
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

    role: Role;
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
            this.roleForm = this._formBuilder.group({
                name: ['', Validators.required],
                edit: [false],
                view: [false],
                delete: [false],
            });
            // this._companyService.companys$
            //     .pipe(takeUntil(this._unsubscribeAll))
            //     .subscribe((companyList: Company[]) => {
            //         this.companies = companyList;
            //         this._changeDetectorRef.markForCheck();
            //     });

            //console.log(this.roleForm.get('emailCheck').value);
            // Get the contact
            this._rolesService.role$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((roleList: Role) => {
                    // Get the contact
                    this.role = roleList;
                    this.logger.info("Fetching user data successfully", this.role);
                    if (roleList !== null && roleList.id != null) {
                        Utility.setFormControlValueSingle(this.roleForm, 'name', this.role.name);
                        Utility.setFormControlValueSingle(this.roleForm, 'edit', this.role.editAccess);
                        Utility.setFormControlValueSingle(this.roleForm, 'view', this.role.viewAccess);
                        Utility.setFormControlValueSingle(this.roleForm, 'delete', this.role.deleteAccess);
                    }
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                    this._contactsListComponent.matDrawer.open();

                });

            this.roleForm.updateValueAndValidity();
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
     * Update the contact
     */
    async updateContact(): Promise<void> {

        try {
            this.isSaving = true;
            const _account = this.roleForm.getRawValue();
            this.logger.info("User click on save role button", _account);
            var acoountId = this.role != null && this.role.id != null ? this.role.id : Utility.generateUUID();
            const role: Role = {
                id: acoountId,
                name: _account.name,
                editAccess: _account.edit,
                viewAccess: _account.view,
                deleteAccess: _account.delete,
            }
            this.updateAccount(role);

        } catch (error) {
            this.logger.error("Error in Updating Users Data", error);
        }

    }

    async updateAccount(role) {
        // const newEmail = personnel.email;
        // const password = personnel.password ?? "";
        this._rolesService.executeUpdate(role).subscribe(() => {
            // this.logger.info("User updated successfully");
            if (this.role.id != null) {
                this.logger.info("Account updated successfully");
                this._snackBar.open(this._translocoService.translate('Role has been updated.'), 'close', {
                    duration: 5 * 3000,
                });
            } else {
                this.logger.info("Role added successfully");
                this._snackBar.open(this._translocoService.translate('Role has been added.'), 'close', {
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
