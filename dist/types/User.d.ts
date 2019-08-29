export declare interface UserExperience {
    /** Experience's company */
    company: string;
    /** Experience's description */
    description: string | null;
    /** Experience's work position */
    position: string;
    /** Experience's used skills */
    skills: string | null;
    /** Is this experience the current one  */
    isCurrent: boolean;
    /** Experience's startd ate */
    startDate: string;
    /** Experience's end date */
    endDate: string;
}
export declare interface UserInstantMessaging {
    /** Instant Messaging contact's type */
    imType: 'skype' | 'gtalk' | 'yahoo' | 'msn' | 'other';
    /** Instant Messaging contact */
    imId: string | null;
}
export declare interface UserUrl {
    /** Website's url */
    url: string | null;
}
export declare interface UserPhone {
    /** Phone number's type */
    phoneType: 'work' | 'home' | 'other';
    /** Phone number */
    phoneNumber: string;
}
export declare interface UserPartial {
    /** User's id */
    id: string;
    /** API link to load the user's data */
    href: string;
    /** User's username */
    username: string;
    /** User's first name */
    firstname: string;
    /** User's last name */
    lastname: string;
    /** User's full name */
    fullname: string;
    /** User's email */
    email?: string;
    /** User's gender */
    gender: 'male' | 'female' | null;
    /** API link to load the user's avatar */
    avatar: string | null;
    /** User's phone numbers */
    phones?: UserPhone[];
    /** User's work experience */
    experiences: UserExperience[];
    /** User's current work position */
    position: string | null;
}
/** Partial user's informations */
export declare interface User extends UserPartial {
    /** API link to load the user's identity (full data) */
    identity: string;
    /** User's phone numbers */
    phones: UserPhone[];
    /** User's work experience */
    experiences: UserExperience[];
    /** User's Instant Messaging contacts */
    ims: UserInstantMessaging[];
    /** User's websites */
    url: UserUrl[];
    /** Is the user delete */
    deleted: boolean;
}
/** Complete user's informations */
export declare interface Identity {
    /** Identity's id */
    id: string;
    /** API link to load the identity's data */
    href: string;
    providerId: string;
    globalId: {
        localId: string;
        domain: string;
    };
    /** Is the identity deleted */
    deleted: boolean;
    /** Identity's user profile */
    profile: {
        /** User's websites */
        urls: UserUrl[];
        /** API link to load the user's identity */
        identity: string;
        /** Is the profile deleted (yes, it is indeed a string hahaha) */
        deleted: 'true' | 'false';
        notValid: boolean;
        /** User's Instant Messaging contacts */
        iMs: UserInstantMessaging[];
        /** Partial user data */
        dataEntity: User;
    } & UserPartial;
}
//# sourceMappingURL=User.d.ts.map