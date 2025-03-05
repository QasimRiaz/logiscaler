import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    withInMemoryScrolling,
    withPreloading,
} from '@angular/router';
import { provideFuse } from '@fuse';
import { TranslocoService, provideTransloco } from '@ngneat/transloco';
import { appRoutes } from 'app/app.routes';
import { provideAuths } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { mockApiServices } from 'app/mock-api';
import { firstValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';
import { LogService } from './modules/shared/classes/logs/log.service';
import { LogPublishersService } from './modules/shared/classes/logs/log-publishers.service';
import { TicketRepository } from './modules/shared/classes/repository/ticket.repository';
import {  TicketAPI } from './modules/shared/classes/api/ticket/ticket.api';
import { CompanyRepository } from './modules/shared/classes/repository/assetOwner.repository';
import { CompanyAPI } from './modules/shared/classes/api/company/company.api';
import { RoleRepository } from './modules/shared/classes/repository/role.repository';
import { RoleAPI } from './modules/shared/classes/api/role/role.api';
import { TaskRepository } from './modules/shared/classes/repository/task.repository';
import { TaskAPI } from './modules/shared/classes/api/task/task.api';
import { DashbaordRepository } from './modules/shared/classes/repository/dashbaord.repository';
import { DashbaordAPI } from './modules/shared/classes/api/dashbaord/dashbaord.api';
import { UserRepository } from './modules/shared/classes/repository/personnel.repository';
import { UserAPI } from './modules/shared/classes/api/user/user.api';
import { environment } from 'environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideGraphql } from './graphQl.config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { SeverityRepository } from './modules/shared/classes/repository/severity.repository';
import { SeverityAPI } from './modules/shared/classes/api/severity/severity.api';
import { TicketUsecases } from './modules/shared/classes/usecases/ticket/ticket.usecases';


export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideRouter(
            appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
        // Material Date Adapter
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                },
                display: {
                    dateInput: 'DDD',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        { provide: UserRepository, useClass: UserAPI },
        { provide: RoleRepository, useClass: RoleAPI },
        { provide: TicketRepository, useClass: TicketAPI },
        { provide: SeverityRepository, useClass: SeverityAPI },
        { provide: CompanyRepository, useClass: CompanyAPI },
        { provide: TicketRepository, useClass: TicketAPI },
        { provide: DashbaordRepository, useClass: DashbaordAPI },
        { provide: LogService },
        { provide: LogPublishersService },

        // Transloco Config
        provideTransloco({
            config: {
                availableLangs: [
                    {
                        id: 'en',
                        label: 'English',
                    },
                    {
                        id: 'tr',
                        label: 'Turkish',
                    },
                ],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: true,
            },
            loader: TranslocoHttpLoader,
        }),
        {
            // Preload the default language before the app starts to prevent empty/jumping content
            provide: APP_INITIALIZER,
            useFactory: () => {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);

                return () => firstValueFrom(translocoService.load(defaultLang));
            },
            multi: true,
        },

        // Fuse
        provideAuths(),
        provideGraphql(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay: 0,
                services: mockApiServices,
            },
            fuse: {
                layout: 'classy',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-brand',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Default',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),
    ],
};
