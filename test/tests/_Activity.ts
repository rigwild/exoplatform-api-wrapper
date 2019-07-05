import { ExportedTest } from '../_utils'

export const editActivity: ExportedTest = ['Edit an activity', async t => {
  const message = `${t.context.passedData.activity.title}-edited`
  const activity = await t.context.exoWrapper.activity.edit(
    t.context.passedData.activity.id,
    message
  )
  t.is(activity.title, message)
  t.context.passedData.activity = activity
}]

export const readActivity: ExportedTest = ['Read an activity', async t => {
  const activity = await t.context.exoWrapper.activity.read(t.context.passedData.activity.id)
  t.is(activity.title, t.context.passedData.activity.title)
}]

export default {
  editActivity,
  readActivity
}