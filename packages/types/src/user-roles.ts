export const UserRoleEnumValues = ["admin", "mod", "user"] as const;
export type UserRoleEnumType = (typeof UserRoleEnumValues)[number];
