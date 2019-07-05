import { ExportedTest } from '../_utils'
import { SpaceSubscription, SpaceVisibility } from '../../src/types/Space'

export const createSpace: ExportedTest = ['Create a space', async t => {
  const displayName = t.context.setup.space.displayName
  const description = t.context.setup.space.description
  const space = await t.context.exoWrapper.space.create({
    displayName,
    description,
    subscription: SpaceSubscription.close,
    visibility: SpaceVisibility.hidden
  })
  t.is(space.displayName, displayName)
  t.is(space.description, description)
  t.context.passedData.space = space
}]

export const getSpace: ExportedTest = ['Get space data', async t => {
  const displayName = t.context.setup.space.displayName
  const description = t.context.setup.space.description
  const space = await t.context.exoWrapper.space.getData(t.context.passedData.space.id)
  t.is(space.displayName, displayName)
  t.is(space.description, description)
}]

export const editSpace: ExportedTest = ['Edit a space', async t => {
  const displayName = `${t.context.setup.space.displayName}-edited`
  const description = `${t.context.setup.space.description}-edited`
  const space = await t.context.exoWrapper.space.edit(t.context.passedData.space.id, {
    displayName,
    description,
    subscription: SpaceSubscription.open,
    visibility: SpaceVisibility.hidden
  })
  t.is(space.displayName, displayName)
  t.is(space.description, description)
}]

export const publishSpace: ExportedTest = ['Publish in a space', async t => {
  const message = 'Testing...'
  const activity = await t.context.exoWrapper.space.publish(
    t.context.passedData.space.id,
    message
  )
  t.is(activity.title, message)
  t.context.passedData.activity = activity
}]

export default {
  createSpace,
  getSpace,
  editSpace,
  publishSpace
}
