import anyTest, { TestInterface } from 'ava'

import ExoPlatformWrapper from '../src'
import { Space } from '../src/types/Space'
import { SpaceSubscription, SpaceVisibility } from '../src/types/Space'
import { Activity, Comment } from '../src/types/Activity'

interface ConfigObject {
  EXO_HOSTNAME: string
  EXO_PATH: string
  EXO_SECURE_PROTOCOL: string
  EXO_USERNAME: string
  EXO_PASSWORD: string
}

// Load a custom test object and load the tests setup
const test = anyTest as TestInterface<{
  exoWrapper: ExoPlatformWrapper
  /** Pre-test setup */
  setup: {
    RANDOM_ID: string
    config: ConfigObject
  }
  /** Any data passed from test to test */
  passedData: {
    space: Space
    activity: Activity
    userActivity: Activity
    comment: Comment
  }
}>


const randomStr = (length = 6) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
const loadConfig = () => {
  let missing = []
  if (!process.env.EXO_HOSTNAME) missing.push('EXO_HOSTNAME')
  if (!process.env.EXO_USERNAME) missing.push('EXO_USERNAME')
  if (!process.env.EXO_PASSWORD) missing.push('EXO_PASSWORD')
  if (missing.length > 0) throw new Error(`Missing configuration environment variables: ${missing}.`)
  const { EXO_HOSTNAME, EXO_PATH, EXO_USERNAME, EXO_PASSWORD, EXO_SECURE_PROTOCOL } = process.env
  return <ConfigObject>{ EXO_HOSTNAME, EXO_PATH, EXO_USERNAME, EXO_PASSWORD, EXO_SECURE_PROTOCOL }
}

// Hook to configure tests context and load configuration
test.before(t => {
  const config = loadConfig()
  t.context.setup = {
    RANDOM_ID: randomStr(),
    config
  }
  t.context.exoWrapper = new ExoPlatformWrapper(config.EXO_HOSTNAME, config.EXO_PATH, config.EXO_SECURE_PROTOCOL)
  t.context.passedData = <any>{}
})


test.serial('Login to the platform', t =>
  t.notThrowsAsync(t.context.exoWrapper.login(t.context.setup.config.EXO_USERNAME, t.context.setup.config.EXO_PASSWORD)))

// SPACE: `create = (spaceData: SpacePartial) => {}`
test.serial('Create a space', async t => {
  const displayName = `space-testing-${t.context.setup.RANDOM_ID}`
  const description = `space-testing-description-${t.context.setup.RANDOM_ID}`
  const space = await t.context.exoWrapper.space.create({
    displayName,
    description,
    subscription: SpaceSubscription.close,
    visibility: SpaceVisibility.hidden
  })
  t.is(space.displayName, displayName)
  t.is(space.description, description)
  t.context.passedData.space = space
})

// SPACE: `list = () => {}`
test.serial('List available spaces', async t => {
  const { spaces } = await t.context.exoWrapper.space.list()
  t.true(spaces.length > 0)
  t.truthy(spaces.find(x => x.displayName))
})

// SPACE: `getData = (spaceId: string) => {}`
test.serial('Get space data', async t => {
  const space = await t.context.exoWrapper.space.getData(t.context.passedData.space.id)
  t.is(space.displayName, t.context.passedData.space.displayName)
  t.is(space.description, t.context.passedData.space.description)
})

// SPACE: `edit = (spaceId: string, spaceData: SpacePartial) => {}`
test.serial('Edit a space', async t => {
  const displayName = `${t.context.passedData.space.displayName}-edited`
  const description = `${t.context.passedData.space.description}-edited`
  const space = await t.context.exoWrapper.space.edit(t.context.passedData.space.id, {
    displayName,
    description,
    subscription: SpaceSubscription.open,
    visibility: SpaceVisibility.hidden
  })
  t.is(space.displayName, displayName)
  t.is(space.description, description)
  t.context.passedData.space = space
})

// SPACE: `publish = (spaceId: string, message: string) => {}`
test.serial('Publish in a space', async t => {
  const message = `Testing-${t.context.setup.RANDOM_ID}`
  const activity = await t.context.exoWrapper.space.publish(
    t.context.passedData.space.id,
    message
  )
  t.is(activity.title, message)
  t.context.passedData.activity = activity
})

// ACTIVITY: `read = (activityId: string) => {}`
test.serial('Read an activity', async t => {
  const activity = await t.context.exoWrapper.activity.read(t.context.passedData.activity.id)
  t.is(activity.title, t.context.passedData.activity.title)
})

// ACTIVITY: `edit = (activityId: string, message: string) => {}`
test.serial('Edit an activity', async t => {
  const message = `${t.context.passedData.activity.title}-edited`
  const activity = await t.context.exoWrapper.activity.edit(
    t.context.passedData.activity.id,
    message
  )
  t.is(activity.title, message)
  t.context.passedData.activity = activity
})

// ACTIVITY-LIKE: `add = (activityId: string) => {}`
test.serial('Like an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.like.add(t.context.passedData.activity.id))
)

// ACTIVITY-LIKE: `list = (activityId: string) => {}`
test.serial('List activity likers', async t => {
  const { likes } = await t.context.exoWrapper.activity.like.list(t.context.passedData.activity.id)
  t.is(likes.length, 1)
})

// ACTIVITY-LIKE: `remove = (activityId: string, username: string | undefined = this.username || undefined) => {}`
test.serial('Unlike an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.like.remove(t.context.passedData.activity.id))
)

// ACTIVITY-COMMENT: `add = (activityId: string, message: string) => {}`
test.serial('Comment an activity', async t => {
  const message = `Testing-comment-${t.context.setup.RANDOM_ID}`
  const comment = await t.context.exoWrapper.activity.comment.add(
    t.context.passedData.activity.id,
    message
  )
  t.is(comment.title, message)
  t.context.passedData.comment = comment
})

// ACTIVITY-COMMENT: `edit = (commentId: string, message: string) => {}`
test.serial('Edit a comment', async t => {
  const message = `${t.context.passedData.comment.title}-edited`
  const comment = await t.context.exoWrapper.activity.comment.edit(
    t.context.passedData.comment.id,
    message
  )
  t.is(comment.title, message)
  t.context.passedData.comment = comment
})

// ACTIVITY-COMMENT: `list = (activityId: string) => {}`
test.serial('List activity comments', async t => {
  const { comments } = await t.context.exoWrapper.activity.comment.list(t.context.passedData.activity.id)
  t.is(comments.length, 1)
  t.is(comments[0].title, t.context.passedData.comment.title)
})

// FIXME: The API always respond with a 500 error
// ACTIVITY-COMMENT: `remove = (commentId: string) => {}`
test.todo('Remove a comment from an activity')
// test.serial('Remove a comment from an activity', t =>
//   t.notThrowsAsync(t.context.exoWrapper.activity.comment.remove(t.context.passedData.comment.id))
// )

// ACTIVITY: `readStream = () => {}`
test.serial('Read an activity stream', async t => {
  const { activities } = await t.context.exoWrapper.activity.readStream()
  const activity = activities.find(x => x.title)
  t.truthy(activity)
  t.is((<Activity>activity).title, t.context.passedData.activity.title)
})

// SPACE: `readStream = (spaceId: string) => {}`
test.serial('Read space stream', async t => {
  const { activities } = await t.context.exoWrapper.space.readStream(t.context.passedData.space.id)
  const activity = activities.find(x => x.title)
  t.truthy(activity)
  t.is((<Activity>activity).title, t.context.passedData.activity.title)
})

// ACTIVITY: `remove = (activityId: string) => {}`
test.serial('Remove an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.remove(t.context.passedData.activity.id))
)

// SPACE: `remove = (spaceId: string) => {}`
test.serial('Remove a space', async t =>
  t.notThrowsAsync(t.context.exoWrapper.space.remove(t.context.passedData.space.id)))

// USER: `publish = (message: string) => {}`
test.serial('Publish on a user stream', async t => {
  const message = `Testing-user-${t.context.setup.RANDOM_ID}`
  const activity = await t.context.exoWrapper.user.publish(message)
  t.is(activity.title, message)
  t.context.passedData.userActivity = activity
})

// USER: `readStream = (username: string | undefined = this.username || undefined) => {}`
test.serial('Read an user stream', async t => {
  const { activities } = await t.context.exoWrapper.user.readStream()
  const activity = activities.find(x => x.title)
  t.truthy(activity)
  t.is((<Activity>activity).title, t.context.passedData.userActivity.title)
  return t.notThrowsAsync(t.context.exoWrapper.activity.remove(t.context.passedData.userActivity.id))
})
