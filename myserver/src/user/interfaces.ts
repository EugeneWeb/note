import { Role, User } from "@prisma/client";

export interface IUserWithRoles extends User {
    roles: Role[]
}
