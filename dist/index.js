"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const msgId_1 = __importDefault(require("./msgId"));
class ExoplatformBot {
    /**
     * Create a bot instance
     * @param exoHostname Hostname of the API (don't include protocol or path)
     * @param exoPath Path to the eXo REST API, `/rest` by default
     * @param secureProtocol SSL protocol to use (don't set if you don't know what is it!)
     */
    constructor(exoHostname, exoPath = '/rest', secureProtocol) {
        this.username = null;
        this.password = null;
        this.exoHostname = exoHostname;
        this.exoPath = exoPath;
        this.exoSecureProtocol = secureProtocol;
    }
    /**
     * Make an API call to eXo Platform configured API.
     * @param path Path to the API endpoint
     * @param body Request body object
     * @param method HTTP request method
     * @param moreOptions Any options to inject in the request options
     * @throws The API returned an error
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
                        text = JSON.parse(text);
                    }
                    catch { }
                    resolve({ body: text, response: res });
                });
            });
            req.on('error', reject);
            if (body)
                req.write(JSON.stringify(body));
            req.end();
        });
    }
    /**
     * Set login credentials and check validity.
     * @param username eXo Platform username
     * @param password eXo Platform password
     * @throws Invalid credentials
     */
    async login(username, password) {
        if (this.username || this.password)
            throw new Error(msgId_1.default.NEED_LOGGED_OUT);
        // Check credentials
        this.username = username;
        this.password = password;
        try {
            await this.request('/private/v1/social/users/');
        }
        catch (error) {
            this.username = null;
            this.password = null;
            throw error;
        }
    }
    /**
     * Make an API call to eXo Platform configured API, but throws if not logged in..
     * @param args Same as `this.request`
     * @returns Same as `this.request`
     * @throws {Error} `this.login` must be called before `this.loggedInRequest`
     */
    async loggedInRequest(...args) {
        if (!this.username || !this.password)
            throw new Error(msgId_1.default.NEED_LOGGED_IN);
        return this.request(...args);
    }
    /**
     * Post on a user's activity stream.
     * Must be your own profile.
     * @param userId Id of the targeted profile
     * @param message Message to post
     * @returns Newly created post
     * @throws Unknown user or no permission to post
     */
    async postUser(userId, message) {
        return (await this.loggedInRequest(`/private/v1/social/users/${userId}/activities`, { title: message })).body;
    }
    /**
     * Post on a spaces's activity stream.
     * Must have write-access.
     * @param spaceId Id of the targeted space
     * @param message Message to post
     * @returns Newly created post
     * @throws Unknown space or no permission to post
     */
    async postSpace(spaceId, message) {
        return (await this.loggedInRequest(`/private/v1/social/spaces/${spaceId}/activities`, { title: message })).body;
    }
}
exports.default = ExoplatformBot;
//# sourceMappingURL=index.js.map