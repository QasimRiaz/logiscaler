import { Observable } from 'rxjs';
import { Role } from '../../models/role.model';

export abstract class RoleRepository {
    abstract getAllRoles(): Observable<Role[]>;
    abstract getRoleById(id: string): Observable<Role>;
    abstract executeUpdate(role: Role): Observable<Role>;
    abstract deleteRole(roleId: string): Promise<boolean>;
}