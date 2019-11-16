# Total Functions

A total function is a pure function that works with all inputs. They often depend on how the language and operators, like `+` work. If you create a function that adds numbers, it'll work with a `Number`, `String`, `Function`, some random `class`, anything! Typically they are a lot easier to make in strongly typed languages because the compiler will ensure your function that adds 2 `Number`s never gets a String input, or ensures you use `+` instead of `++` by accident.

In dynamic languages, you have to do a lot more work to validate your inputs and take a whitelist approach to types. Considering that JavaScript, Python, and Lua are communities built largely upon libraries, you can't guarantee that someone will be accepting of different kinds of inputs, and if you accidentally send the wrong one, they'll tell you that vs. some bonkers stack trace.

## Functions That Never Fail

Pure functions and immutability are great to produce code that is more predictable. However, without a compiler and/or runtime verification, you can still have them throw an exception, or just be "wrong" (what the math people call "incorrect"). Total functions can help you get your code immune to runtime exceptions as possible without the need of a compiler. They can even help a bit on the "correctness" of your code.

## How Can a Pure Function Still Throw?

If we're building some functions to validate what the user types in a text input, we need to ensure they didn't leave it blank, so we'll count the length of a `String` using a pure function: 

```javascript
const notBlank = str =>
    str.length > 0
```

If the user types "cow", it'll return `true`:

```javascript
notBlank('cow') // true
```

If the user types nothing, it'll return `false`:

```javascript
notBlank('') // false
```

... but what happens if we don't have an initialized value, or we use this function where she could accidentally get something other than a `String`?

```javascript
notBlank() // TypeError: Cannot read property 'length' of undefined
```

We should instead check for the `String` data type using Lodash' [isString](https://lodash.com/docs/4.17.11#isString) predicate:

```javascript
const notBlank = str =>
    isString(str)
    && str.length > 0
```

Now, the function is more total; it can accept just about any input now and still work:

```javascript
notBlank() // false
notBlank(new Date()) // false
```

## How Can a Pure Function Be Incorrect?

Let's validate a USA phone/mobile number:

```javascript
const parsePhoneNumber = str =>
    (isString(str) || (isNumber(str) && isNaN(str) === false))
    && String(str).length === 10
```

Then try it out with a valid phone number:

```javascript
parsePhoneNumber('1235559876') // true
parsePhoneNumber('555') // false
parsePhoneNumber(1235559876) // true
parsePhoneNumber(555)
```

... but what if the phone number is valid:

```javascript
parsePhoneNumber('(123) 555-9876') // false
```

While the function is pure and somewhat total... the return value is still incorrect; that's a valid phone number.

Total functions will help a lot with the types, and a bit with the correctness. These benefits compound (get more powerful) when you start composing/combining them together into larger functions. They come with the cost of additional maintenance, and unit/property tests, and additional hard work.

## Problem: Adding Random Things

Dynamic languages pass random things everywhere. We attempt to not pass random things when we write code and unit tests, but the dynamism is a double edged sword: power of flexibility, yet bad things happen when you get what you weren't expecting.

For example, here's our original pure function from [Chapter 1: Pure Functions](../part1/input_output_side_effects.md)

```javascript
const add = (a, b) => a + b

add(1, 2) // 3
```

It follows all pure function rules of same input, same output, and no side effects.

However, what happens if we add things that aren't numbers?

```javascript
add(new Error('how now brown cow'), { get: 'busy child' })
// 'Error: how now brown cow[object Object]'
```

Um, ok... that isn't really helpful. Probably not what the developer wanted, nor expected. Worse, once you start composing this with other functions in `flow`/`compose` or `Promise`, the chain can get corrupted. You may get parsing results or errors that don't make immediate sense with little hint as to where the problem originated. This is when you start longing for stack traces again when debugging functional code, or even... 😰 strong types!

## Solution: Solving With Types

One way to solve this is to use types. With just a little metadata added by you the developer, compilers can read and understand your code, and find your errors in nanoseconds. They can even offer fixes, or sometimes automatically fix. [TypeScript](https://www.typescriptlang.org/), an open source language & compiler started by Microsoft and open source, is one such language.

Rewriting our function in TypeScript, we explicitly say "Yo, this function takes 2 numbers, and returns a number." This is enough for the TypeScript compiler, `tsc` to verify your inputs.

```typescript
const add = ( a: number, b: number) : number => a + b
```

Before we can even run the code in TypeScript, we have to compile it to JavaScript. However, instantly, TypeScript shows us an error with our 2nd add:

> Argument of type 'Error' is not assignable to parameter of type 'number'.`

In English, that's:

> "The `add` function only takes a `Number` for the first argument, but you are passing an `Error`. You're not allowed to do that. Change the first parameter to a `Number`."

As your functions grow in number, size, and you start composing them, it can be really hard to keep track of all the types going around, and ensuring that you're always getting the correct type. If another developer is using your code, will they get a meaningful error if your function chokes on a weird type it wasn't expecting? These kinds of problems types can help like TypeScript, [Flow](https://flow.org/), [Elm](http://elm-lang.org/), and [PureScript](http://www.purescript.org/).

The downside here is libraries. Just because you're using a transpilation/compilation solution doesn't mean your consumers are. While you can use TypeScript and publish a library to `npm` doesn't mean those who install it will be using TypeScript. They could just be using raw JavaScript, or Webpack with just ES6. Also, not all data parsing libraries are strict like [AVRO](https://avro.apache.org/docs/current/)/[Protobuf](https://developers.google.com/protocol-buffers/) to ensure the types they parse are "guaranteed a `Number` once you get it to use for your add function" at runtime. That said, even a little can help, it just won't make your functions total for everyone.

## Solution: Solving With Manual, Native Runtime Validation

Another solution is to do your own runtime type evaluation. If you implement a whitelist, then you only ensure the types you're expecting get through, otherwise you tell the caller of the function it failed, and you give them as much detail about what they passed in so they can have an easier time debugging. We started this with our `isString` usage in the first example for `notBlank`.

Without using any libraries and just raw JavaScript, we'll return our own result following the multiple return value model that Go, Lua, and Python follow (see [Part 1: Error Quest](part1/error_quest.md)):

```javascript
const isNumber = o => typeof o === 'number'
const addNumbers = (a, b) =>
    ( isNumber(a) && isNumber(b) )
    ? {ok: true, data: a + b}
    : {ok: false, error: new Error(`Either a or b aren't Numbers. a: ${a}, b: ${b}`)}
```

There are some edge cases with our `isNumber`; `1` and `Number(1)` will be `true`, but `new Number(1)` will be false, but it's "mostly" total just like some functions are "mostly" pure.

Now calling it:

```javascript
console.log(add(1, 2))
// { ok: true, data: 3 }

console.log(add(new Error('how now brown cow'), { get: 'busy child' }))
// { ok: false,
//   error: Error: Either a or b aren't Numbers. a: Error: how now brown cow, b: [object Object]
// ...
```

Now the function is mostly total. It'll literally accept ANYTHING and let you know if `add` worked or not. Where pure functions are dependable to build applications on, total functions are a level above that and nigh unbreakable.

## Solution: Solving With Manual, Folktale Runtime Validation

The challenge with the above is that `isNumber`, while a predicate, isn't very composable when you have a bunch of arguments that are different kinds. Also, some types have multiple rules above them such as product or Union types and so you'll run multiple predicates against them.

Folktale `Validation`s work great here. Let's take our load website pure function:

```javascript
const loadWebsite = (request, url) =>
    new Promise((success, failure) =>
        request.get(url, (err, res, body) =>
            err
            ? failure(err)
            : success({res, body})
        )
    )
```

... and make it total using Folktale `Validation`s. We'll first need a bunch of predicates to ensure our `request` and `url` are acceptable types.

### Request Shape

Let's ensure our `request` "looks the right shape"; has the expected methods and properties we'd want `request` to have. If it has those, it's probably a `request` and the developer/us didn't screw up. We'll rely heavily on Lodash' base predicates. Given `request` uses Object Oriented Programming, we'll use `hasIn` to be safe when looking for properties as opposed to `has`:

```javascript
const { get, hasIn, isFunction } = require('lodash')

const hasGetFunction = o => isFunction(get(o, 'get'))
const hasPostFunction = o => isFunction(get(o, 'post'))
const hasInitParams = o => hasIn(o, 'initParams')
```

### URL Shape

For our `url`, we'll ensure she's a `String`, and looks like a URL:

```javascript
const { ..., isString, some } = require('lodash')

const legitString = o => isString(o) && o.length > 0
const hasHTTP = o => isString(o) && o.toLowerCase().indexOf('http') > -1
const hasHTTPS = o => isString(o) && o.toLowerCase().indexOf('https') > -1
const hasLocalhost = o => isString(o) && o.toLowerCase().indexOf('localhost') > -1
const hasDots = o => isString(o) && o.indexOf('.') > -1

const legitURL = o =>
    legitString(o)
    && some(
        [
            hasHTTP,
            hasHTTPS,
            hasLocalhost,
            hasDots
        ],
        predicate => predicate(o)
    )
```

A quick test of the URL one:

```javascript
console.log(legitURL('http://jessewarden.com')) // true
console.log(legitURL('https://google.com')) // true
console.log(legitURL('localhost:8080')) // true
console.log(legitURL('192.168.0.1')) // true
console.log(legitURL('chicken pot pie')) // false
```

### Request Validations

Now we'll create some `Validation`s that use those predicates for request:

```javascript
const Validation = require('folktale/validation')
const { Success, Failure } = Validation

const validRequestGet = o =>
    hasGetFunction(o)
    ? Success(o)
    : Failure([`Your request doesn't have a get function, you sent: ${o}`])

const validRequestPost = o =>
    hasPostFunction(o)
    ? Success(o)
    : Failure([`Your request doesn't have a post function, you sent: ${o}`])

const validRequestInitParams = o =>
    hasInitParams(o)
    ? Success(o)
    : Failure([`Your request doesn't have an initParams function, you sent: ${o}`])

const validRequest = o =>
    validRequestGet(o)
    .concat(validRequestPost(o))
    .concat(validRequestInitParams(o))
```

### URL Validations

Now the `url`:

```javascript
const validURL = o =>
    legitURL(o)
    ? Success(o)
    : Failure([`The URL doesn't appear to be a valid url containing http, https, localhost, or dots for an IP Address. You sent: ${o}`])
```

### Combining it All Together

Combining those together to make our function total:

```javascript
const loadWebsite = (request, url) =>
    new Promise((success, failure) =>
        validRequest(request)
        .concat(validURL(url))
        .matchWith({
            Failure: ({ value }) => failure(new Error(value.join(', '))),
            Success: _ =>
                request.get(url, (err, res, body) =>
                    err
                    ? failure(err)
                    : success({res, body})
                )
        })
    )
```

When we call it with good parameters, we get our expected result:

```javascript
loadWebsite(require('request'), 'http://jessewarden.com')
.then( ({ body }) => console.log(body.substring(0, 21)))
.catch(error => console.log("error:", error))
// html: <!DOCTYPE html>
// <html
```

If we mess up the `url`, however:

```javascript
loadWebsite(require('request'), '🐮')
...
// error: Error: The URL doesn't appear to be a valid url containing http, https, localhost, or dots for an IP Address. You sent: 🐮
// ...
```

Same for giving a bogus `request`:

```javascript
const r = require('request').get
loadWebsite(r, 'http://jessewarden.com')
...
// error: Error: Your request doesn't have a get function, you sent: function (uri, options, callback) {
//     var params = initParams(uri, options, callback)
//     params.method = method
//     return request(params, params.callback)
//   }, Your request doesn't have a post function, you sent: function (uri, options, callback) {
//     var params = initParams(uri, options, callback)
//     params.method = method
//     return request(params, params.callback)
//   }, Your request doesn't have an initParams function, you sent: function (uri, options, callback) {
//     var params = initParams(uri, options, callback)
//     params.method = method
//     return request(params, params.callback)
//   }
//   ...
```

You can see you can now pass whatever you want, and only the good gets through. Instead of relying on 3rd party code and libraries that don't have the best error handling, you only use those errors if bad data somehow makes it passed your total function validations. Anything you can do using `Validation`s to ensure yourself or another developer doesn't have to think when reading an error message is super helpful and time saving. That, and you can avoid strange errors that can occur when third party libraries/code aren't as good as you are in handling various types.

The final code is:

```javascript

const {isString, some, get, hasIn, isFunction } = require('lodash')
const Validation = require('folktale/validation')
const { Success, Failure } = Validation

// -- Predicates ---------------------

const hasGetFunction = o => isFunction(get(o, 'get'))
const hasPostFunction = o => isFunction(get(o, 'post'))
const hasInitParams = o => hasIn(o, 'initParams')

const legitString = o => isString(o) && o.length > 0
const hasHTTP = o => isString(o) && o.toLowerCase().indexOf('http') > -1
const hasHTTPS = o => isString(o) && o.toLowerCase().indexOf('https') > -1
const hasLocalhost = o => isString(o) && o.toLowerCase().indexOf('localhost') > -1
const hasDots = o => isString(o) && o.indexOf('.') > -1

const legitURL = o =>
    legitString(o)
    && some(
        [
            hasHTTP,
            hasHTTPS,
            hasLocalhost,
            hasDots
        ],
        predicate => predicate(o)
    )

// -- Validations ---------------------

const validRequestGet = o =>
    hasGetFunction(o)
    ? Success(o)
    : Failure([`Your request doesn't have a get function, you sent: ${o}`])

const validRequestPost = o =>
    hasPostFunction(o)
    ? Success(o)
    : Failure([`Your request doesn't have a post function, you sent: ${o}`])

const validRequestInitParams = o =>
    hasInitParams(o)
    ? Success(o)
    : Failure([`Your request doesn't have an initParams function, you sent: ${o}`])

const validRequest = o =>
    validRequestGet(o)
    .concat(validRequestPost(o))
    .concat(validRequestInitParams(o))

const validURL = o =>
    legitURL(o)
    ? Success(o)
    : Failure([`The URL doesn't appear to be a valid url containing http, https, localhost, or dots for an IP Address. You sent: ${o}`])


const loadWebsite = (request, url) =>
    new Promise((success, failure) =>
        validRequest(request)
        .concat(validURL(url))
        .matchWith({
            Failure: ({ value }) => failure(new Error(value.join(', '))),
            Success: _ =>
                request.get(url, (err, res, body) =>
                    err
                    ? failure(err)
                    : success({res, body})
                )
        })
    )
```

### Unit Test Side Note

Note now that we're checking for all 3 methods on `request`, this may fail unit tests that stub only request with a get function, i.e.:

```javascript
// this will fail since stub won't pass validation
it('request.get should work', () => {
    const requestStub = {
        get: (url, callback) => callback(undefined, {}, 'yay')
    }
    expect(loadWebsite(requestStub, 'http://jessewarden.com')).to.eventually.be.fulfilled;
})
```

## Conclusions

Total functions are pure functions that accept all inputs. The pro's are enhanced error handling if done manually, less unknown errors from other code, and overall more dependable functions. The error messages, especially from API response errors, are really helpful for consumers of your code.

The con's are they can require more unit tests to ensure you've handled the edge cases. This is before you even start writing property tests via [jsverify](https://github.com/jsverify/jsverify). Like unit test stubs, they will expect a certain implementation shape, and so your stubs have to be more thorough to match the implementation. i.e. "A `get` is good enough, right? Wait... we're not even testing `post`, why do I need to implement a blank function for it on the stub?"

Also, developers who are not using types don't like how verbose they are to debug and modify. We've take a 1 line pure function and turned it into 70 lines and 14 additional functions just to make it reasonably total. While you could just unit test the `add` function itself, you'll end up writing unit tests for the others anyway to ensure you've written your predicates correctly, which in turn leads to a lot of more unit tests. Over time, these tests may not be maintained since it's hard for future developers to understand why the private functions of your module are being so thoroughly tested vs. just the public implementation.
