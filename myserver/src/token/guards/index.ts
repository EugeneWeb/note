import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./roles.guard";

export const GUARDS = [JwtAuthGuard, RolesGuard]