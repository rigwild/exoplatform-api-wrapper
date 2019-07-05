export declare const enum ActivityType {
    /** Activity posted by a user, without documents or link attached **/
    'DEFAULT_ACTIVITY' = "DEFAULT_ACTIVITY",
    /** Activity posted when a space is created. It contains the space's description and the number of members **/
    'SPACE_ACTIVITY' = "SPACE_ACTIVITY",
    /** Activity posted when a user creates an activity in a space **/
    'USER_ACTIVITIES_FOR_SPACE' = "USER_ACTIVITIES_FOR_SPACE",
    /** Activity with a link attachement **/
    'LINK_ACTIVITY' = "LINK_ACTIVITY",
    /** Activity for contents sharing in a space **/
    'sharecontents:spaces' = "sharecontents:spaces",
    /** Activity automatically posted the first time a user updates his/her profile **/
    'USER_PROFILE_ACTIVITY' = "USER_PROFILE_ACTIVITY",
    /** Activity with document posted via the Share feature of the mobile application **/
    'DOC_ACTIVITY' = "DOC_ACTIVITY",
    /** Activity with documents attached **/
    'files:spaces' = "files:spaces",
    /** Activity automatically posted when a document is shared in a space **/
    'sharefiles:spaces' = "sharefiles:spaces",
    /** Activity automatically posted when a content is created **/
    'contents:spaces' = "contents:spaces",
    /** Activity automatically posted when a new event is created **/
    'cs-calendar:spaces' = "cs-calendar:spaces",
    /** Activity automatically posted when a new forum topic or post is created **/
    'ks-forum:spaces' = "ks-forum:spaces",
    /** Activity automatically posted when a new question or answer is created **/
    'ks-answer:spaces' = "ks-answer:spaces",
    /** Activity automatically posted when a new poll is created **/
    'ks-poll:spaces' = "ks-poll:spaces",
    /** Activity automatically posted when a new wiki page is created in a space wiki **/
    'ks-wiki:spaces' = "ks-wiki:spaces",
    /** Activity automatically posted the first time a user is getting connected to another one, containing the number of relations **/
    'USER_ACTIVITIES_FOR_RELATIONSHIP' = "USER_ACTIVITIES_FOR_RELATIONSHIP",
    /** Comment posted when an event is update **/
    'CALENDAR_ACTIVITY' = "CALENDAR_ACTIVITY",
    /** Comment posted when a user updates his/her profile **/
    'exosocial:people' = "exosocial:people",
    /** Comment posted when a member joins/leaves a space **/
    'exosocial:spaces' = "exosocial:spaces",
    /** Comment posted when a poll is updated **/
    'poll:spaces' = "poll:spaces",
    /** Comment automatically posted when two users are getting connected **/
    'USER_COMMENTS_ACTIVITY_FOR_RELATIONSHIP' = "USER_COMMENTS_ACTIVITY_FOR_RELATIONSHIP",
    /** Activity post when two user are connected together **/
    'exosocial:relationship' = "exosocial:relationship"
}
export declare interface Activity {
    /** Activity's id */
    id: string;
    /** Activity's content */
    title: string;
    body: any;
    link: any;
    /** Activity's type */
    type: ActivityType;
    /** API link to load the activity's data */
    href: string;
    /** API link to load the activity's author identity */
    identity: string;
    /** Author's data */
    owner: {
        /** Author's id */
        id: string;
        /** API link to load the activity's author user data */
        href: string;
    };
    /** Mentionned users' data */
    mentions: [{
        /** User's id */
        id: string;
        /** API link to load the mentionned user's data */
        href: string;
    }];
    attachments: object[];
    /** API link to load the activity's comments */
    comments: string;
    /** API link to load the activity's likes */
    likes: string;
    /** Activity's creation date */
    createDate: string;
    /** Activity's last update date */
    updateDate: string;
    /** Activity's stream data (where the data is) */
    activityStream?: {
        /** Type of activity stream it was published on (user, space ...) */
        type: string;
        /** Activity stream's id */
        id: string;
    };
}
export declare interface Comment {
    /** Comment's id */
    id: string;
    /** Comment's content */
    title: string;
    body: any;
    /** API link to load the comment's data */
    href: string;
    /** API link to load the comment's author identity */
    identity: string;
    /** Author's id */
    poster: string;
    /** Mentionned users' data */
    mentions: [{
        /** User's id */
        id: string;
        /** API link to load the mentionned user's data */
        href: string;
    }];
    /** API link to load the comment's likes */
    likes: string;
    /** Comment's creation date */
    createDate: string;
    /** Comment's last update date */
    updateDate: string;
    /** Parent comment id if nested comment */
    parentCommentId: string | null;
    /** API link to load the activity on which the comment was posted  */
    activity: string;
}
//# sourceMappingURL=Activity.d.ts.map