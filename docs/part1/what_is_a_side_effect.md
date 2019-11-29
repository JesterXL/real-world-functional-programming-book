# What is a Side Effect?

A side effect is something that happens outside of your function making it impure. We've covered the main 2 that can affect pure functions:

1. affecting how a function runs via global/closure variables
2. a function changing global/closure variables after it runs

## Outside Effects

Outside effects usually are from variables and modules outside your function affecting how it works.

### Closure and Global Varibles

Below we're using the environment variable `SERVER_URL` in Node.js:

```javascript
const getOAuthToken = (id, secret) =>
    request.post(`${SERVER_URL}/oauth`, { id, secret })
```

While the function is pure in that you'll get a `Promise` with the same inputs, the variable affects the function outside of it's inputs. It's affected by an outside "effect". Instead, it should be part of the arguments:


```javascript
const getOAuthToken = (serverURL, id, secret) =>
    request.post(`${serverURL}/oauth`, { id, secret })
```

Taking it a step further, `request` is also an inside effect. The [request-promise](https://github.com/request/request-promise) module above works differently than [request](https://github.com/request/request), which would mean the function returns `undefined` instead of a `Promise`. Refactoring that to be more pure is challenging. The first step is to make it an argument:

```javascript
const getOAuthToken = (request, serverURL, id, secret) =>
    request.post(`${serverURL}/oauth`, { id, secret })
```

From here, the onus is on `request` itself to become more pure and not negatively affect those using it. If the `request` itself is pure, or at the very least `request.post`, then you can prevent the above step. Given JavaScript/Python/Lua (who all have a `request` library) are not functional languages, this is about as pure as you can make them given the `request` function will generate a side effect when you call it. Promises help manage the effects safely with built-in try/catch that won't propagate if you use a `catch` callback, and give you control on when they run. 

## Inside Effects

If the world changes after function changes, that means it has side effects. The function affects things "to the side of it", like global/closure variables.

### Global Variables

Below, we're saving a copy of the formatted name on a global variable:

```javascript
const getFormattedName = person => {
    const formatted = `${person.lastName}, ${person.firstName}`
    window.formatted = formatted
    return formatted
}
```

While the function is pure from a same input, same output perspective, the `window` has its formatted variable change each time it runs.

```javascript
it('should have side effect', () => {
    expect(window.formatted).toEqual(undefined)
    const _ = getFormattedName({firstName: 'Bruce', lastName: 'Campbell'})
    expect(window.formatted).toEqual('Campbell, Bruce') // <-- FP doesn't allow this
})
```

### Logging

There are other more subtle forms of this. The below logs what you formatted:

```javascript
const getFormattedName = person => {
    const formatted = `${person.lastName}, ${person.firstName}`
    console.log(person)
    return formatted
}
```

That's a harmless side effect, right? No, depending upon how deep you go into the rabbit hole.

1. `console.log` returns no value. If you read [Part 1: Pure Functions](README.md), your spidey sense should be tingling.
2. `console.log` logs to standard out which is read by something. In the browser, that could be a  Chrome process. The browser, it has no downstream pressure release, meaning if you log too many Strings, it will run out of memory. (This is one of the reasons Elm doesn't allow `Debug.log` in production builds).
3. In Node.js, standard out is most like the OS's stdout, which is Unix's version. If you're deploying on a server, that's either to the machine (which can probably take the huge and frequent outputs), or to a file which will run out of space eventually, or to a log transporter like `fluentd` to move them to [ELK](https://www.elastic.co/what-is/elk-stack) or [Splunk](https://www.splunk.com/). If you have application alerts, and those logs contain errors, you're phone will get a text.

Thus, `console.log` can crash the browser, crash your server, crash other related/unrelated servers if you're on a shared host/EC2, and text your phone in the middle of the night. As you can see, not harmless.

### Errors

Errors in imperative and Object Oriented languages are viewed as a helpful feature, and rightly so. You get information of what happened, where, with a stack trace leading up to where the error happened. In the JavaScript browser world, you may even get an accurate line number. While the quality and types of errors vary, it's built into how you work with the language. They're also handled flexibily and optionally in languages like JavaScript, Python, and Lua. While Functional Programming officially does not use errors from a mathematical standpoint, the pragmmatists have influenced functional languages to have them anyway. Some languages even make them optional.

Despite this book being "real world", we take an ivory tower stance against using Errors because of how poorly dynamic languages and library writers handle errors. They're also one of the most challenging things to handle when doing FP code in a non-FP codebase.

Let's create a landmine:

```javascript
const landmine = steppedOnIt => {
    if(steppedOnIt) {
        throw new Error('b00m 🔥')
    }
    return false
}
```

If we call it with `false`, we'll get `false` back:

```javascript
const result = landmine(false)
log(result) // false
```

However, if we call it with `true`, it explodes:

```javascript
const result = landmine(true)
// Thrown:
// Error: b00m 🔥
//     at landmine (repl:3:15)
```

This in turn means there was no return value. If we try to access that return value, this leads to another error:

```javascript
console.log(result)
// Thrown:
// ReferenceError: result is not defined
```

Errors violate pure function rules by causing side effects. In a concurrency world, they can also affect those managing your process or thread. In dynamic languages, they can also put your program in an unknown state if data was expected to equal something, but because of the error it never got set. This can hide the bug or make you look in a completely different, and wrong place for it.

## Concurrency

Above you've seen that errors stop functions in their trakcs.

## Object Oriented

*NOTE*: The below assumes you already know Object Oriented Programming, specifically around how it works within JavaScript.

Object Oriented violates pure function rules by it's very design. It holds internal state, changes them through mutation, and often creates functions that take no inputs, return no values, are affected by both inside effects, and cause outside effects.

In Object Oriente Programming, it is common for Objects and Functions to utilize the `this` keyword. This means the "state", or data as it currently is, can be accessed by the `this`.

For example, if we model a Person via a `Person` class:

```javascript
class Person {
    constructor(age=NaN) {
        this.age = age
    }
}
```

The `constructor` does take an input, but returns no value. But... it kind of does... as long as you use the `new` keyword, magic happens. If you call it without the `new` keyword, it's returns a completely different value of `undefined`, affecting the scope of how/where the function runs. It also mutates the instance as by creating the `age` property. Functional Programming isn't about magic nor mutation.

We can then instantiate it, and get a unique instance, or Object, that has it's own copy of data.

```javascript
jesse = new Person(40)
```

If we want to print the age, we could go access the instance `age` public property:

```javascript
console.log(jesse.age + ' years old.')
```

Pragmmatists AND Purists are ok with pure functions returning Objects that have data on it.

We want to be able to have a birthday. However, that would mean we'd set the public property ourself:

```javascript
jesse.age++
```

This defeats the purpose of re-usable classes, and violates OOP rules around external data access. We'll make a method on the class and make the variables private to encapsulate that functionality. 

First, we'll make the variables private:

```javascript
class Person {
    #age
    constructor(age=NaN) {
        this.#age = age
    }
}
```

Then, we'll create a public method that gets the age:

```javascript
    ...
    formatAge() {
        return this.#age + ' year old.'
    }
```

This method appears pure at first. No input, same output. Except the `this` is not passed into it's parameters. Instead, it's access a closure/global called `this`. This means you may have the same input, but you will not have guarenteed same output.

From an OOP perspective, however, we can access our data in an ecapsulated way:

```javascript
console.log(jesse.formatAge()) // 40 years old
```

This is normal and encouraed in OOP, to abstract how data is modified internally via public methods. Functional Programming also encourages exposing public functions that abstract away private ones usually through modules. The difference is that OOP will not use pure functions. This results in you either having to call methods in a certain order, or having 1 public method call a bunch of private methods in the correct order to ensure that problem doesn't happen.

Let's add a birthday method illustrate this point:

```javascript
    ...
    haveABirthday() {
        this.#age++
    }
```

To see it work:

```javascript
it('should set age correctly', () => {
    const jesse = new Person(40)
    expect(jesse.formatAge()).toEqual('40 years old.')
})
```

However, we have to call have `haveABirthday` first then `formatAge` second to see our data:

```javascript
it('should have birthday by 1 year', () => {
    const jesse = new Person(40)
    jesse.haveABirthday()
    expect(jesse.formatAge()).toEqual('41 years old.')
})
```

This function violates same input, same output because you're not gurenteed same output. This function does not use immutable data and increments the private `age` property manually, using mutable state. This causes outside effects (on purpose since it's OOP). Style wise, OOP is all about changing the world after a function runs, you'll often see class methods that return no value because there is no point to do so. They've done all their work on mutable state that is encapsulated internally.

So when a Functional Programmer says "your function is not returning a value" to an OO Programmer, the OO Programmer will often have no idea what the Functional Programmer is talking about. They'll be thinking:

> "It's a method, not a function."
> "You don't need to return a value, it's setting the data."
> "Even if I did write `return this.#age` as the new value, this could give the wrong data since I need to control from a public API where and how they access my data.

You _can_ write OOP in a more functional way. You can write as many pure functions as possible, and use classes for things that have co-located mutable state, like UI objects/pixels, or data from Sockets. 

The core issue with OOP, beyond violating pure function rules, isn't really about a single class. The real hard problems arise when you have a bunch of classes used together. While they may handle their own internal state, and those abstracting this group of classes, you never can be too sure who's modifying what, where with all the mutable state. The combinations are too many to manage, hence why OOP developers will abstract things on purpose to lessen the cognifitive overhead. Functional Programmers do this too. The difference is, Functional Programming gurentees what your state is whereas OOP does not.