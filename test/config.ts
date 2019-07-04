import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '.env') })

if (!process.env.EXO_HOSTNAME || !process.env.EXO_PATH || !process.env.EXO_SECURE_PROTOCOL || !process.env.EXO_USERNAME || !process.env.EXO_PASSWORD)
  throw new Error('You must specify your configuration as environment variables to run the bot (EXO_HOSTNAME, EXO_PATH, EXO_SECURE_PROTOCOL, EXO_USERNAME, EXO_PASSWORD).')

export const EXO_HOSTNAME: string = process.env.EXO_HOSTNAME
export const EXO_PATH: string = process.env.EXO_PATH
export const EXO_SECURE_PROTOCOL: string = process.env.EXO_SECURE_PROTOCOL
export const EXO_USERNAME: string = process.env.EXO_USERNAME
export const EXO_PASSWORD: string = process.env.EXO_PASSWORD

export default {
  EXO_HOSTNAME,
  EXO_PATH,
  EXO_SECURE_PROTOCOL,
  EXO_USERNAME,
  EXO_PASSWORD,
}
