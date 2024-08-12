export type User = {
    login: string,
    role: UserRole,
    iconPath: string
}

export type UserRole =  'executor' | 'signatory' | 'approver' | 'registrar'