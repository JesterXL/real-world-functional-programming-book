# Promise

Given each of these operations is done one after the other, you can use Promises. If you know how Promises work, feel free to skip to [Promise Composition](#Promise Composition) below. Below is a quick recap on returning values in Promises vs. `Promise.resolve` and making them with less code.

## Promise Return Value Recap

Promises have the nice feature in their `then` statement, you can return a value, not just a `Promise`. Normally you’ll see people return a Promise:

```javascript
const twoThings = () =>
    Promise.resolve(1)
    .then(result => Promise.resolve(result + 1))
```

To try it out:
```javascript
twoThings()
.then(result => log("result:", result) // 2
```

However, once you’re in a Promise chain, as long as it’s not an `Error`, you can return whatever you want and it’ll resolve into the next `then`. Rewriting the same function above using that would be:

```javascript
const twoThingsv2 = () =>
    Promise.resolve(1)
    .then(result => result + 1)
```

To try v2 out:

```javascript
twoThings()
.then(result => log("result:", result) // 2
```

Or just defining the intermediate function separately. Here's a simple function to add 1:

```javascript
const add1 = result =>
    result + 1
```

We can then just put it in the `then` and it'll get called with whatever the value is from the previous Promise:

```javascript
const twoThings = () =>
    Promise.resolve(1)
    .then(add1)
```

## Promise Composition

Using a `Promise`, we can take our nested function:

```javascript
const parse1 = str =>
    startCaseNames(formatNames(filterHumans(parsePeople(str))))
```

And convert it to a more readable Promise version, even though it’s synchronous code:

```javascript
const parse3 = str =>
    Promise.resolve(str)
        .then(parsePeople)
        .then(filterHumans)
        .then(formatNames)
        .then(startCaseNames)
```
The downside is it still has to be called like a normal asynchronous `Promise`:

```javascript
parse3(peopleString)
.then(log) // ["Jesse Warden", "Brandy Fortune"]
```

However, it does have the advantage of being a bit easier to read, easier to follow in terms of what is happening when and in what order. Additionally, Promises have built-in try/catch so the error handling is in one place. For functions that have `Error`'s like `parsePeople` which could get a bad input, it composes nicely into Promises.

## Debugging

Finally, because of the chaining, like the Composition example, you can quickly comment out a section of the chain to debug what’s going up to a certain point:

```javascript
const parse3 = str =>
    Promise.resolve(str)
        .then(parsePeople)
        .then(filterHumans)
        //.then(formatNames)
        //.then(startCaseNames)
```

You can also do a `tap` function like we did in Composition to determine how things are progressing up to a certain point as well. For now, we’ll use a modified log function to take a value, log it out, then return whatever you were passed:

```javascript
const tap = (...args) => {
    log(args)
    return Promise.resolve.apply(Promise, args)
}
```

Notice below, we can use tap to log things out, or use log manually if we want more detail:

```javascript
const parse3 = str =>
    Promise.resolve(str)
        .then(tap)
        .then(parsePeople)
        .then(tap)
        .then(filterHumans)
        .then(humans => log("humans:", humans) || humans)
        .then(formatNames)
        .then(tap)
        .then(startCaseNames)
        .then(final => log("final is:", final))
```
