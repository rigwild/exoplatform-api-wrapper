import anyTest, { TestInterface } from 'ava'

import { TestContext, loadTestContext } from './_utils'
import { SpaceSubscription, SpaceVisibility } from '../src/types/Space'
import { Activity } from '../src/types/Activity'
import { EXO_USERNAME, EXO_PASSWORD } from './_config'

// Load a custom test object and load the tests setup
export const test = anyTest as TestInterface<TestContext>
test.before(loadTestContext)
// test.beforeEach(async () => {
//   await new Promise(res => setTimeout(res, 1000))
// })

test.serial('Login to the platform', t => t.notThrowsAsync(t.context.exoWrapper.login(EXO_USERNAME, EXO_PASSWORD)))

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
