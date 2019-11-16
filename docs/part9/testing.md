# Test Driven Development

[jwarden 3.10.2019] TODO: These code examples are massive... shrink 'em or break them out into sections. Also, why is this called testing, yet title is Test Driven Development?

**Caveat**: This section is not promoting Test Driven Development. It is not saying TDD is the one, true way to do things. It is not encouraging you to use TDD. Rather, it's a lens to show the truth of what Functional Programming will NOT solve for you, yet still containing helpful programming advice. That, and you should learn about TDD because multiple smart, experienced people agree it has goodness within despite the various, justified detractors.

The Test Driven Development methodology gives uses unit testing as a way to design your code while ensuring you can be confident in constant feature additions and changes.

However, the meaning of TDD over the years has warped into test everything first, and maintain this massive unit test suite full of complicated mocks and stubs, you can't play with ideas at all, or that your code is driven by tests. Once you start bringing in [Selenium](https://www.seleniumhq.org/) / functional tests, things got worse.  The much respected David Heinemeier Hansson, known as [DHH on Twitter](https://twitter.com/dhh) and famous for a variety of things namely creating [Ruby on Rails](https://rubyonrails.org/), wrote a pretty [scathing blog post on TDD](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html) which further clouded the value.

Let's assume for this post TDD is like Agile: Triggers a maligned attitude at its mere mention, is misunderstood, everyone says they practice it, apparently don't do it right, yet there is some truth is in there somewhere.

Functional Programming, while making things easier to unit test, does NOT solve the problems of maintaining large unit test suites, helping you in consulting to convince teams to move from the [ice cream cone to the test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) or hexagon/honeycomb/hardcore drugs, or ensuring your stubs accurately reflect the concretes they are substituting.

Like Object Oriented Programming, it follows the same rules that Kent Beck and crew laid out to test the feature. We use the term feature instead of module because Node, Python, and Lua use the term module to imply "where you put your function(s) and class(es)". Functional Programming like good Object Oriented code bases and bases in [Factorio](https://www.factorio.com/), benefits from automating everything.

Below will cover the false sense of security Functional Programming can give you, how Red Green Refactor is practiced in Functional Programming, and stating the obvious trade offs with using concrete implementations vs. stubs.

## False Sense of Security

Functional Programming can give you a few false senses of security:

- Your test suite size WILL go down
- individual functions with few arguments are easier to test
- you'll get 100% test coverage more easily
- your tests are deterministic and pass consistently
- your larger test suites can be run concurrently, speeding them up and not breaking because there is no shared state in pure functions

While the suite size goes down, a lot of those tests may be testing implementation details and you don't need to test those. Like in OOP, publics test your privates. With 100% test coverage, you'll still get bugs. Stubs are not your concrete implementations; they are different. Consistently passing tests just mean they're consistently missing bugs or consistently having false positives. Functions with a lot of arguments, however, are still hard, have a lot of stubs, and can be just as confusing as large mocks.

Bottom line, even if you no longer get new features, libraries update a lot for security reasons and innovation that changes the public API. You need to change your code even if your code isn't changing. Additionally, no one likes to maintain large test suites, even if they are more understandable in Functional code. This slows you and/or your team down. It's easier to delete the tests and start from scratch.

To end on a happy note, it's a false sense of security, NOT accomplishment. The unit tests, high coverage, and few stubs are something you should be proud of. Just don't let it go to your head.

## What is a Public API?

When we talk about a public API from a Functional Programming perspective, we mean whatever functions are exposed from your module. Now, in Dynamic languages, there often isn't a lot of control here, nor a feature of public, private, nor protected, so you'll do one of the following:

1. expose everything
2. expose everything, but name things with underscore prefixes (i.e. `thisIsPublic`, `_thisIsPrivate`)
3. expose nothing and use closures only
4. combination of the above using globals and a custom module system

What we mean by public API in JavaScript Node is whatever functions `module.exports` has on it, or whatever uses the `export` keyword in ES6. For Python, whatever your folder exposes via `__init__.py`. For Lua, whatever you return from your module file.

Now, all 3 of those are modules, but they could import other modules and not expose those internals:

```javascript
// string.js
const { startCase } = require('lodash')
const parseName = name => name.split(' ').reverse().map(startCase).join(', ')

module.exports = parseName

// api.js
const parseName = require('./string')

module.exports = parseName
```

Our API in this case is the `parseName` function from the `api.js` file.

If we import `parseName` from `api.js`, we can use it, but can't access anything else from it, nor from `string.js`. This controlled level of privacy allows api to only expose things it wants, and change the internals however it wants. This controlled flexibility is good: easier for the developers to get their ideas down in code and folders how they want, yet providing developers using it a consistent API. If the `api.js` were to change, they'd do a major version change in their `package.json` so code bases wouldn't break unless those developers are ready to change their code to accommodate the API change.

The `parseName` is a function, but in OOP code bases, it'd be a `class`, and that class would have only `public` methods for you to utilize to access the internals however it sees fit. Both OOP and Functional Programming can practice encapsulation. 

## TDD: Internal vs. Feature

TDD is pitched as "write the test first, make it fail, then fix the code under test to make it pass". However, that leads to "every function/class in my code base most likely has a test". For libraries especially, this may seem ok, but eventually you end up with massive amounts of unit tests usually outnumbering your code because of the stub and/or mock sizes. The problem here is soon as you want to change anything, even if you're not changing the public API, a lot of your tests break. So even if you don't change the public api, you're still having to maintain and modify all of those tests even if your feature doesn't break.

... and that's what we care about: the feature.

Both OOP and FP agree that they don't care about your implementation details, just the public API. However, the public API might not be your feature. You might not even know your public API yet.

## Red, Green, Refactor

The following describes how to practice Red, Green, Refactor for Functional Programming. Red Green Refactor is the core way of practicing Test Driven Development.

### Step 1: Failing Feature Unit Test

Take your feature, and write a unit test for it. Do the bare minimum to get it to compile and then ensure the test fails for the function not returning the right value. For the back-end this could be just 1 module that exports 1 method to "do all the things". For front end, this could be unit test verifying you can do the basics in virtual DOM (it doesn't have to be Selenium based).

### Step 2: Write Your Fun Code

Write the code that will make the feature work. This should be right side brain fun. Don't stress about 100% function purity, nor worry getting your visual design pixel perfect to the design comps. Use real implementations of libraries instead of stubs/mocks. For front end, get the UI connected to the back-end. For the back-end, get it talking to the database or socket server and showing things in the browser or curl or [Postman](https://www.getpostman.com/) for REST URL's. This should make your feature test pass.

No new tests should be added in this step.

### Step 3: Refactor

Make the code as pure as you deem appropriate and refactor until your happy. This should be the left brain fun.

No new tests should be added in this step.

### Red, Green, Refactor Conclusion

The result should be a Red unit test, a Green test after your feature mostly works, and then code you're proud of without breaking the test nor by adding any new tests. When you add a new feature, repeat steps 1, 2, and 3. If you're using code coverage, you'll note that many paths aren't followed unless certain error conditions arise, and that's ok for now. We're interested in the happy path: does the feature work. Unhappy paths, such as login failure, are a feature as well so test those with the same guidelines.

## API Example

Let's do an API example first since it's easier than UI. We need to read a list of users from a relational database. 

> As a user,
> I need to see a list of users,
> so that I can better administrate my API". We'll use Node and Postegres.

### Step 1: Red

Our basic app that currently does nothing but blow up:

```javascript
const startServer = () => Promise.reject(new Error('startServer not implemented yet'))
const stopServer = () => Promise.reject(new Error('stopServer not implemented yet'))

module.exports = {
    startServer,
    stopServer
}
```

And our [Jest](https://jestjs.io/) unit tests that fail:

```javascript
const request = require('request')

const { startServer, stopServer } = require('../src/app')

afterEach(() => {
    return stopServer()
})

test('When I call the /users/list API, I should get a list of users', () => {
    return startServer()
    .then( () =>
        new Promise((success, failure) =>
            request.get('/users/list', (err, res, body) =>
                err
                ? failure(err)
                : success(body)
    )))
    .then(users => {
        expect(users.data[0].firstName).toBe('jesse')
    })
})
```

### Step 2: Green

After setting up Postgres with a users table and inserting some data, I then write all the Node code to make it pass:

```javascript
const express = require('express')
const app = express()
const { Pool } = require('pg')
const pool = new Pool()

app.get('/users/list', (req, res) => {
    return pool.query('SELECT username,date FROM users;')
    .then(result => result.rows)
    .then(users => {
        res.json({result: true, data: users})
    })
    .catch(err => {
        res.json({result: false, error: err.message})
    })
})

let server

const startServer = () => {
    return new Promise( resolve => {
        server = app.listen(3000, () => {
            resolve(server)
        })
    })
}
const stopServer = () =>
    pool.end()
    .then(() => {
        return new Promise((success, failure) => {
            server.close( err => {
                if(err) {
                    return failure(err)
                }
                success()
            })
        })
    })

module.exports = {
    startServer,
    stopServer
}
```

Running `npm test` works and if I run coverage it's at 90%. To confirm why, we can see from the coverage report that the route and the stopping of the server both have error handling code that our happy path feature doesn't cover.

### Step 3: Refactor

Now we clean up the code. Let's make the functions mostly pure and add some minor database validation. We'll leave the `let` for now as our only state.

```javascript
const express = require('express')
const { Pool } = require('pg')
const Result = require('folktale/result')
const { Ok } = Result
const Validation = require('folktale/validation')
const { Success, Failure } = Validation
const { get, partial, memoize, curry } = require('lodash/fp')

const getPool = () => new Pool()
const getPoolCached = memoize(getPool)

const validRows = o =>
    Array.isArray(o)
    ? Success(o)
    : Failure([`Invalid Rows: Postgres didn't return an Array of rows, instead returned: ${o}`])

const getUsers = pool =>
    pool.query('SELECT username,date FROM users;')
    .then(get('rows'))
    .then(validRows)
    .then(validation =>
        validation.matchWith({
           Failure: ({value}) => Result.Error(value),
           Success: ({value}) => Ok(value)
        }))
    .catch(error => Promise.resolve(
        Result.Error(`Postgres Error: ${get('message', error)}`)
    ))
const getUsersPartial = partial(getUsers, [getPoolCached()])

const sendError = res => error =>
    res.json({ result: false, error })

const sendOk = res => data =>
    res.json({ result: true, data })

const getUsersRoute = curry( (getUsersPartial, req, res) =>
    getUsersPartial()
    .then(result =>
        result.matchWith({
            Error: ({value}) => sendError(res)(value),
            Ok: ({value}) => sendOk(res)(value)
        })
    ))

const getUsersRoutePartial = getUsersRoute(getUsersPartial)

const addUsersListRoute = app => route =>
    Ok(
        app.get('/users/list', route)
    )

const listen = port => app =>
    Result.try(
        () => app.listen(port)
    )

let server
const startServer = getUsersRoutePartial => port => app =>
    addUsersListRoute(app)(getUsersRoutePartial)
    .chain(_ => listen(port)(app))
    .chain(newServer => {
        server = newServer
        return Result.Ok(server)
    })
    .matchWith({
        Error: ({value}) => Promise.reject(value),
        Ok: ({value}) => Promise.resolve(server)
    })
const startServerPartial = () => startServer(getUsersRoutePartial)(3000)(express())

const stopServer = pool =>
    pool.end()
    .then( _ => server.close())
const stopServerPartial = partial(stopServer, [getPoolCached()])

module.exports = {
    startServer: startServerPartial,
    stopServer: stopServerPartial
}
```

Coverage goes from 90% to 88% because we are not covering the 2 new error scenarios it introduced. Coverage is still helping, though, because it's pointing out areas we can do some more testing on later.

The point is, more pure code, easier to test specific parts if you need, API didn't change, and we didn't violate the rules by adding any new tests. Feature still works despite the fact we completely rewrote the internals to be more functional.

# Property Tests

Property tests are unit tests that generate random data. Even if you have greater than 100% unit test coverage, you can miss a certain scenarios:

```javascript
const stringNotBlank = o => o.length > ''

stringNotBlank('cow') // true
stringNotBlank('') // false
stringNotBlank() // TypeError: Cannot read property 'length' of undefined
```

To fix, you have to change it to:

```javascript
import { isString } from 'lodash'

const stringNotBlank = o => isString(o) && o.length > ''
```

Instead of trying to ensure you've covered every possible input type, you instead let the computer generate those for you. Also called fuzz tests, they are inspired by [Quickcheck](http://hackage.haskell.org/package/QuickCheck) from Haskell.


