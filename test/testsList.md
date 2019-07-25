 - [x] `login(username: string, password: string, checkCredentials: boolean = true)`
#### Activity
 - [x] `readStream(limit: number = 20, offset: number = 0)`
 - [x] `read(activityId: string)`
 - [x] `edit(activityId: string, message: string)`
 - [x] `remove(activityId: string)`

#### Likes
 - [x] `list(activityId: string, limit: number = 20, offset: number = 0)`
 - [x] `add(activityId: string)`
 - [x] `remove(activityId: string, username: string | undefined = this.username || undefined)`

#### Comments
 - [x] `list(activityId: string, limit: number = 20, offset: number = 0)`
 - [x] `add(activityId: string, message: string)`
 - [x] `edit(commentId: string, message: string)`
 - [x] `remove(commentId: string)`

#### Space
 - [x] `create(spaceData: SpacePartial, limit: number = 20, offset: number = 0)`
 - [x] `edit(spaceId: string, spaceData: SpacePartial)`
 - [x] `getData(spaceId: string)`
 - [x] `remove(spaceId: string)`
 - [x] `readStream(spaceId: string, limit: number = 20, offset: number = 0)`
 - [x] `publish(spaceId: string, message: string)`

#### User
 - [x] `list(limit: number = 20, offset: number = 0)`
 - [x] `readStream(username: string | undefined = this.username || undefined, limit: number = 20, offset: number = 0)`
 - [x] `publish(message: string)`
