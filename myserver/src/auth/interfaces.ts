import { RoleEnum } from "@role/role-enum"

export interface IJwtPayload {
    id: string
    email: string
    roles: RoleEnum[]
}

