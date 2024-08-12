import { UserRole } from "../types/user.types";

export const parseDate = (dateStr: string | undefined | null): Date | null => {
    if(!dateStr) return null

    const [day, month, year] = dateStr.split('.').map(Number);
    if (!day || !month || !year) return null;
    const fullYear = year < 100 ? 2000 + year : year; 
    return new Date(fullYear, month - 1, day);
};

export const cls = (input: Array<string | boolean | null | undefined>) => input.filter(Boolean).join(" ");

export const userRoleLabels: Record<UserRole, string> = {
    executor: "Исполнитель",
    signatory: "Подписант",
    approver: "Согласующий",
    registrar: "Регистратор",
}


