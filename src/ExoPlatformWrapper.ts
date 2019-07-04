import https, { RequestOptions } from 'https'

import { Activity } from './types/Activity'
import msgId from './msgId'

class ExoPlatformWrapper {
  /** eXo Platform username */
  private username: string | null = null

  /** eXo Platform password */
  private password: string | null = null

  /** Hostname of the API (don't include protocol or path) */
  exoHostname: string
  /** Path to the eXo REST API, `/rest` by default */
  exoPath: string = '/rest'
  /** SSL protocol to use (don't set if you don't know what is it!) */
  exoSecureProtocol?: string

  /**
   * Create a bot instance
   * @param exoHostname Hostname of the API (don't include protocol or path)
   * @param exoPath Path to the eXo REST API, `/rest` by default
   * @param exoSecureProtocol SSL protocol to use (don't set if you don't know what is it!)
   */
  constructor(exoHostname: string, exoPath: string = '/rest', exoSecureProtocol?: string) {
    this.exoHostname = exoHostname
    this.exoPath = exoPath
    this.exoSecureProtocol = exoSecureProtocol
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
  request<T extends {}>(
    path: string,
    body: object | null = null,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = body ? 'POST' : 'GET',
    moreOptions?: Partial<RequestOptions>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let options: RequestOptions = {
        auth: `${this.username}:${this.password}`,
        hostname: this.exoHostname,
        port: 443,
        secureProtocol: this.exoSecureProtocol,
        path: `${this.exoPath}${path}`,
        method,
        ...moreOptions
      }
      if (body) {
        if (!options.headers) options.headers = {}
        options.headers['content-type'] = 'application/json'
      }
      const req = https.request(options, res => {
        let text = ''
        res.on('data', d => text += d)
        res.on('end', () => {
          // There was an error
          if (res.statusCode && res.statusCode > 400) {
            // Try to extract the error
            const parsedError = /Description\<\/b\>\s(.*?)\<\/p\>/g.exec(text)
            if (parsedError && parsedError.length >= 2)
              reject(new Error(`${res.statusCode} - ${parsedError[1]}`))
            reject(new Error(`${res.statusCode} - ${text}`))
          }
          // Try to parse JSON output
          try {
            resolve(JSON.parse(text))
          }
          catch {
            reject(new Error(`Could not parse the API's response. Body content: ${text}`))
          }
        })
      })
      req.on('error', reject)
      if (body) req.write(JSON.stringify(body))
      req.end()
    })
  }

  /**
   * Make an authenticated API call to the eXo Platform configured API.
   * @param args Same as `this.request`
   * @returns Same as `this.request`
   * @throws {Error} You must be authenticated using `this.login`
   */
  async requestAuthed<T extends {}>(...args: Parameters<ExoPlatformWrapper['request']>) {
    if (!this.username || !this.password) throw new Error(msgId.NEED_LOGGED_IN)
    return this.request<T>(...args)
  }

  /**
   * Set login credentials and check validity.
   * @param username eXo Platform username
   * @param password eXo Platform password
   * @param checkCredentials Should the eXo Platform credentials be checked
   * @throws {Error} Invalid credentials (if checkCredentials = true)
   */
  async login(username: string, password: string, checkCredentials: boolean = true): Promise<void> {
    if (this.username || this.password) throw new Error(msgId.NEED_LOGGED_OUT)

    this.username = username
    this.password = password

    // Check credentials
    if (checkCredentials) {
      try {
        await this.request('/private/v1/social/users/')
      }
      catch (error) {
        this.username = null
        this.password = null
        throw error
      }
    }
  }

  /** Operations related to activities */
  activity = {
    /**
     * Get list of activities.
     * @returns Activities list
     */
    read: () => this.requestAuthed<{ activities: Activity[] }>(`/private/v1/social/activities`),

    /**
     * Read an activity.
     * Must have read-access.
     * @param activityId Id of the targeted activity
     * @returns Activity content
     * @throws {Error} Unknown activity or no permission to read
     */
    readId: (activityId: string) =>
      this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}`),

    /**
     * Edit an activity.
     * Must have write-access.
     * @param activityId Id of the targeted activity
     * @returns List of publications
     * @throws {Error} Unknown activity or no permission to edit
     */
    editId: (activityId: string, message: string): Promise<object> =>
      this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}`, { title: message }, 'PUT'),

    /**
     * Delete an activity.
     * Must have write-access.
     * @returns Activity content
     * @throws {Error} Unknown activity or no permission to delete
     */
    deleteId: (activityId: string): Promise<object> =>
      this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}`, null, 'DELETE'),
  }

  /** Operations related to a space's stream activity */
  space = {
    /**
     * Read a spaces's activity stream.
     * Must have read-access.
     * @param spaceId Id of the targeted space
     * @returns List of publications
     * @throws {Error} Unknown space or no permission to read
     */
    read: (spaceId: string): Promise<{ activities: Activity[] }> =>
      this.requestAuthed<{ activities: Activity[] }>(`/private/v1/social/spaces/${spaceId}/activities`),

    /**
     * Publish on a spaces's activity stream.
     * Must have write-access.
     * @param spaceId Id of the targeted space
     * @param message Message to publish
     * @returns Newly created publication
     * @throws {Error} Unknown space or no permission to publish
     */
    publish: (spaceId: string, message: string): Promise<object> =>
      this.requestAuthed<Activity>(`/private/v1/social/spaces/${spaceId}/activities`, { title: message }),
  }

  /** Operations related to a user's stream activity */
  user = {
    /**
     * publish on a user's activity stream.
     * Must be your own profile.
     * @param userId Id of the targeted profile
     * @param message Message to publish
     * @returns Newly created publication
     * @throws {Error} Unknown user or no permission to publish
     */
    publish: (userId: string, message: string): Promise<object> =>
      this.requestAuthed<Activity>(`/private/v1/social/users/${userId}/activities`, { title: message })
  }
}

export default ExoPlatformWrapper
