const dotenv = require('dotenv')
const path = require('path')

const { ExoPlatformWrapper } = require('../dist/index.js')

dotenv.config({ path: path.resolve(__dirname, '.env') })
if (['EXO_HOSTNAME', 'EXO_PATH', 'EXO_SECURE_PROTOCOL', 'EXO_USERNAME', 'EXO_PASSWORD'].some(x => process.env[x] === undefined))
  throw new Error('You must specify your configuration as environment variables to run the tests (EXO_HOSTNAME, EXO_PATH, EXO_SECURE_PROTOCOL, EXO_USERNAME, EXO_PASSWORD).')

const setup = async () => {
  const bot = new ExoPlatformWrapper(process.env.EXO_HOSTNAME, process.env.EXO_PATH, process.env.EXO_SECURE_PROTOCOL)
  await bot.login(process.env.EXO_USERNAME, process.env.EXO_PASSWORD)

  const posted = await bot.user.publish(process.env.EXO_USERNAME, 'Testing')
  console.log(await bot.activity.editId(posted.id, 'Testing...'))
  console.log('If it worked, the message `Testing...` was posted on your profile.')
}

setup()
