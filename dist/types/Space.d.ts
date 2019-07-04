export declare const enum SpaceVisibility {
    /** The space is visible to others */
    private = "private",
    /** The space is hidden from others */
    hidden = "hidden"
}
export declare const enum SpaceSubscription {
    /** The space is open for subscription */
    open = "open",
    /** The space is open for subscription but requires validation */
    validation = "validation",
    /** The space is closed for subscription */
    close = "close"
}
export declare interface SpaceApplication {
    /** Application's id */
    id: string;
    /** Application's visible name */
    displayName: string;
}
export declare interface SpacePartial {
    /** Space's visible name */
    displayName: string;
    /** Space's description */
    description: string | null;
    /** Space's visibility */
    visibility: SpaceVisibility;
    /** Space's subscription status */
    subscription: SpaceSubscription;
}
export declare interface Space extends SpacePartial {
    /** Space's id */
    id: string;
    /** API link to load the space's data */
    href: string;
    /** API link to load the space's identity */
    identity: string;
    /** Path to the space (example: `/spaces/documentation`) */
    groupId: string;
    /** Space's available applications */
    applications: SpaceApplication[];
    /** API link to load the space's manager */
    managers: string;
    /** API link to load the space's members list */
    members: string;
    /** Space's url */
    url: null;
    /** API link to load the space's avatar */
    avatarUrl: string | null;
}
//# sourceMappingURL=Space.d.ts.map