# Spot The Impurities

We're going to show a series of functions that are pure and impure. You'll see the various ways they break the pure function rules, and how to fix them. The strength of dynamic languages is that they have a wide variety of developers from different backgrounds such as Imperative, Object Oriented, and Declarative (Functional Programming).

Declarative is in the minority.

As such, you'll be navigating a lot of impure code and will have to decide what to make pure and what not too based on your experience, deadlines, and team norms. Knowing the nuanced ways one can break function purity will help you navigate non-pure code. You'll also start to develop a [Spidey Sense](https://sixthsensereader.org/about-the-book/abcderium-index/spidey-sense/) about the signs of impurity, both in the code you read and in the code you write. As you develop this 6th sense, it'll help you on your journey to function purity and in code reviews of peers.

## Prior Art

But first, let's look at the various pure and impure functions built into JavaScript itself.

```javascript
Math.round(1.034) // 1
Math.round(1.034) // 1
Math.round(1.034) // 1
```

Same input, same output. There is no side effects, either; you're just operating on the `Number` you passed in. Since the `Number` you passed is pass "by val", it'll create a clone, so the output is a completely different `Number` then the one you passed in.

However, even `Math` can be impure:

```javascript
Math.random() // 0.9746597969597086
Math.random() // 0.58324610344788
Math.random() // 0.8089727088931593
```

Same input, different output. Now cryptologists, those who work in software security, will tell you that technically `Math.random()` isn't random and thus deterministic. While true, the function still breaks function purity rules.

Arrays, which are passed "by ref", different variable pointing to the same data, also have their share of pure and impure functions.

If we want to combine 2 Arrays together we can use `concat`:

```javascript
const parents = [ 'Jesse', 'Brandy' ]
const kids = [ 'Sydney', 'Rowan' ]
const family = parents.concat(kids)
console.log(family) // [ 'Jesse', 'Brandy', 'Sydney', 'Rowan' ]
console.log(parents) // [ 'Jesse', 'Brandy' ]
console.log(kids) // [ 'Sydney', 'Rowan' ]
```

The `concat` obeys same input, same output, and no side effects.

However, `reverse` doesn't create a new Array, and instead mutates the original.

```javascript
console.log(parents) // [ 'Jesse', 'Brandy' ]
const reversed = parents.reverse()
console.log(reversed) // [ 'Brandy', 'Jesse' ]
console.log(parents) // [ 'Brandy', 'Jesse' ]
```

The `reverse` function obeys same input, same output, but it has side effects. The world changes after it runs because it doesn't utilize immutability.

Libraries like [Ramda](https://ramdajs.com/docs/#reverse) are built using pure functions. This makes it so you can use the same method names like Array's `reverse`, but not worry about side effects as all return values are immutable.

## Closures

Closures, whether Node or Browser, are a common way to utilize imported modules and classes.

```javascript
import request from 'request-promise'

const getUsers = () => {
    return request.get('/api/users/all', {json: true})
}
```

This breaks the pure function rules in 2 ways: it's affected by the outside world, and it has side effects after it runs, whether the less pure CommonJS `require` or the more pure ES6 `import`. The `getUsers` won't always return the same output because the `request` doesn't come in from the function arguments. You'll also end up having to mutate your code using mocking/stubbing libraries like [Sinon](https://sinonjs.org/) or [TestDouble](https://github.com/testdouble/testdouble.js/) to test it. The side effects is from the `request.get` making an HTTP call.

**Partial Solution**: Declare your dependencies in your arguments.

You make it pure by passing in the `request` module.

```javascript
import request from 'request-promise'

const getUsers = request => {
    return request.get('/api/users/all', {json: true})
}
```

While you could turn your internet off, and the Promise that the `request` returns fails, the `getUsers` function is still returning a Promise every time from the same module. To unit test it, all you need is a simple stub:

```javascript
const requestStub = { get: (url, options) => Promise.resolve(['user'])}
it('should return a Promise', ()=> {
    const result = getUsers(requestStub)
    const isAPromise = isPromise(result)
    expect(isAPromise).to.equal(true)
})
// using chai-as-promised
it('should resolve with a good stub', ()=> {
    return expect(getUsers(requestStub)).to.be.fulfilled
})
it('should resolve with a user', ()=> {
    return expect(getUsers(requestStub)).to.become(['user'])
})
```

## HTTP Call Fix?

Fixing the HTTP call that is made, affecting the outside world after the function runs, is beyond the scope of this book. That level of purity is only gained through creating your own class/Object to contain those side effects, like [Elm](http://elm-lang.org/) does, or using strict state containers like [Redux](https://redux.js.org/), [Calmm](https://github.com/calmm-js/documentation/blob/master/introduction-to-calmm.md), or even more advanced methods such as [React Hooks](https://reactjs.org/docs/hooks-intro.html). Many think it isn't worth it given it's such a common thing to do in browser applications and Node API's. 

In JavaScript, the simple solution is to return a `Promise`. It'll resolve when the operation is successful or not through `.then` and `.catch`. As long as the function you send to the `Promise` is a pure function, you're good "enough".

## Random Noops

When you see functions that don't return values, you'll start to immediately identify them as noops. As long as they're logging related, you can often let them go. However, other times, they'll be in amongst other functions, not classes, and your hair should stand on end:

```javascript
const getUsers = pg =>
    new Promise((success, failure) => {
        const pool = getPool(pg)
        connect(pg)
        pool.query('users', (err, result) => {
            if(err) {
                return failure(err)
            }
            success(result.data)
        }
    })
```

The `getUsers` returns a Promise. She takes in the `pg` variable, probably a Postegres database module and thus declares her outside dependencies. The Promise wraps a callback, a side effect style way of coding, and using a Promise wrapper is a common way to make the function more pure. If it errors, it errors the Promise; if it succeeds, if gives the data parsed from the database query.

... but what is `connect` doing? It has no return value. It does not appear like logging, and instead looks like it's attempting to connect to the Postegres database? What if it fails? What else is it doing? While we're inside a `Promise`, and thus have built-in try/catch functionality, this is actually worse in that it can hide it's side effect, and we wouldn't know until we inspect the `promise.catch` to read the error and figure out somewhere internally it's failing to connect.

While not the best way to handle errors, the more pure way would be too have `connect` at a bare minimum return a `Promise`; it'll either connect, or it won't with an `Error` saying why. We can then connect that to our existing `Promise`, and only run the database query once it is successfully connected:

```javascript
const getUsers = pg =>
    connect(pg)
    .then( () =>
        return new Promise((success, failure) => {
            const pool = getPool(pg)
            pool.query('users', (err, result) => {
                if(err) {
                    return failure(err)
                }
                success(result.data)
            })
        })
    )
```

Be on the lookout for functions that have no return value and aren't logging related.

## Node Middlewares

Node was created and used long before `Promises` became du-jour in JavaScript. There are still many callback holdouts who swear by their [async library](https://github.com/caolan/async). This means most of the popular API and site frameworks such as [Express](https://expressjs.com/) and [Restify](http://restify.com/) all follow the Node middleware ways of architecting and building plugins. Middlewares hide massive side effects and are not pure.

A basic API to get a list of suers in Express looks like:

```javascript
app.get('/users/list', (req, res) =>
    getUsers()
    .then( users =>
        res.send(200).json({ result: true, data: users })
    )
    .catch( error =>
        res.send(500).join({ result: false, error: error.message })
    )
)
```

However, that `http://localhost:9000/users/list` REST url would work without any authentication, so they'll have an authentication run first. The `app.get`'s function signature is "First parameter is a String name of the route, every other parameter is a function you want to run".

```javascript
app.get(
    '/users/list', // route name
    (req, res) => ... // function to run when route is hit on server
)
```

It'll run them in order, so typically you'll see authentication plugins like OAuth ask you to put the authentication function first:

```javascript
app.get(
    '/users/list',
    (req, res, next) => ..., // auth stuff here
    (req, res) => ...
)
```

Notice the 3rd parameter called `next`. It's a function, specifically a callback function. When your function is done, it has 3 choices:

1. call `res.send`, preventing all further functions from being run.
2. call `next()` with no parameters signalling your function or "middleware" is done and has run successfully, and the next middleware can run.
3. call `next(error)` with an `Error` as the first and only parameter, signalling that your middleware failed and no further middlewares should be run.

What happens after depends on the framework and middleware, but typically you'd also send a message to the user.

```javascript
app.get(
    '/users/list',
    (req, res, next) => {
        if(isAuthorizedUser(req.params.user)) {
            next()
        } else {
            next(new Error('Not authorized'))
        }
    }
    (req, res) => ...
)
```

This mis-mash of patterns is what you'd to do compose asynchronous functions together in web/API frameworks before `Promise` chains became popular. The downside is there are a lot of side effects in this approach without any way for you to prevent them causing errors, nor easily unit test them without intentionally mocking side effects.

The best way is just not use the middleware pattern at all, instead using Promises:

```javascript
app.get(
    '/users/list',
    (req, res) =>
        isAuthorized(req.params.user)
        .then(getUsers)
        .then( users =>
            res.send(200).json({ result: true, data: users })
        )
        .catch( error =>
            res.send(500).join({ result: false, error: error.message })
        )
)
```