"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const msgId_1 = __importDefault(require("./msgId"));
class ExoPlatformWrapper {
    /**
     * Create a bot instance
     * @param exoHostname Hostname of the API (don't include protocol or path)
     * @param exoPath Path to the eXo REST API, `/rest` by default
     * @param exoSecureProtocol SSL protocol to use (don't set if you don't know what it is!!)
     * @param exoCiphers SSL ciphers to use (don't set if you don't know what it is!!)
     */
    constructor(exoHostname, exoPath = '/rest', exoSecureProtocol, exoCiphers) {
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
             * @param limit Amount of content to fetch
             * @param offset Offset for the content fetched
             * @returns Activities list
             */
            readStream: (limit = 20, offset = 0) => this.requestAuthed(`/social/activities?limit=${limit}&offset=${offset}`),
            /**
             * Get an activity.
             * Must have read-access.
             * @param activityId Id of the targeted activity
             * @returns Activity content
             * @throws {Error} Unknown activity or no permission to read
             */
            read: (activityId) => this.requestAuthed(`/social/activities/${activityId}`),
            /**
             * Edit an activity.
             * Must have write-access.
             * @param activityId Id of the targeted activity
             * @returns List of publications
             * @throws {Error} Unknown activity or no permission to edit
             */
            edit: (activityId, message) => this.requestAuthed(`/social/activities/${activityId}`, { title: message }, 'PUT'),
            /**
             * Delete an activity.
             * Must have write-access.
             * @returns Activity content
             * @throws {Error} Unknown activity or no permission to delete
             */
            remove: (activityId) => this.requestAuthed(`/social/activities/${activityId}`, null, 'DELETE'),
            /** Operations related to an activity's likes */
            like: {
                /**
                 * Get activity likers.
                 * Must have read-access.
                 * @param activityId Id of the targeted activity
                 * @param limit Amount of content to fetch
                 * @param offset Offset for the content fetched
                 * @returns Activity likers
                 * @throws {Error} Unknown activity or no permission to read
                 */
                list: (activityId, limit = 20, offset = 0) => this.requestAuthed(`/social/activities/${activityId}/likes?limit=${limit}&offset=${offset}`),
                /**
                 * Like an activity.
                 * Must have read-access.
                 * @param activityId Id of the targeted activity
                 * @returns Activity content
                 * @throws {Error} Unknown activity or no permission to read
                 */
                add: (activityId) => this.requestAuthed(`/social/activities/${activityId}/likes`, null, 'POST'),
                /**
                 * Remove a like from an activity.
                 * Must have permission to delete the targetted like.
                 * @param activityId Id of the targeted activity
                 * @param username Id of the user to remove the like from (if you are admin). Defaults to current logged in user
                 * @returns Activity content
                 * @throws {Error} Unknown activity or no permission to read or no permission to remove the like
                 */
                remove: (activityId, username = this.username || undefined) => this.requestAuthed(`/social/activities/${activityId}/likes/${username}`, null, 'DELETE')
            },
            /** Operations related to an activity's comments */
            comment: {
                /**
                 * Get activity comments.
                 * Must have read-access.
                 * @param activityId Id of the targeted activity
                 * @param limit Amount of content to fetch
                 * @param offset Offset for the content fetched
                 * @returns Activity comments
                 * @throws {Error} Unknown activity or no permission to read
                 */
                list: (activityId, limit = 20, offset = 0) => this.requestAuthed(`/social/activities/${activityId}/comments?limit=${limit}&offset=${offset}`),
                /**
                 * Comment an activity.
                 * Must have read-access.
                 * @param activityId Id of the targeted activity
                 * @param message Comment to add
                 * @returns Comment content
                 * @throws {Error} Unknown activity or no permission to read
                 */
                add: (activityId, message) => this.requestAuthed(`/social/activities/${activityId}/comments`, { title: message }, 'POST'),
                /**
                 * Edit a comment.
                 * Must have write-access.
                 * @param commentId Id of the targeted comment
                 * @param message New comment
                 * @returns Comment content
                 * @throws {Error} Unknown comment or no permission to edit
                 */
                edit: (commentId, message) => this.requestAuthed(`/social/comments/comment${commentId.replace('comment', '')}`, { title: message }, 'PUT'),
                /**
                 * Delete a comment.
                 * Must have write-access.
                 * @param commentId Id of the targeted comment
                 * @returns Comment content
                 * @throws {Error} Unknown comment or no permission to delete the comment
                 */
                remove: (commentId) => this.requestAuthed(`/social/comments/comment${commentId.replace('comment', '')}`, null, 'DELETE'),
            }
        };
        /** Operations related to a space's stream activity */
        this.space = {
            /**
             * List available spaces.
             * @param limit Amount of content to fetch
             * @param offset Offset for the content fetched
             */
            list: (limit = 20, offset = 0) => this.requestAuthed(`/social/spaces?limit=${limit}&offset=${offset}`),
            /**
             * Create a space.
             * Must have write-access.
             * @param spaceData Data of the space to create
             * @returns Newly created space
             * @throws {Error} No permission to create a space or `displayName` already taken
             */
            create: (spaceData) => this.requestAuthed(`/social/spaces`, spaceData),
            /**
             * Edit a space data.
             * Must have write-access.
             * @param spaceId The targetted space id
             * @param spaceData New data of the spam
             * @returns New space data
             * @throws {Error} No permission to edit the space or new `displayName` already taken
             */
            edit: (spaceId, spaceData) => this.requestAuthed(`/social/spaces/${spaceId}`, spaceData, 'PUT'),
            /**
             * Delete a space.
             * Must have write-access.
             * @param spaceId The targetted space id
             * @returns Old space data
             * @throws {Error} No permission to delete the space
             */
            remove: (spaceId) => this.requestAuthed(`/social/spaces/${spaceId}`, null, 'DELETE'),
            /**
             * Get a space's data.
             * Must have read-access.
             * @param spaceId Id of the targeted space
             * @returns Space's data
             * @throws {Error} Unknown space or no permission to read
             */
            getData: (spaceId) => this.requestAuthed(`/social/spaces/${spaceId}`),
            /**
             * Read a spaces's activity stream.
             * Must have read-access.
             * @param spaceId Id of the targeted space
             * @param limit Amount of content to fetch
             * @param offset Offset for the content fetched
             * @returns List of publications
             * @throws {Error} Unknown space or no permission to read
             */
            readStream: (spaceId, limit = 20, offset = 0) => this.requestAuthed(`/social/spaces/${spaceId}/activities?limit=${limit}&offset=${offset}`),
            /**
             * Publish on a spaces's activity stream.
             * Must have write-access.
             * @param spaceId Id of the targeted space
             * @param message Message to publish
             * @returns Newly created publication
             * @throws {Error} Unknown space or no permission to publish
             */
            publish: (spaceId, message) => this.requestAuthed(`/social/spaces/${spaceId}/activities`, { title: message })
        };
        /** Operations related to a user's stream activity */
        this.user = {
            /**
             * List users.
             * @param limit Amount of content to fetch
             * @param offset Offset for the content fetched
             * @returns Users list
             */
            list: (limit = 20, offset = 0) => this.requestAuthed(`/social/users?limit=${limit}&offset=${offset}`),
            /**
             * Read a user's activity stream.
             * @param username Id of the targeted user. Defaults to current logged in user
             * @param limit Amount of content to fetch
             * @param offset Offset for the content fetched
             * @returns Activities list
             * @throws {Error} Unknown user or no permission to read
             */
            readStream: (username = this.username, limit = 20, offset = 0) => this.requestAuthed(`/social/users/${username}/activities?limit=${limit}&offset=${offset}`),
            /**
             * publish on a user's activity stream.
             * Can only be your own profile.
             * @param message Message to publish
             * @returns Newly created publication
             * @throws {Error} Unknown user or no permission to publish
             */
            publish: (message) => this.requestAuthed(`/social/users/${this.username}/activities`, { title: message })
        };
        this.exoHostname = exoHostname;
        this.exoPath = exoPath;
        this.exoSecureProtocol = exoSecureProtocol;
        this.exoCiphers = exoCiphers;
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
                port: 80,
                secureProtocol: this.exoSecureProtocol,
                ciphers: this.exoCiphers,
                path: `${this.exoPath}${path}`,
                method,
                ...moreOptions
            };
            if (body) {
                if (!options.headers)
                    options.headers = {};
                options.headers['content-type'] = 'application/json';
            }
            const req = http_1.default.request(options, res => {
                let text = '';
                res.on('data', d => text += d);
                res.on('end', () => {
                    // There was an error
                    if (res.statusCode && res.statusCode > 400)
                        reject(new Error(`${res.statusCode} - ${text}`));
                    // Try to parse JSON output
                    if (text) {
                        try {
                            resolve(JSON.parse(text));
                        }
                        catch {
                            reject(new Error(`Could not parse the API's response. Status code : ${res.statusCode} - Body content: ${text}`));
                        }
                    }
                    else
                        resolve();
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
        args[0] = `/private/v1${args[0]}`;
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
                await this.requestAuthed('/social/users/');
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