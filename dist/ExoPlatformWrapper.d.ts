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
    request(path: string, body?: object | null, method?: string, moreOptions?: Partial<RequestOptions>): Promise<object>;
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
     * @throws {Error} Invalid credentials
     */
    login(username: string, password: string): Promise<void>;
    /**
     * Post on a user's activity stream.
     * Must be your own profile.
     * @param userId Id of the targeted profile
     * @param message Message to post
     * @returns Newly created post
     * @throws {Error} Unknown user or no permission to post
     */
    postUser(userId: string, message: string): Promise<object>;
    /**
     * Post on a spaces's activity stream.
     * Must have write-access.
     * @param spaceId Id of the targeted space
     * @param message Message to post
     * @returns Newly created post
     * @throws {Error} Unknown space or no permission to post
     */
    postSpace(spaceId: string, message: string): Promise<object>;
}
export default ExoPlatformWrapper;
//# sourceMappingURL=ExoPlatformWrapper.d.ts.map