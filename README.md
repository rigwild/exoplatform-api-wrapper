# exoplatform-api-wrapper

[![npm badge](https://img.shields.io/npm/v/exoplatform-api-wrapper.svg?logo=npm)](https://www.npmjs.com/package/exoplatform-api-wrapper)
[![Build Status](https://travis-ci.org/rigwild/exoplatform-api-wrapper.svg?branch=master)](https://travis-ci.org/rigwild/exoplatform-api-wrapper)

A wrapper for the API of the [Open source Enterprise Social Network](https://www.exoplatform.com/enterprise-social-network/) of [eXo Platform](https://www.exoplatform.com/). It covers the [Social REST API](https://docs-old.exoplatform.org/public/index.jsp?topic=%2FPLF43%2FPLFDevGuide.eXoPlatformAPIs.RestAPIs.Social.DataModels.Activity.html), which is badly documented.

It is entirely built from TypeScript and fully tested. API responses are typed, so you can get full auto-completion in your code editor.

This project is dependency-free.

## Install
```sh
yarn add exoplatform-api-wrapper
# or
npm i exoplatform-api-wrapper
```

## Usage
The example below shows how to get activities available in a user's feed.
```ts
import ExoPlatformWrapper from 'exoplatform-api-wrapper'

const setup = async () => {
  const exoWrapper = new ExoPlatformWrapper('www.example.com')
  await exoWrapper.login('myUsername', 'myPassword')
  const { activities } = await exoWrapper.user.readStream()
  console.log(activities)
}

setup()
```

## Documentation
See [rigwild.github.io/exoplatform-api-wrapper](https://rigwild.github.io/exoplatform-api-wrapper/classes/_exoplatformwrapper_.exoplatformwrapper).

Full API coverage/example is available in the automated tests: [`./test/tests.ts`](./test/tests.ts#L45-L9999).

## Running tests
You must configure the tests by setting the following environment variables.

| Environment variable | Description | Required | Default | Example |
| -------------------- | ----------- | :------: | ------- | ------- |
| `EXO_HOSTNAME` | eXo Platform social network hostname (no protocol://) | ✅ ||`www.example.com` |
| `EXO_PATH` | eXo Platform API path | ❌ | `/rest` | `/exo/platform/rest` |
| `EXO_USERNAME` | eXo Platform account username | ✅ || `myUser` |
| `EXO_PASSWORD` | eXo Platform account password | ✅ || `myPassword` |
| `EXO_SECURE_PROTOCOL` | SSL protocol to use (do not touch if you don't know what it is!!) | ❌ | `undefined` | `TLSv1_method` |
| `EXO_CIPHERS` | SSL ciphers to use (do not touch if you don't know what it is!!) | ❌ | `undefined` | `AES128-SHA` |

Then, you can run the tests:
```sh
yarn test
# or
npm run test
```

## Notice
The author of this library is not affiliated in any way with eXo Platform.

## Contributing
If you found a bug or want any features not available yet, feel free to open an [issue](https://github.com/rigwild/exoplatform-api-wrapper/issues) documentating the problem.

You may also contribute to the project by opening a [Pull Request](https://github.com/rigwild/exoplatform-api-wrapper/pulls).

## License
[The MIT license](./LICENSE)
