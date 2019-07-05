#### ACTIVITY
 - [ ] `readStream = () => {}`
 - [x] `read = (activityId: string) => {}`
 - [x] `edit = (activityId: string, message: string) => {}`
 - [ ] `delete = (activityId: string) => {}`

#### LIKES
 - [ ] `list = (activityId: string) => {}`
 - [ ] `add = (activityId: string) => {}`
 - [ ] `remove = (activityId: string, username: string | undefined = this.username || undefined) => {}`

#### COMMENTS
 - [ ] `list = (activityId: string) => {}`
 - [ ] `add = (activityId: string, message: string) => {}`
 - [ ] `edit = (commentId: string, message: string) => {}`
 - [ ] `remove = (commentId: string) => {}`

#### SPACE
 - [x] `create = (spaceData: SpacePartial) => {}`
 - [x] `edit = (spaceId: string, spaceData: SpacePartial) => {}`
 - [x] `getData = (spaceId: string) => {}`
 - [ ] `remove = (spaceId: string) => {}`
 - [ ] `readStream = (spaceId: string) => {}`
 - [x] `publish = (spaceId: string, message: string) => {}`

#### USER
 - [ ] `readStream = (username: string | undefined = this.username || undefined) => {}`
 - [ ] `publish = (message: string) => {}`
