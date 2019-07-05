import { promises as fs } from 'fs'

import { randomStr, setupFile, SetupFile } from './_utils'

const setupBefore = async () => {
  console.log('Creating a custom tests setup before running tests...')
  const randomSpaceId = randomStr()
  const obj: SetupFile = {
    space: {
      RANDOM_ID: randomSpaceId,
      displayName: `space-testing-${randomSpaceId}`,
      description: `space-testing-description-${randomSpaceId}`
    }
  }
  await fs.writeFile(setupFile, JSON.stringify(obj, null, 2))
  console.log('Running tests...')
}

const setupAfter = async () => {
  console.log('Tests ran successfully. Cleaning tests setup...')
  await fs.unlink(setupFile)
  console.log('Setup cleaned.')
}

const loader = () => {
  const argv = process.argv.slice(2)
  if (argv.length === 1) {
    if (argv[0] === '--before') return setupBefore()
    else if (argv[0] === '--after') return setupAfter()
  }
}

loader()
