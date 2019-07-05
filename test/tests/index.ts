import anyTest, { TestInterface } from 'ava'

import { TestContext, loadTestContext } from '../_utils'

import SpaceTests from './_Space'
import ActivityTests from './_Activity'

// Load a custom test object and load the tests setup
export const test = anyTest as TestInterface<TestContext>
test.before(loadTestContext)

test.serial(...SpaceTests.createSpace)
test.serial(...SpaceTests.getSpace)
test.serial(...SpaceTests.editSpace)
test.serial(...SpaceTests.publishSpace)

test.serial(...ActivityTests.editActivity)
test.serial(...ActivityTests.readActivity)
