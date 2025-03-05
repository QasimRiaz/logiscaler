import { Observable } from 'rxjs';
import { TaskSubmission, TaskSubmissionMeta } from '../../models/task.model';

export abstract class DashbaordRepository {
    abstract getDashboardData(): Observable<any>;
}