import { Role } from "@prisma/client";

export const getRolesNamesArray = (roles: Role[]) => {
    return roles.map(role => role.name)
}