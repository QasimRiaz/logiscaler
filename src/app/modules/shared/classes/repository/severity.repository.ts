import { Observable } from 'rxjs';
import { Status } from '../../models/ticket.model';

export abstract class SeverityRepository {
    abstract getAllStatus(): Observable<Status[]>;
    abstract getAllSeverity(): Observable<Status[]>;
}