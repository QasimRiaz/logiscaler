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
import { GetAllRolesUsecase } from 'app/modules/shared/classes/usecases/role/get-all-roles.usecase';

@Component({
  selector: 'app-list-roles',
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
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild('fileInput') fileInputVariable: ElementRef;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  copyMapData: any[] = [];
  data: any[] = [];
  roles: Role[] = [];
  drawerMode: 'side' | 'over';
  selectedTab: number = 0;
  tableColumns: string[] = [
    'action',
    'name',
    'view',
    'edit',
    'delete',
  ];
  _loggedInUser: UserSessionModel;

  constructor(
    private _rolesService: GetAllRolesUsecase,
    private _localStorage: LocalStorageService,
    private _fuseConfirmationService: FuseConfirmationService,
    private logger: LogService,
    private _matDialog: MatDialog,
    private _translocoService: TranslocoService,
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router,
    private _snackBar: MatSnackBar,
    public _activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    try {

      this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
      this.logger.info("User landed on user accounts page");
      this.logger.info("Fetching user accounts data");

      this._rolesService.roles$.pipe(
        takeUntil(this._unsubscribeAll))
        .subscribe((roles: Role[]) => {

          this.logger.info("Fetching user accounts data successfully");
          // console.log(personnels);
          // this.personnels = personnels;

          this.data = roles;
          // console.log(this.copyMapData);
          this.dataSource = new MatTableDataSource(this.data);
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

  applyFilter(filterValue: string) {
    // this.logger.info("User search on user accounts table", filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();;
  }


  deleteUser(account) {
    // console.log(account);
    this.logger.info("User click on delete user account button", account);
    const confirmation = this._fuseConfirmationService.open({
      title: this._translocoService.translate('Delete Role'),
      message: this._translocoService.translate('Are you sure you want to delete this role? All related users will be deleted. This action cannot be undone!'),
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
        this._rolesService.deleteRole(account.id).then((res) => {
          console.log(res);
          if (res) {
            this.logger.info("User account has been deleted successfully", account);
            this._snackBar.open(this._translocoService.translate("Role has been deleted successfully."), "close", {
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
        this.logger.info("User canceled to delete user account", account);
      }
    })
  }

}
