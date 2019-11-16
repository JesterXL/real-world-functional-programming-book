# Closures And Immutability

A closure is an function that encloses something. Every time a function is created, it creates a closure, and each has rules about what scope it can and cannot access. We're covering it here because it can help in immutability, violate it, and is the way in which we create curried functions.

## Basic Closure

The function below returns a function. That function uses the closure it was defined in to access `message` so it can log it out. It's private, no one else can modify that message variable, or affect the behavior of the returned function.

```javascript
const getHelloFunction = () => {
    const message = "hey"
    return () => console.log(message)
}
```

To use it:

```javascript
const sayHey = getHelloFunction()
sayHey() // hey
sayHey() // hey
sayHey() // hey
```

## Data Privacy

That data privacy is an important concept to remember. In Object Oriented Programming, it was how you enforce private variables before the advent of [private methods and accessors](https://github.com/babel/proposals/issues/22) or transpilers such as [TypeScript](https://www.typescriptlang.org/docs/handbook/classes.html) which have private and protected. For functional programming, it's how we enforce, and prevent accidental, mutation. More importantly, it's how we reduce side effects.

Here's a pure function for pinging a URL. We're stubbing `request`here:

```javascript
const request = { head: _ => Promise.resolve("It worked.") }
const ping = (request, url) =>
    request.head(url)
```

However, it's a bit of a pain to supply `request` every time:

```javascript
ping(request, 'http://google.com').then(log) // It worked.
ping(request, 'http://jessewarden.com').then(log) // It worked.
```

So we create a curried function instead to utilize a partial application:

```javascript
const ping = request => url =>
    request.head(url)
```

Now, we create the default parameter version once:

```javascript
const headURL = ping(request)
```

And use it with just the 1 parameter we care about:

```javascript
headURL('http://google.com').then(log) // It worked.
headURL('http://jessewarden.com').then(log) // It worked.
```

## Violating Data Privacy

... but what happens if we modify `request` after the 1st call?

```javascript
headURL('http://google.com').then(log).catch(log)
request.head = _ =>
    Promise.reject(new Error('heh, not immutable, dat boom'))
headURL('http://jessewarden.com').then(log)
```

We get:

```
It worked.
(node:19713) UnhandledPromiseRejectionWarning: Error: heh, not immutable, dat boom
```

While using closures for data privacy is the core of how curried functions work in JavaScript, they still obey data by reference rules. Closures **are not** a panacea for immutability. If you mutate their references elsewhere, the closure doesn't have an immutable copy. While it can seem obvious that you can violating pure functions by mutating data, you'll often be working with code that may do this for unit testing purposes, or other reasons. If you're getting impure results, don't be afraid to whip out `Object.freeze` to see who is violating immutability. Ensure you put `'use strict'` up top in Node to trigger the exceptions `Object.freeze` can throw to help you.

```javascript
'use strict'
const request = Object.freeze({ head: _ => Promise.resolve("It worked.") })
```

I don't recommend leaving `Object.freeze` in your code because it's a [broken window](https://pragprog.com/the-pragmatic-programmer/extracts/software-entropy). Instead, focus on finding the mutation and fixing it unless it's something requiring herculean effort to change, like how your unit testing framework works, for example. 
