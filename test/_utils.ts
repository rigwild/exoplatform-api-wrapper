import { resolve } from 'path'
import { ExecutionContext } from 'ava'

import ExoPlatformWrapper from '../src'
import { Space } from '../src/types/Space'
import { Activity } from '../src/types/Activity'
import { EXO_HOSTNAME, EXO_PATH, EXO_USERNAME, EXO_PASSWORD, EXO_SECURE_PROTOCOL } from './_config'

export const setupFile = resolve(__dirname, 'testSetup.json')
export const randomStr = (length = 6) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('')

export const login = async () => {
  const exoWrapper = new ExoPlatformWrapper(EXO_HOSTNAME, EXO_PATH, EXO_SECURE_PROTOCOL)
  await exoWrapper.login(EXO_USERNAME, EXO_PASSWORD)
  return exoWrapper
}

type AnyKey = { [key: string]: any }

export type ExportedTest = [
  /** Test name */
  string,
  /** Test execution context */
  (t: ExecutionContext<TestContext>) => void
]
export interface SetupFile {
  space: {
    RANDOM_ID: string
    displayName: string
    description: string | null
  }
}
export interface TestContext extends AnyKey {
  exoWrapper: ExoPlatformWrapper
  setup: SetupFile
  passedData: {
    space: Space
    activity: Activity
  } & AnyKey
}

export const loadTestContext = async (t: any) => {
  t.context.setup = await import(setupFile)
  t.context.exoWrapper = await login()
  t.context.passedData = {}
}
