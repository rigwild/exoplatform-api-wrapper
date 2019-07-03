/// <reference types="node" />
import { RequestOptions } from 'https';
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
    request(path: string, body?: object | null, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', moreOptions?: Partial<RequestOptions>): Promise<object>;
    /**
     * Make an authenticated API call to the eXo Platform configured API.
     * @param args Same as `this.request`
     * @returns Same as `this.request`
     * @throws {Error} You must be authenticated using `this.login`
     */
    requestAuthed(...args: Parameters<ExoPlatformWrapper['request']>): ReturnType<ExoPlatformWrapper['request']>;
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
        read: () => Promise<object>;
        /**
         * Read an activity.
         * Must have read-access.
         * @param activityId Id of the targeted activity
         * @returns Activity content
         * @throws {Error} Unknown activity or no permission to read
         */
        readId: (activityId: string) => Promise<object>;
        /**
         * Edit an activity.
         * Must have write-access.
         * @param activityId Id of the targeted activity
         * @returns List of publications
         * @throws {Error} Unknown activity or no permission to edit
         */
        editId: (activityId: string, message: string) => Promise<object>;
    };
    /** Operations related to a space's stream activity */
    space: {
        /**
         * Read a spaces's activity stream.
         * Must have read-access.
         * @param spaceId Id of the targeted space
         * @returns List of publications
         * @throws {Error} Unknown space or no permission to read
         */
        read: (spaceId: string) => Promise<object>;
        /**
         * Publish on a spaces's activity stream.
         * Must have write-access.
         * @param spaceId Id of the targeted space
         * @param message Message to publish
         * @returns Newly created publication
         * @throws {Error} Unknown space or no permission to publish
         */
        publish: (spaceId: string, message: string) => Promise<object>;
    };
    /** Operations related to a user's stream activity */
    user: {
        /**
         * publish on a user's activity stream.
         * Must be your own profile.
         * @param userId Id of the targeted profile
         * @param message Message to publish
         * @returns Newly created publication
         * @throws {Error} Unknown user or no permission to publish
         */
        publish: (userId: string, message: string) => Promise<object>;
    };
}
export default ExoPlatformWrapper;
//# sourceMappingURL=ExoPlatformWrapper.d.ts.map