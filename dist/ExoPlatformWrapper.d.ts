/// <reference types="node" />
import { RequestOptions } from 'https';
import { Activity, Comment } from './types/Activity';
import { Space, SpacePartial } from './types/Space';
declare class ExoPlatformWrapper {
    /** eXo Platform username */
    private username;
    /** eXo Platform password */
    private password;
    /** Hostname of the API (don't include protocol or path) */
    exoHostname: string;
    /** Path to the eXo REST API, `/rest` by default */
    exoPath: string;
    /** SSL protocol to use (don't set if you don't know what is it!) */
    exoSecureProtocol?: string;
    /**
     * Create a bot instance
     * @param exoHostname Hostname of the API (don't include protocol or path)
     * @param exoPath Path to the eXo REST API, `/rest` by default
     * @param exoSecureProtocol SSL protocol to use (don't set if you don't know what is it!)
     */
    constructor(exoHostname: string, exoPath?: string, exoSecureProtocol?: string);
    /**
     * Make an API call to eXo Platform configured API.
     * @param path Path to the API endpoint
     * @param body Request body object
     * @param method HTTP request method
     * @param moreOptions Any options to inject in the request options
     * @returns The API's response
     * @throws {Error} The API returned an error or the response was not JSON-valid
     */
    request<T extends {}>(path: string, body?: object | null, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', moreOptions?: Partial<RequestOptions>): Promise<T>;
    /**
     * Make an authenticated API call to the eXo Platform configured API.
     * @param args Same as `this.request`
     * @returns Same as `this.request`
     * @throws {Error} You must be authenticated using `this.login`
     */
    requestAuthed<T extends {}>(...args: Parameters<ExoPlatformWrapper['request']>): Promise<T>;
    /**
     * Set login credentials and check validity.
     * @param username eXo Platform username
     * @param password eXo Platform password
     * @param checkCredentials Should the eXo Platform credentials be checked
     * @throws {Error} Invalid credentials (if checkCredentials = true)
     */
    login(username: string, password: string, checkCredentials?: boolean): Promise<void>;
    /** Operations related to activities */
    activity: {
        /**
         * Get list of activities.
         * @returns Activities list
         */
        readStream: () => Promise<import("./types/ApiResponse").ApiResponseList<{
            activities: Activity[];
        }>>;
        /**
         * Get an activity.
         * Must have read-access.
         * @param activityId Id of the targeted activity
         * @returns Activity content
         * @throws {Error} Unknown activity or no permission to read
         */
        read: (activityId: string) => Promise<Activity>;
        /**
         * Edit an activity.
         * Must have write-access.
         * @param activityId Id of the targeted activity
         * @returns List of publications
         * @throws {Error} Unknown activity or no permission to edit
         */
        edit: (activityId: string, message: string) => Promise<Activity>;
        /**
         * Delete an activity.
         * Must have write-access.
         * @returns Activity content
         * @throws {Error} Unknown activity or no permission to delete
         */
        remove: (activityId: string) => Promise<Activity>;
        /** Operations related to an activity's likes */
        like: {
            /**
             * Get activity likers.
             * Must have read-access.
             * @param activityId Id of the targeted activity
             * @returns Activity likers
             * @throws {Error} Unknown activity or no permission to read
             */
            list: (activityId: string) => Promise<import("./types/ApiResponse").ApiResponseList<{
                likes: import("./types/User").User[];
            }>>;
            /**
             * Like an activity.
             * Must have read-access.
             * @param activityId Id of the targeted activity
             * @returns Activity content
             * @throws {Error} Unknown activity or no permission to read
             */
            add: (activityId: string) => Promise<Activity>;
            /**
             * Remove a like from an activity.
             * Must have permission to delete the targetted like.
             * @param activityId Id of the targeted activity
             * @param username Id of the user to remove the like from (if you are admin). Defaults to current logged in user
             * @returns Activity content
             * @throws {Error} Unknown activity or no permission to read or no permission to remove the like
             */
            remove: (activityId: string, username?: string | undefined) => Promise<Activity>;
        };
        /** Operations related to an activity's comments */
        comment: {
            /**
             * Get activity comments.
             * Must have read-access.
             * @param activityId Id of the targeted activity
             * @returns Activity comments
             * @throws {Error} Unknown activity or no permission to read
             */
            list: (activityId: string) => Promise<import("./types/ApiResponse").ApiResponseList<{
                comments: Comment[];
            }>>;
            /**
             * Comment an activity.
             * Must have read-access.
             * @param activityId Id of the targeted activity
             * @param message Comment to add
             * @returns Comment content
             * @throws {Error} Unknown activity or no permission to read
             */
            add: (activityId: string, message: string) => Promise<Comment>;
            /**
             * Edit a comment.
             * Must have write-access.
             * @param commentId Id of the targeted comment
             * @param message New comment
             * @returns Comment content
             * @throws {Error} Unknown comment or no permission to edit
             */
            edit: (commentId: string, message: string) => Promise<Comment>;
            /**
             * Delete a comment.
             * Must have write-access.
             * @param commentId Id of the targeted comment
             * @returns Comment content
             * @throws {Error} Unknown comment or no permission to delete the comment
             */
            remove: (commentId: string) => Promise<Comment>;
        };
    };
    /** Operations related to a space's stream activity */
    space: {
        /**
         * Create a space.
         * Must have write-access.
         * @param spaceData Data of the space to create
         * @returns Newly created space
         * @throws {Error} No permission to create a space or `displayName` already taken
         */
        create: (spaceData: SpacePartial) => Promise<Space>;
        /**
         * Edit a space data.
         * Must have write-access.
         * @param spaceId The targetted space id
         * @param spaceData New data of the spam
         * @returns New space data
         * @throws {Error} No permission to edit the space or new `displayName` already taken
         */
        edit: (spaceId: string, spaceData: SpacePartial) => Promise<Space>;
        /**
         * Delete a space.
         * Must have write-access.
         * @param spaceId The targetted space id
         * @returns Old space data
         * @throws {Error} No permission to delete the space
         */
        remove: (spaceId: string) => Promise<Space>;
        /**
         * Get a space's data.
         * Must have read-access.
         * @param spaceId Id of the targeted space
         * @returns Space's data
         * @throws {Error} Unknown space or no permission to read
         */
        getData: (spaceId: string) => Promise<Space>;
        /**
         * Read a spaces's activity stream.
         * Must have read-access.
         * @param spaceId Id of the targeted space
         * @returns List of publications
         * @throws {Error} Unknown space or no permission to read
         */
        readStream: (spaceId: string) => Promise<import("./types/ApiResponse").ApiResponseList<{
            activities: Activity[];
        }>>;
        /**
         * Publish on a spaces's activity stream.
         * Must have write-access.
         * @param spaceId Id of the targeted space
         * @param message Message to publish
         * @returns Newly created publication
         * @throws {Error} Unknown space or no permission to publish
         */
        publish: (spaceId: string, message: string) => Promise<Activity>;
    };
    /** Operations related to a user's stream activity */
    user: {
        /**
         * Read a user's activity stream.
         * @param username Id of the targeted user. Defaults to current logged in user
         * @returns Activities list
         * @throws {Error} Unknown user or no permission to read
         */
        readStream: (username?: string | null) => Promise<import("./types/ApiResponse").ApiResponseList<{
            activities: Activity[];
        }>>;
        /**
         * publish on a user's activity stream.
         * Can only be your own profile.
         * @param message Message to publish
         * @returns Newly created publication
         * @throws {Error} Unknown user or no permission to publish
         */
        publish: (message: string) => Promise<Activity>;
    };
}
export default ExoPlatformWrapper;
//# sourceMappingURL=ExoPlatformWrapper.d.ts.map