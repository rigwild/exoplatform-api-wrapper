import { ExecutionContext, TestInterface } from 'ava'

import ExoPlatformWrapper from '../src'
import { Space } from '../src/types/Space'
import { Activity, Comment } from '../src/types/Activity'
import { EXO_HOSTNAME, EXO_PATH, EXO_SECURE_PROTOCOL } from './_config'

export type ExportedTest = [
  /** Test name */
  string,
  /** Test execution context */
  (t: ExecutionContext<TestContext>) => void
]
export interface TestContext {
  exoWrapper: ExoPlatformWrapper
  /** Pre-test setup */
  setup: {
    RANDOM_ID: string
  }
  /** Any data passed from test to test */
  passedData: {
    space: Space
    activity: Activity
    userActivity: Activity
    comment: Comment
  }
}

const randomStr = (length = 6) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
export const loadTestContext = async (t: ExecutionContext<TestContext>) => {
  t.context.setup = { RANDOM_ID: randomStr() }
  t.context.exoWrapper = new ExoPlatformWrapper(EXO_HOSTNAME, EXO_PATH, EXO_SECURE_PROTOCOL)
  t.context.passedData = <any>{}
}
