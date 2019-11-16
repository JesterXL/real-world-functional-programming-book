# Different Styles of Curry

We've shown you how to manually create curried functions. However, many dynamic languages, especially JavaScript, use a lot of libraries and most aren't written in a functional way. Just like you can use [promisify in Node](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) to convert a callback function to a `Promise` based one, Lodash, Ramda, Folktale, and Sanctuary have a `curry` function to convert non-curried functions to curried ones.

These help in:
- help beginners ease into curried functions
- using 3rd party code you don't own
- code you've already written and want to quickly convert
- expose public functions that doesn't force curried function calling style onto those using the API who may not be FP developers

## Lodash' & Ramda's curry

Instead of converting our `loadWebsite` function to be manually curried, we can instead use Lodash's [curry](https://lodash.com/docs/4.17.10#curry) function:

```javascript
const { curry } = require('lodash')

const loadWebsite = (request, url) =>
    new Promise( ( success, failure ) =>
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
        )
    )

const loadWebsiteCurried = curry(loadWebsite)
```

Now, we can make a partial application:

```javascript
const loadWebsiteWithRequest = loadWebsiteCurried(request)
```

Or just call the function:

```javascript
loadWebsiteCurried(request)('http://jessewarden.com')
```

What's cool, though, is it's a lot more flexible and nicer to beginners. You can also call it like a regular function:

```javascript
loadWebsiteCurried(request, 'http://jessewarden.com')
```

Doesn't even look curried, but can act like it if you need to.

## Curry Arity & Style with Lodash, Ramda, Folktale, and Sanctuary

Lodash, Ramda, Folktale, and Sanctuary differ in how they report function arity. Arity means how many arguments a function takes. You can learn more in the [Arity](arity.md) section. Some frameworks such as [Express](https://expressjs.com/) care about a function's arity. 

Let's compare these non-default argument, non-variadic functions:

```javascript
const alwaysTrue = () => true
alwaysTrue.length // 0

const loadWebsite = (request, url) => {
    console.log("Load stuff.")
}
loadWebsite.length // 2
```

### Lodash

Lodash will report an arity of `0` always. It supports function calling in curried style `(a)(b)`, imperative style `(a, b)`, and mixed `(a, b)(c)`:

```javascript
const { curry } = require('lodash')

curry(alwaysTrue).length // 0
curry(loadWebsite).length // 0
```

### Ramda

Ramda will report the length of the original function which is helpful if you intend to use this function in frameworks who care about function arity or you're not sure how many parameters a function requires. Sometimes you'll call a function and you'll be confused why you're getting a function back instead a `Promise` or some other expected value, so checking the function length can help, at least with Ramda. It supports function calling in curried style `(a)(b)`, imperative style `(a, b)`, and mixed `(a, b)(c)`:

```javascript
const { curry } = require('ramda')

curry(alwaysTrue).length // 0
curry(loadWebsite).length // 2
```

### Folktale

Folktale requires you to define the function arity ahead of time, but like Lodash reports `0` no matter what you put. Like Lodash and Ramda, it supports function calling in curried style `(a)(b)`, imperative style `(a, b)`, and mixed `(a, b)(c)`:

```javascript
const curry = require('folktale/core/lambda/curry')

curry(0, alwaysTrue).length // 0
curry(2, loadWebsite).length // 0
```

### Sanctuary

Sanctuary cares about types, and as such, doesn't support taking in variadic functions to convert to curried functions. Instead, you have to choose the arity ahead of time using one of their functions. They support `curry2`, `curry3`, `curry4`, and `curry5`. Unlike the others, it technically reports the correct number of `1`, despite the number in `curry2` or the others being bigger than `1`. It only supports a curry style `(a)(b)` of calling functions.

```javascript
const { curry2 } = require('sanctuary')

curry2(alwaysTrue).length // 1
curry2(loadWebsite).length // 1
```

## Conclusions

If you're just starting out, use Lodash or Ramda. [Ramda's curry](https://ramdajs.com/docs/#curry) is safer for use in cases where function arity needs to be correct. Manual currying is great, and you should practice to make it feel more natural. However, using `curry` is great for 3rd party code, your own code that isn't curried, and exposing functions to users who don't know what currying is and expect functions to work "like the normally do".
