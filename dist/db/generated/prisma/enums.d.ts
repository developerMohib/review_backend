export declare const Role: {
    readonly STUDENT: "STUDENT";
    readonly MENTOR: "MENTOR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const MentorStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type MentorStatus = (typeof MentorStatus)[keyof typeof MentorStatus];
//# sourceMappingURL=enums.d.ts.map