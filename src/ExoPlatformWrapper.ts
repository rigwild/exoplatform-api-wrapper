import https, { RequestOptions } from 'https'
import { Activity, Comment } from './types/Activity'
import { ApiResponseList } from './types/ApiResponse'
import { User } from './types/User'
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
          if (res.statusCode && res.statusCode > 400)
            reject(new Error(`${res.statusCode} - ${text}`))
          // Try to parse JSON output
          try {
            resolve(JSON.parse(text))
          }
          catch {
            reject(new Error(`Could not parse the API's response. Status code : ${res.statusCode} - Body content: ${text}`))
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
    readAll: () =>
      this.requestAuthed<ApiResponseList<{ activities: Activity[] }>>(`/private/v1/social/activities`),

    /**
     * Read an activity.
     * Must have read-access.
     * @param activityId Id of the targeted activity
     * @returns Activity content
     * @throws {Error} Unknown activity or no permission to read
     */
    read: (activityId: string) =>
      this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}`),

    /**
     * Edit an activity.
     * Must have write-access.
     * @param activityId Id of the targeted activity
     * @returns List of publications
     * @throws {Error} Unknown activity or no permission to edit
     */
    edit: (activityId: string, message: string) =>
      this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}`, { title: message }, 'PUT'),

    /**
     * Delete an activity.
     * Must have write-access.
     * @returns Activity content
     * @throws {Error} Unknown activity or no permission to delete
     */
    delete: (activityId: string) =>
      this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}`, null, 'DELETE'),


    /** Operations related to an activity's likes */
    like: {
      /**
       * Get activity likers.
       * Must have read-access.
       * @param activityId Id of the targeted activity
       * @returns Activity likers
       * @throws {Error} Unknown activity or no permission to read
       */
      list: (activityId: string) =>
        this.requestAuthed<ApiResponseList<{ likes: User[] }>>(`/private/v1/social/activities/${activityId}/likes`),

      /**
       * Like an activity.
       * Must have read-access.
       * @param activityId Id of the targeted activity
       * @returns Activity content
       * @throws {Error} Unknown activity or no permission to read
       */
      add: (activityId: string) =>
        this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}/likes`, null, 'POST'),

      /**
       * Remove a like from an activity.
       * Must have permission to delete the targetted like.
       * @param activityId Id of the targeted activity
       * @param username Id of the user to remove the like from (if you are admin). Defaults to current logged in user
       * @returns Activity content
       * @throws {Error} Unknown activity or no permission to read or no permission to remove the like
       */
      remove: (activityId: string, username: string | undefined = this.username || undefined) =>
        this.requestAuthed<Activity>(`/private/v1/social/activities/${activityId}/likes/${username}`, null, 'DELETE')
    },

    /** Operations related to an activity's comments */
    comment: {
      /**
       * Get activity comments.
       * Must have read-access.
       * @param activityId Id of the targeted activity
       * @returns Activity comments
       * @throws {Error} Unknown activity or no permission to read
       */
      list: (activityId: string) =>
        this.requestAuthed<ApiResponseList<{ comments: Comment[] }>>(`/private/v1/social/activities/${activityId}/comments`),

      /**
       * Comment an activity.
       * Must have read-access.
       * @param activityId Id of the targeted activity
       * @param message Comment to add
       * @returns Comment content
       * @throws {Error} Unknown activity or no permission to read
       */
      add: (activityId: string, message: string) =>
        this.requestAuthed<Comment>(`/private/v1/social/activities/${activityId}/comments`, { title: message }, 'POST'),

      /**
       * Edit a comment.
       * Must have write-access.
       * @param commentId Id of the targeted comment
       * @param message New comment
       * @returns Comment content
       * @throws {Error} Unknown comment or no permission to edit
       */
      edit: (commentId: string, message: string) =>
        this.requestAuthed<Comment>(`/private/v1/social/comments/comment${commentId}`, { title: message }, 'PUT'),

      /**
       * Delete a comment.
       * Must have write-access.
       * @param commentId Id of the targeted comment
       * @returns Comment content
       * @throws {Error} Unknown comment or no permission to delete the comment
       */
      remove: (commentId: string) =>
        this.requestAuthed<Comment>(`/private/v1/social/comments/comment${commentId}`, null, 'DELETE'),
    }
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
    read: (spaceId: string) =>
      this.requestAuthed<ApiResponseList<{ activities: Activity[] }>>(`/private/v1/social/spaces/${spaceId}/activities`),

    /**
     * Publish on a spaces's activity stream.
     * Must have write-access.
     * @param spaceId Id of the targeted space
     * @param message Message to publish
     * @returns Newly created publication
     * @throws {Error} Unknown space or no permission to publish
     */
    publish: (spaceId: string, message: string) =>
      this.requestAuthed<Activity>(`/private/v1/social/spaces/${spaceId}/activities`, { title: message })
  }

  /** Operations related to a user's stream activity */
  user = {
    /**
     * Read a user's activity stream.
     * @param username Id of the targeted user. Defaults to current logged in user
     * @returns Activities list
     * @throws {Error} Unknown user or no permission to read
     */
    read: (username: string | undefined = this.username || undefined) =>
      this.requestAuthed<ApiResponseList<{ activities: Activity[] }>>(`/private/v1/social/users/${username}/activities`),

    /**
     * publish on a user's activity stream.
     * Can only be your own profile.
     * @param message Message to publish
     * @returns Newly created publication
     * @throws {Error} Unknown user or no permission to publish
     */
    publish: (message: string) =>
      this.requestAuthed<Activity>(`/private/v1/social/users/${this.username}/activities`, { title: message })
  }
}

export default ExoPlatformWrapper
