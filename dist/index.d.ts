/// <reference types="node" />
import { IncomingMessage } from 'http';
declare class ExoplatformBot {
    exoHostname: string;
    exoPath: string;
    exoSecureProtocol: string | undefined;
    username: string | null;
    password: string | null;
    /**
     * Create a bot instance
     * @param exoHostname Hostname of the API (don't include protocol or path)
     * @param exoPath Path to the eXo REST API, `/rest` by default
     * @param secureProtocol SSL protocol to use (don't set if you don't know what is it!)
     */
    constructor(exoHostname: string, exoPath?: string, secureProtocol?: string);
    /**
     * Make an API call to eXo Platform configured API.
     * @param path Path to the API endpoint
     * @param body Request body object
     * @param method HTTP request method
     * @param moreOptions Any options to inject in the request options
     * @throws The API returned an error
     */
    request(path: string, body?: object, method?: string, moreOptions?: object): Promise<{
        body: object | string;
        response: IncomingMessage;
    }>;
    /**
     * Set login credentials and check validity.
     * @param username eXo Platform username
     * @param password eXo Platform password
     * @throws Invalid credentials
     */
    login(username: string, password: string): Promise<void>;
    /**
     * Post on a user's activity stream.
     * Must be your own profile.
     * @param userId Id of the targeted profile
     * @param message Message to post
     * @returns Newly created post
     * @throws Unknown user or no permission to post
     */
    postUser(userId: string, message: string): Promise<object | string>;
    /**
     * Post on a spaces's activity stream.
     * Must have write-access.
     * @param spaceId Id of the targeted space
     * @param message Message to post
     * @returns Newly created post
     * @throws Unknown space or no permission to post
     */
    postSpace(spaceId: string, message: string): Promise<object | string>;
}
export default ExoplatformBot;
//# sourceMappingURL=index.d.ts.map