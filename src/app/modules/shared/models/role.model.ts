export interface Role {
    id: string;
    name: string;
    editAccess?: boolean;
    viewAccess?: boolean;
    deleteAccess?: boolean;
}


export interface RoleAccess {
    id: string;
    value: boolean;
    device: string;
    action: string;
    moduleId: number;
    module: Module;
}
export interface Module {
    id: string;
    visible: boolean;
    href: string;
    name: string;
    device: string;
}
export interface UserRoleAccess {
    roleId: string;
    roleName: { [key: string]: string };
    moduleId: Number;
    read: boolean;
    edit: boolean;
    archive: boolean;
    upload: Boolean;
}

