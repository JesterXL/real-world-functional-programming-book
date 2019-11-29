# Partial Applications

Partial applications are functions with some of their arguments already given. You've already seen these types of functions in the [Curry](curry.md) section, they just didn't have a name until now.

They're useful for:
- you don't have a choice, this is what curried functions return, lol
- used in function composition and chaining
- being more explicit when you want to use default parameters, yet still support pure, curried functions
- helping in debugging
- reducing the number of arguments you need for a function
- using them as arguments to other functions to further reduce their argument count
- exposing functions to developers to use with all the concrete modules/classes already included

## Curried Functions Make Partial Applications

This is a manually curried function:

```javascript
const loadWebsite = request => url =>
    new Promise( ( success, failure ) =>
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
        )
    )
```

The function it returns is a partial application:

```javascript
const imAPartialApplication = loadWebsite(request)
```

From our logs, it appears that our `imAPartialApplication` is actually just a function that takes 1 argument:

```javascript
// url =>
//     new Promise( ( success, failure ) =>
//         request.get(url, (error, response, html) =>
//             error
//             ? failure(error)
//             : success(html)
//         )
//     )
```

But in actuality, it's the `loadURL` function below. While `console.log` will only show the `loadURL` portion, you and I know how closures work, and that `request` parameter value is up there, already defined, and waiting for `loadURL` to run and reference it.

```javascript
const loadWebsite = request => {
    const loadURL = url => new Promise( ( success, failure ) =>
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
        )
    )
    return loadURL
}
```
    
## Making Your Own Partial Applications

You can certainly make your own without using curried functions. The cliche say hello function:

```javascript
const sayHello = name => {
    const yo = () => `Sup ${name}!`
    return yo
}
const heyJesse = sayHello('Jesse')
heyJesse() // Sup Jesse!
```

You can use it build more dynamic ones, in the case of detecting if a browser supports the native `fetch` or not:

```javascript
import * as polyfill from 'cross-fetch'

const loadJSON = (fetch, url) =>
    fetch(url)
    .then(response => response.json())

const loadJSONWithFetch = url => {
    if(browserSupportsFetch() {
        return url => loadJSON(fetch, url)
    }
    return url => {
        console.warn("Dude, use a newer browser... please, beg your IT Admin. Your boss. Anyone.")
        return loadJSON(polyfill, url)
    }
}
```

The `loadJSONWithFetch` will return a partial application. If a browser supports the native `fetch`, it'll return a `loadJSON` function that uses the native `fetch` and is waiting for you supply the URL. Otherwise, it returns one that uses the polyfill and logs a warning to the console output. Users won't see this, but it's therapeutic.

# Creating Partial Applications Using partial

Lodash and Ramda also have ways of creating these in a pure way. If we have the `loadWebsite` non-curried function:

```javascript
const loadWebsite = (request, url) =>
    new Promise( ( success, failure ) =>
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
        )
    )
```

While it's pure and allows us to easily unit test it by stubbing `request`, we want to expose it as a public function in our API with `request` baked in. That way, users can just go `loadWebsite('my url')` vs. having to import `request`.

If it were curried, we could just do this:

```javascript
// Node's CommonJS
module.exports = {
    loadWebsite: loadWebsite(request)
}

// ES6
export const loadWebsiteWithRequest = loadWebsite(request)
```

Instead rewriting the function to be manually curried, or using of the various `curry` functions Lodash, Ramda, and other libraries have, we can instead just create a partial directly using the `partial` function from Lodash.

```javascript
// Node's CommonJS
const { partial } = require('lodash')

module.exports = {
    loadWebsite: partial(loadWebsite, [request])
}

// ES6
import { partial } from 'lodash'

export const loadWebsiteWithRequest = partial(loadWebsite, [request])
```

If you were to write that manually, without currying or partial applications, while impure, it'd be:

```javascript
// Node's CommonJS
module.exports = {
    loadWebsite: url => loadWebsite(request, url)
}

// ES6
export const loadWebsiteWithRequest = url => loadWebsite(request, url)
```

This is being polite to the developers using our code.

If we just did:

```javascript
module.exports = { loadWebsite }
```

Then the developer would have to first import the `request` module to make our module work:

```javascript
const { loadWebsite } = require('./loaders')
const request = require('request')

loadWebsite(request, 'http://jessewarden.com')
```

Lame! Since we've exposed partial applications, they have to do less work, yet we've ensured we're still creating pure functions for unit testing and for others to use:

```javascript
const { loadWebsite } = require('./loaders')

loadWebsite('http://jessewarden.com')
```

You'll often expose both functions, usually only for testing purposes:

```javascript
module.exports = {
    loadWebsite,
    loadWebsiteWithRequest: partial(loadWebsite, [request])
}

// ES6
export const loadWebsite = ...
export const loadWebsiteWithRequest = partial(loadWebsite, [request])
```

## Partial Application With No Arguments

While `partial` is a pure way to create partial applications without using currying, it can also create partial applications that take no arguments, something you can't do with currying. You can use this technique for integration testing using the unit test runner [Mocha](https://mochajs.org/). Assuming you have 2 REST API's for `/ping` and `/get/users` running on localhost:

```javascript
const ping = partial(loadWebsite, [request, 'http://localhost:3000/ping'])
const getUsers = partial(loadWebsite, [request, 'http://localhost:3000/get/users'])

beforeEach(() => {
    // if ping responds, we can start running integration tests,
    // otherwise, if the server isn't up, no point in running the tests.
    return ping()
})
it('when /get/users is called, it should get a list of users', () => {
    return getUsers()
    .then(users => {
        expect(users[0].firstName).to.not.be.empty
    })
})
```

## Fixing Argument Order with partialRight

We saw in the [Parameter Order](parameter_order.md) section that the curried function had the arguments in a non-useful order. We used a function closure to create our own partial application:

```javascript
const loadJSON = url => fetch =>
    fetch(url)
    .then(response => response.json())

const loadJSONWithFetch = url => loadJSON(url)(fetch)
```

We baked in `fetch` above, all you need to supply is the `url`. While we wanted `loadJSON` to have `fetch` first, instead of changing the function, we just fix it with `loadJSONWithFetch` fixing the order of the arguments by abstracting that away from us.

However, `loadJSONWithFetch` isn't pure because the `fetch` isn't declared in the arguments. We can't make it pure using `partial` because she starts putting in arguments from the left:

```javascript
const loadJSONWithFetch = partial(loadJSON, [... er, what do I put here, fetch])
```

Thankfully, there is something called `partialRight`, which instead of preloading arguments from left to right... it'll instead start from right to left.

```javascript
const { partialRight } = require('lodash')

const loadJSONWithFetch = partialRight(loadJSON, [fetch])
```

The closure version of that would look like:

```javascript
const loadJSONWithFetch = url => loadJSON(url, fetch)
```

Now you can call it with the `url` at your leisure:

```javascript
loadJSONWithFetch('http://jessewarden.com')
.then(console.log)
.catch(console.log)
```

The `partialRight` is pure unlike the closure which is not, and can support functions that are written with static things that are on the right (latter/last in the argument list) instead of left (first or early in the parameter list).

If it's 3rd party code, or you're on a deadline, `partialRight` can be a lifesaver. If it's your code, fix the parameter order instead of using this function.