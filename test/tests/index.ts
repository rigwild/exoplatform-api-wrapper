import anyTest, { TestInterface } from 'ava'

import { TestContext, loadTestContext } from '../_utils'

import SpaceTests from './_Space'
import ActivityTests from './_Activity'

// Load a custom test object and load the tests setup
export const test = anyTest as TestInterface<TestContext>
test.before(loadTestContext)
// test.beforeEach(async () => {
//   await new Promise(res => setTimeout(res, 1000))
// })

test.serial(...SpaceTests.createSpace)
test.serial(...SpaceTests.getSpace)
test.serial(...SpaceTests.editSpace)
test.serial(...SpaceTests.publishSpace)

test.serial(...ActivityTests.activityRead)
test.serial(...ActivityTests.activityEdit)
test.serial(...ActivityTests.likeAdd)
test.serial(...ActivityTests.likeList)
test.serial(...ActivityTests.likeRemove)
test.serial(...ActivityTests.commentAdd)
test.serial(...ActivityTests.commentList)
test.serial(...ActivityTests.commentEdit)
// FIXME: The API always responsce with a 500 error
// test.serial(...ActivityTests.commentRemove)
test.serial(...ActivityTests.activityRemove)
