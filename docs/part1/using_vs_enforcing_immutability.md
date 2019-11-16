# Using vs Enforcing Immutability

In [The Case for var and let](var_and_let.md), we showed Array destructuring as a way to support immutability instead of relaying on `const` to ensure you cannot modify an Array. There is a subtle, but important, attitude there not be missed. We want to encourage a normal way of returning immutable data instead of enforcing immutable data.

Enforcing immutable data would be using things like `Object.freeze`, the [Immutable.js](https://facebook.github.io/immutable-js/) library, or heavy handed clone methods. [Object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) only does shallow copying. If you wish to make a deep copy, you have to do insane syntax: 

```javascript
const clone1 = (person, newStreetName) =>
    ({
        ...person,
        address: {
            ...person.address,
            streetName: newStreetName
        },
        phoneNumbers: [...person.phoneNumbers]
    })
```

Or get a more reliable clone that inadvertently burns the `Object.prototype`'s enhancements away:

```javascript
const clone2 = object =>
    JSON.parse(JSON.stringify(object))
```

This is not what Functional Programming is about. It's about using and composing pure functions, not ensuring someone cannot mutate data. If you use pure functions and compose them, you end up not mutating data, and thus there is no reason to enforce it. In the `clone1` example above, if we remove the phoneNumbers copying, yes, we'll have a reference to the "old" phoneNumbers array. Who cares? Our code only reads it and never sets nor mutates it so don't have to worry. 

... however, in the real world, you will be working with non-FP programmers, writing non-FP code, using non-FP libraries. Sometimes knowing how to suss out the mutation, prevent it, or benefit from performance techniques are helpful to support immutability. When dealing with concurrency, you may have other instances of your application mutating data, which is why languages like [Erlang](https://www.erlang.org/) ensure you physically can't mutate data to keep you safe in those concurrent environments.

For atomics like `String`, `Boolean`, and `Number`, they are copied by value, and are easy to clone; by making a new variable/constant or function return value, they give you a new clone.

```javascript
let name1 = "Jesse"
log(name1) // Jesse
let name2 = name1
log(name2) // Jesse
name2 = "Cow"
log(name2) // Cow
log(name1) // Jesse
```

For Arrays and Objects, however, favor [Destructuring Assignment in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Python and Lua are more complicated.

# Object.freeze

Frameworks like [Redux](https://redux.js.org/) ensure there is only 1 variable in your application. You'll hear developers say it helps avoid prop drilling, or it allows sibling components in the tree to communicate, and those are both true. As an FP'er, you know it's most important feature is to support immutability. You never mutate the data yourself, instead asking the `store` to hide the access, and provide functions that allow the data to be changed internally using pure functions.

If you're dealing with a legacy system, or with code not written in using pure functions, using `Object.freeze` can help probe where the mutation is occurring in a heavy handed way by triggering an exception wherever the mutation exists. Functional Programming is about returning values, not causing side effects, and throwing errors is just that: intentional side effects.

However, it can be a powerful tool to help find the impurity, fix it, and move forward.

First, ensure your code is in strict mode, typically writing `"use strict"` at the top of the file(s). Second, wrap your data in `Object.freeze`:

```javascript
Object.freeze(myObjectOrArray)
```

Anytime code attempts to modify it, it'll throw a `TypeError`, and you should be able to glean where the offending non-FP code is from the stack trace.

The bad news is, if you leave this code in your program, you're intentionally leaving a side effect (code that can throw an error) in your code. Once you've found the offending mutation, you should remove it if you wish to be pure. Better yet, use this a way to practice Test Driven Development/Red Green Refactor and making code more pure at the same time.

The good news is, if you don't, as long as you don't have any mutation, it'll work just fine with Object destructuring.

# Immutable.js

The [Immutable.js](https://facebook.github.io/immutable-js/) library allows you to use common data types, but in an immutable way. For example, `Array` and `Object` in JavaScript can easily be used in immutable ways by using Object/Array [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), but things like [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) cannot. Also, only some methods of `Array` are immutable. Immutable gives you all these data types with methods that are pure, and the data is immutable. They've also added many performance enhancements beyond just memoize (caching) that you may benefit from.

To be clear, you do not need Immutable to write pure functions with immutable data in JavaScript. However, their API is nice, having extra data types is helpful, and gleaning some of the performance benefits is massive icing. For some, having the enforced immutability gives them confidence in their code.
