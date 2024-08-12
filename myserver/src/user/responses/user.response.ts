import { User } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { RoleEnum } from "@role/role-enum";
import { getRolesNamesArray } from "@common/helpers/get-roles-names-array";

export class UserResponse implements User {
    @Exclude()
    password: string;
    @Exclude()
    createdAt: Date;
    username: string;
    isBlocked: boolean;
    id: string;
    email: string;
    updatedAt: Date;
    @Expose()
    @Transform(({ value }) => getRolesNamesArray(value), { toPlainOnly: true })
    roles: RoleEnum[];

    constructor(user: User) {
        Object.assign(this, user)
    }
}