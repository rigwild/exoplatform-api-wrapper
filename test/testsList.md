 - [x] `login(username: string, password: string, checkCredentials: boolean = true)`
#### Activity
 - [x] `readStream()`
 - [x] `read(activityId: string)`
 - [x] `edit(activityId: string, message: string)`
 - [x] `remove(activityId: string)`

#### Likes
 - [x] `list(activityId: string)`
 - [x] `add(activityId: string)`
 - [x] `remove(activityId: string, username: string | undefined = this.username || undefined)`

#### Comments
 - [x] `list(activityId: string)`
 - [x] `add(activityId: string, message: string)`
 - [x] `edit(commentId: string, message: string)`
 - [x] `remove(commentId: string)`

#### Space
 - [x] `create(spaceData: SpacePartial)`
 - [x] `edit(spaceId: string, spaceData: SpacePartial)`
 - [x] `getData(spaceId: string)`
 - [x] `remove(spaceId: string)`
 - [x] `readStream(spaceId: string)`
 - [x] `publish(spaceId: string, message: string)`

#### User
 - [x] `readStream(username: string | undefined = this.username || undefined)`
 - [x] `publish(message: string)`
