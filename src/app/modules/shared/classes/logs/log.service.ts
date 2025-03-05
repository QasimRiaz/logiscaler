import { Injectable } from '@angular/core';
import { LogLevel } from './log.model';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import { LogEntry } from './log-entry.class';
import { environment } from 'environments/environment';
import { LocalStorageService } from '../helper/localstorage';
import { UserSessionModel } from '../../models/userSession.model';
import { CONSTANTS } from '../helper/constant';

@Injectable({
    providedIn: 'root',
})
export class LogService {

    publishers: LogPublisher[];
    level: LogLevel = environment.logLevel;
    logWithDate: boolean = false;
    _loggedInUser: UserSessionModel;

    constructor(private publishersService: LogPublishersService, private _localStorage: LocalStorageService) {
        // Set publishers
        this.publishers = this.publishersService.publishers;
        this._loggedInUser = this._localStorage.get(CONSTANTS.LOGGED_IN_USER, true);
    }

    debug(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Debug, optionalParams);
    }

    info(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Info, optionalParams);
    }

    warn(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Warn, optionalParams);
    }

    error(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Error, optionalParams);
    }

    fatal(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Fatal, optionalParams);
    }

    log(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.All, optionalParams);
    }

    clear(): void {
        for (let logger of this.publishers) {
            logger.clear()
                .subscribe(response => console.log(response));
        }
    }

    private shouldLog(level: LogLevel): boolean {
        let ret = false;

        if ((level >= this.level &&
            level !== LogLevel.Off) ||
            this.level === LogLevel.All) {
            ret = true;
        }

        return ret;
    }

    private writeToLog(msg: string, level: LogLevel, params: any[]) {
        if (this.shouldLog(level)) {
            //console.log(msg);
            let entry: LogEntry = new LogEntry();
            entry.userInfo = this._localStorage.get(CONSTANTS.LOGGED_IN_USER, true);
            entry.message = msg;
            entry.level = level;
            entry.extraInfo = params;
            entry.logWithDate = this.logWithDate;
            for (let logger of this.publishers) {

                // log entry to google cloud logging using hasura action
                logger.log(entry)
                    .subscribe({
                        next: response => {
                            // Handle the response if needed
                        },
                        error: error => {
                            // Handle the error
                        }
                    });
            }
        }
    }
}