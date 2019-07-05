import { ExportedTest } from '../_utils'

export const activityRead: ExportedTest = ['Read an activity', async t => {
  const activity = await t.context.exoWrapper.activity.read(t.context.passedData.activity.id)
  t.is(activity.title, t.context.passedData.activity.title)
}]

export const activityEdit: ExportedTest = ['Edit an activity', async t => {
  const message = `${t.context.passedData.activity.title}-edited`
  const activity = await t.context.exoWrapper.activity.edit(
    t.context.passedData.activity.id,
    message
  )
  t.is(activity.title, message)
  t.context.passedData.activity = activity
}]


export const likeAdd: ExportedTest = ['Like an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.like.add(t.context.passedData.activity.id))
]

export const likeList: ExportedTest = ['List activity likers', async t => {
  const { likes } = await t.context.exoWrapper.activity.like.list(t.context.passedData.activity.id)
  t.is(likes.length, 1)
}]

export const likeRemove: ExportedTest = ['Unlike an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.like.remove(t.context.passedData.activity.id))
]


export const commentAdd: ExportedTest = ['Comment an activity', async t => {
  const message = `Testing-comment-${t.context.setup.RANDOM_ID}`
  const comment = await t.context.exoWrapper.activity.comment.add(
    t.context.passedData.activity.id,
    message
  )
  t.is(comment.title, message)
  t.context.passedData.comment = comment
}]

export const commentEdit: ExportedTest = ['Edit a comment', async t => {
  const message = `${t.context.passedData.comment.title}-edited`
  const comment = await t.context.exoWrapper.activity.comment.edit(
    t.context.passedData.comment.id,
    message
  )
  t.is(comment.title, message)
  t.context.passedData.comment = comment
}]

export const commentList: ExportedTest = ['List activity comments', async t => {
  const { comments } = await t.context.exoWrapper.activity.comment.list(t.context.passedData.activity.id)
  t.is(comments.length, 1)
  t.is(comments[0].title, t.context.passedData.comment.title)
}]

// FIXME: The API always responsce with a 500 error
export const commentRemove: ExportedTest = ['Remove a comment from an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.comment.remove(t.context.passedData.comment.id))
]


export const activityRemove: ExportedTest = ['Remove an activity', t =>
  t.notThrowsAsync(t.context.exoWrapper.activity.remove(t.context.passedData.activity.id))
]

export default {
  activityEdit,
  activityRead,
  likeAdd,
  likeList,
  likeRemove,
  commentAdd,
  commentList,
  commentEdit,
  commentRemove,
  activityRemove
}
