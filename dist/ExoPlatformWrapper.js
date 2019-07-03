"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const msgId_1 = __importDefault(require("./msgId"));
class ExoPlatformWrapper {
    /**
     * Create a bot instance
     * @param exoHostname Hostname of the API (don't include protocol or path)
     * @param exoPath Path to the eXo REST API, `/rest` by default
     * @param exoSecureProtocol SSL protocol to use (don't set if you don't know what is it!)
     */
    constructor(exoHostname, exoPath = '/rest', exoSecureProtocol) {
        /** eXo Platform username */
        this.username = null;
        /** eXo Platform password */
        this.password = null;
        /** Path to the eXo REST API, `/rest` by default */
        this.exoPath = '/rest';
        /** Operations related to activities */
        this.activity = {
            /**
             * Get list of activities.
             * @returns Activities list
             */
            read: () => this.requestAuthed(`/private/v1/social/activities`),
            /**
             * Read an activity.
             * Must have read-access.
             * @param activityId Id of the targeted activity
             * @returns Activity content
             * @throws {Error} Unknown activity or no permission to read
             */
            readId: (activityId) => this.requestAuthed(`/private/v1/social/activities/${activityId}`),
            /**
             * Edit an activity.
             * Must have write-access.
             * @param activityId Id of the targeted activity
             * @returns List of publications
             * @throws {Error} Unknown activity or no permission to edit
             */
            editId: (activityId, message) => this.requestAuthed(`/private/v1/social/activities/${activityId}`, { title: message }, 'PUT'),
        };
        /** Operations related to a space's stream activity */
        this.space = {
            /**
             * Read a spaces's activity stream.
             * Must have read-access.
             * @param spaceId Id of the targeted space
             * @returns List of publications
             * @throws {Error} Unknown space or no permission to read
             */
            read: (spaceId) => this.requestAuthed(`/private/v1/social/spaces/${spaceId}/activities`),
            /**
             * Publish on a spaces's activity stream.
             * Must have write-access.
             * @param spaceId Id of the targeted space
             * @param message Message to publish
             * @returns Newly created publication
             * @throws {Error} Unknown space or no permission to publish
             */
            publish: (spaceId, message) => this.requestAuthed(`/private/v1/social/spaces/${spaceId}/activities`, { title: message }),
        };
        /** Operations related to a user's stream activity */
        this.user = {
            /**
             * publish on a user's activity stream.
             * Must be your own profile.
             * @param userId Id of the targeted profile
             * @param message Message to publish
             * @returns Newly created publication
             * @throws {Error} Unknown user or no permission to publish
             */
            publish: (userId, message) => this.requestAuthed(`/private/v1/social/users/${userId}/activities`, { title: message })
        };
        this.exoHostname = exoHostname;
        this.exoPath = exoPath;
        this.exoSecureProtocol = exoSecureProtocol;
    }
    /**
     * Make an API call to eXo Platform configured API.
     * @param path Path to the API endpoint
     * @param body Request body object
     * @param method HTTP request method
     * @param moreOptions Any options to inject in the request options
     * @returns The API's response
     * @throws {Error} The API returned an error or the response was not JSON-valid
     */
    request(path, body = null, method = body ? 'POST' : 'GET', moreOptions) {
        return new Promise((resolve, reject) => {
            let options = {
                auth: `${this.username}:${this.password}`,
                hostname: this.exoHostname,
                port: 443,
                secureProtocol: this.exoSecureProtocol,
                path: `${this.exoPath}${path}`,
                method,
                ...moreOptions
            };
            if (body) {
                if (!options.headers)
                    options.headers = {};
                options.headers['content-type'] = 'application/json';
            }
            const req = https_1.default.request(options, res => {
                let text = '';
                res.on('data', d => text += d);
                res.on('end', () => {
                    // There was an error
                    if (res.statusCode && res.statusCode > 400) {
                        // Try to extract the error
                        const parsedError = /Description\<\/b\>\s(.*?)\<\/p\>/g.exec(text);
                        if (parsedError && parsedError.length >= 2)
                            reject(new Error(`${res.statusCode} - ${parsedError[1]}`));
                        reject(new Error(`${res.statusCode} - ${text}`));
                    }
                    // Try to parse JSON output
                    try {
                        resolve(JSON.parse(text));
                    }
                    catch {
                        reject(new Error(`Could not parse the API's response. Body content: ${text}`));
                    }
                });
            });
            req.on('error', reject);
            if (body)
                req.write(JSON.stringify(body));
            req.end();
        });
    }
    /**
     * Make an authenticated API call to the eXo Platform configured API.
     * @param args Same as `this.request`
     * @returns Same as `this.request`
     * @throws {Error} You must be authenticated using `this.login`
     */
    async requestAuthed(...args) {
        if (!this.username || !this.password)
            throw new Error(msgId_1.default.NEED_LOGGED_IN);
        return this.request(...args);
    }
    /**
     * Set login credentials and check validity.
     * @param username eXo Platform username
     * @param password eXo Platform password
     * @param checkCredentials Should the eXo Platform credentials be checked
     * @throws {Error} Invalid credentials (if checkCredentials = true)
     */
    async login(username, password, checkCredentials = true) {
        if (this.username || this.password)
            throw new Error(msgId_1.default.NEED_LOGGED_OUT);
        this.username = username;
        this.password = password;
        // Check credentials
        if (checkCredentials) {
            try {
                await this.request('/private/v1/social/users/');
            }
            catch (error) {
                this.username = null;
                this.password = null;
                throw error;
            }
        }
    }
}
exports.default = ExoPlatformWrapper;
//# sourceMappingURL=ExoPlatformWrapper.js.map