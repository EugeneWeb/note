import { RoleEnum } from "@role/role-enum";

export class FilterUserDto {
    search?: string; 
    role?: RoleEnum;
}