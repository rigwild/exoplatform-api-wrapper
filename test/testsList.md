#### Activity
 - [ ] `readStream = () => {}`
 - [x] `read = (activityId: string) => {}`
 - [x] `edit = (activityId: string, message: string) => {}`
 - [x] `delete = (activityId: string) => {}`

#### Likes
 - [x] `list = (activityId: string) => {}`
 - [x] `add = (activityId: string) => {}`
 - [x] `remove = (activityId: string, username: string | undefined = this.username || undefined) => {}`

#### Comments
 - [x] `list = (activityId: string) => {}`
 - [x] `add = (activityId: string, message: string) => {}`
 - [x] `edit = (commentId: string, message: string) => {}`
 - [x] `remove = (commentId: string) => {}`

#### Space
 - [x] `create = (spaceData: SpacePartial) => {}`
 - [x] `edit = (spaceId: string, spaceData: SpacePartial) => {}`
 - [x] `getData = (spaceId: string) => {}`
 - [ ] `remove = (spaceId: string) => {}`
 - [ ] `readStream = (spaceId: string) => {}`
 - [x] `publish = (spaceId: string, message: string) => {}`

#### User
 - [ ] `readStream = (username: string | undefined = this.username || undefined) => {}`
 - [ ] `publish = (message: string) => {}`
