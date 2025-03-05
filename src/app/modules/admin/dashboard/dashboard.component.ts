import { DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CONSTANTS } from 'app/modules/shared/classes/helper/constant';
import { ROLE_IDS } from 'app/modules/shared/classes/helper/enum';
import { LocalStorageService } from 'app/modules/shared/classes/helper/localstorage';
import { LogService } from 'app/modules/shared/classes/logs/log.service';
import { DashbaordUsecases } from 'app/modules/shared/classes/usecases/dashboard/dashbaord.usecases';
import { TicketUsecases } from 'app/modules/shared/classes/usecases/ticket/ticket.usecases';
import { TaskUsecases } from 'app/modules/shared/classes/usecases/task/task.usecases';
import { Ticket } from 'app/modules/shared/models/ticket.model';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        TranslocoModule,
        MatTableModule,
        MatProgressBarModule,
        MatSidenavModule,
        RouterOutlet, RouterLink,
        DatePipe, MatTooltipModule,
        NgClass,
    ],
})
export class ExampleComponent implements OnInit, AfterViewInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    activeLang: string = '';
    data: any[] = [];
    _loggedInUser: UserSessionModel;
    tableColumns: string[] = [
        'action',
        'title',
        'status',
        'description',
        'admin',
        'createdAt',
    ];
    compeletedProjects: number = 0;
    submissions: number = 0;
    taskDue: number = 0;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    /**
     * Constructor
     */
    constructor(
        private _service: DashbaordUsecases,
        private _translocoService: TranslocoService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _logger: LogService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _ticketUsecase: TicketUsecases,
        private _matDialog: MatDialog,
        public _localStorage: LocalStorageService,
        public _activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        try {
            this._logger.info("User landed on dashbaord page");
            this._logger.info("Fetching dashbaord data");
            this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
            // if (this._loggedInUser.roleId == ROLE_IDS.SuperAdmin) {
            //     this.tableColumns = this.tableColumns.filter((col) => col != 'action')
            // }

            // this._service.dashbaord$.pipe(
            //     takeUntil(this._unsubscribeAll))
            //     .subscribe((data: any) => {
            //         this._logger.info("Fetching dashbaord data successfully");
            //         // console.log(data);

            //     })

            this._ticketUsecase.tickets$.pipe(
                takeUntil(this._unsubscribeAll))
                .subscribe((tickets: Ticket[]) => {
                    // this._logger.info("Fetching tickets data successfully");
                    console.log(tickets);
                    const mapData = this.mapTableData(tickets);
                    // console.log(mapData);
                    this.dataSource = new MatTableDataSource(mapData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })

        } catch (error) {
            this._logger.error("Fetching dashbaord data failed", error);
        }
    }
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
             * On backdrop clicked
             */
    mapTableData(data: Ticket[]) {
        // let totalTask: number = 0;
        // let completedTasks: number = 0;
        let myData: any[] = [];
        for (let dat of data) {
            // completedTasks += dat.tasks.filter(projectTask => projectTask.submission != null).length;
            // let completedTask = dat.tasks.filter(projectTask => projectTask.submission != null).length;
            // totalTask += dat.tasks.length;
            // this.submissions += completedTask;
            // let totalTasks = dat.tasks.length;
            // let progress = totalTasks > 0 ? Math.floor((completedTask / totalTasks) * 100) : 0;
            if (dat.statusId == '24972ca0-194b-414d-8af8-56a30cd293ba') {
                this.compeletedProjects++;
            }
            let obj = {
                id: dat.id,
                title: dat.title,
                status: dat.status.name,
                statusId: dat.statusId,
                description: dat.description,
                admin: dat.admin.firstName + ' ' + dat.admin.lastName,
                createdAt: dat.createdAt,
            }
            myData.push(obj);
        }
        return myData;
    }

    applyFilter(filterValue: string) {
        this._logger.info("User search on project table", filterValue);
        this.dataSource.filter = filterValue.trim().toLowerCase();;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }


    deleteTicket(account) {
        // console.log(account);
        this._logger.info("User click on delete ticket button", account);
        const confirmation = this._fuseConfirmationService.open({
            title: this._translocoService.translate('Delete Ticket'),
            message: this._translocoService.translate('Are you sure you want to delete this ticket? All related assignments will be deleted. This action cannot be undone!'),
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
                this._logger.info("User confirmed to delete ticket", account);
                this._ticketUsecase.deleteTicket(account.id).subscribe((res) => {
                    // console.log(res);
                    if (res) {
                        this._logger.info("Ticket has been deleted successfully", account);
                        this._snackBar.open(this._translocoService.translate("Ticket has been deleted successfully."), "close", {
                            duration: 3000,
                        });
                    } else {
                        this._logger.error("Error in deleting ticket", account);
                        this._snackBar.open(this._translocoService.translate('Error! Please Try Again'), this._translocoService.translate('close'), {
                            duration: 3000,
                        })
                    }
                });
            } else {
                this._logger.info("User canceled to delete ticket", account);
            }
        })
    }

}
