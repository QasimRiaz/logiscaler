import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LogService } from 'app/modules/shared/classes/logs/log.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Utility } from 'app/modules/shared/classes/helper/utility';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { CONSTANTS } from 'app/modules/shared/classes/helper/constant';
import { User } from 'app/modules/shared/models/user.model';
import { UserUsecases } from 'app/modules/shared/classes/usecases/user/user.usecases';
import { Role } from 'app/modules/shared/models/role.model';
import { Company } from 'app/modules/shared/models/company.model';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-list',
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
    MatDialogModule, ReactiveFormsModule,
    MatSidenavModule, MatTabsModule,
    RouterOutlet, RouterLink,
    DatePipe, MatTooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild('fileInput') fileInputVariable: ElementRef;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  activeLang: string = '';
  copyMapData: any[] = [];
  data: any[] = [];
  roles: Role[] = [];
  drawerMode: 'side' | 'over';
  selectedTab: number = 0;
  selection = new SelectionModel<any>(true, []);
  tableColumns: string[] = [
    'Select',
    'action',
    'firstName',
    'lastName',
    'role',
    'company',
    // 'phone',
    'email',
    'createdAt',
  ];
  itemForm: UntypedFormGroup;
  moduleId: string = '6';
  contractor: Company[] = [];
  assetOwner: Company[] = [];
  currentModuleAccess: { [action: string]: boolean }[] = [];
  _loggedInUser: UserSessionModel;

  constructor(
    private _userService: UserUsecases,
    private _localStorage: LocalStorageService,
    private _fuseConfirmationService: FuseConfirmationService,
    private logger: LogService,
    private _matDialog: MatDialog,
    private _translocoService: TranslocoService,
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router, private _snackBar: MatSnackBar,
    public _activatedRoute: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    try {

      this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
      this.itemForm = this._formBuilder.group({
        assetOwner: ['', Validators.required],
        contractor: [''],
        role: ['']
      });

      this.activeLang = this._translocoService.getActiveLang();
      this.logger.info("User landed on user accounts page");
      this.logger.info("Fetching user accounts data");

      this._userService.users$.pipe(
        takeUntil(this._unsubscribeAll))
        .subscribe((personnels: User[]) => {

          this.logger.info("Fetching user accounts data successfully");
          // console.log(personnels);
          // this.personnels = personnels;
          this.selection.clear();
          const mapData = this.mapTableData(personnels);
          this.copyMapData = this.data = mapData;
          // console.log(this.copyMapData);
          this.dataSource = new MatTableDataSource(mapData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
    } catch (error) {
      this.logger.error("Fetching user accounts data failed", error);
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /**
     * On destroy
     */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
         * On backdrop clicked
         */
  mapTableData(data: User[]) {

    let myData: any[] = [];
    for (let dat of data) {

      let obj = {
        id: dat.id,
        firstName: dat.firstName,
        lastName: dat.lastName,
        email: dat.email,
        phone: dat.phone,
        archive: dat.status,
        createdAt: dat.createdAt,
        role: dat.userRole.filter(roleObj => roleObj.role && roleObj.role.name).map(roleObj => roleObj.role.name),
        // company: dat.userRole.filter(roleObj => roleObj.role && roleObj.role.name).map(roleObj => roleObj.company.name),
      }
      myData.push(obj);
    }
    return myData;
  }

  sendResetPasswordEmail(): void {

    let selectionArray = this.selection.selected;
    this._userService.executeSendResetEmailInBulk(selectionArray).subscribe((res) => {
      //console.log(res);

      this._snackBar.open(this._translocoService.translate("Password reset email has been sent successfully."), "close", {
        duration: 3000,
      });
      this.selection.clear();
    });

  }


  /**
       * On backdrop clicked
       */
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
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


  isAllSelected() {
    ////console.log(this.dataSource);
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    // this.logger.info("User check all user accounts rows");
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach((row) =>
        this.selection.select(row)
      );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'
      } player ${row.firstName} ${row.lastName}`;
  }


  applyFilter(filterValue: string) {
    // this.logger.info("User search on user accounts table", filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();;
  }


  deleteUser(account) {
    // console.log(account);
    this.logger.info("User click on delete user account button", account);
    const confirmation = this._fuseConfirmationService.open({
      title: this._translocoService.translate('Delete User'),
      message: this._translocoService.translate('Are you sure you want to delete this user? All related projects and tasks will be deleted. This action cannot be undone!'),
      actions: {
        confirm: {
          label: this._translocoService.translate('Delete')
        },
        cancel: {
          label: this._translocoService.translate('Cancel')
        }
      },
    });

    confirmation.afterClosed().subscribe(async (result) => {
      if (result === 'confirmed') {
        this.logger.info("User confirmed to delete user account", account);
        this._userService.deleteUserInFirebase([account.email]).then((res) => {
          // console.log(res);
          if (res) {
            this._userService.deleteUser(account.id).subscribe((res) => {
              // console.log(res);
              if (res) {
                this.logger.info("User account has been deleted successfully", account);
                this._snackBar.open(this._translocoService.translate("User has been deleted successfully."), "close", {
                  duration: 3000,
                });
              } else {
                this.logger.info("Error in deleting user account", account);
                this._snackBar.open(this._translocoService.translate('Error! Please Try Again'), 'close', {
                  duration: 3000,
                })
              }
            });
          } else {
            this.logger.info("Error in deleting user account", account);
            this._snackBar.open(this._translocoService.translate('Error! Please Try Again'), 'close', {
              duration: 3000,
            })
          }
        });
      } else {
        this.logger.info("User canceled to delete user account", account);
      }
    })
  }

}
