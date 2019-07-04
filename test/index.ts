import config from './config'
import { ExoPlatformWrapper } from '../src'

const setup = async () => {
  const bot = new ExoPlatformWrapper(config.EXO_HOSTNAME, config.EXO_PATH, config.EXO_SECURE_PROTOCOL)
  await bot.login(config.EXO_USERNAME, config.EXO_PASSWORD)

  const posted = await bot.user.publish('Testing')
  console.log(await bot.activity.edit(posted.id, 'Testing...'))
  console.log('If it worked, the message `Testing...` was posted on your profile.')

  // console.log(await bot.activity.readAll())
  // console.log(await bot.activity.read('513'))
  // console.log(await bot.activity.edit('513'))
  // console.log(await bot.activity.delete('513'))
  // console.log(await bot.activity.like.list('513'))
  // console.log(await bot.activity.like.add('513'))
  // console.log(await bot.activity.like.remove('513'))
  // console.log(await bot.activity.comment.list('513'))
  // console.log(await bot.activity.comment.add('513', 'mdr'))
  // console.log(await bot.activity.comment.edit('516', 'mdr_edited'))
  // console.log(await bot.activity.comment.remove('514'))
  // console.log(await bot.space.read('513'))
  // console.log(await bot.space.publish('513'))
  // console.log(await bot.user.read('513'))
  // console.log(await bot.user.publish('513'))
}

setup()
