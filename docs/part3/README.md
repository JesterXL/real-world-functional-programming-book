# List Comprehensions

A list comprehension is a function that takes in an Array, and outputs a different Array. Whereas predicates are pure functions that return `true` or `false`, list comprehensions are very similar, with the goal to help reduce the amount of code required to write loops such as the `for` loop. The term popularized in Python, so if you're in JavaScript, you'd say "Array Comprehensions".

Pure loops with less code.

Many people sell list comprehensions coming from the Ruby or Python background as a way to do loops with less code. That misses the fundamental goal is to ensure purity. You can create pure functions using regular `for` and `while` loops, just like you can use the `var` and `let` keywords, yet still ensure the function is pure. However, they are quite imperative, and you can make mistakes easier. It also has "mutation mindset" such as mutating a list index or keeping track of a current value, which is ok but isn't how pure functions work.

In true functional programming, there are no loops, only recursion. We don't care about that, though, because we'll just use the functions that take care of those details for us.

## The Big 3

In weight lifting, there is the concept of [The Big 3](https://rippedbody.com/the-big-3-routine/). The Squat, Bench Press, and Deadlift. They are the core exercises, with ample sleep and protein, to become strong.

List comprehensions are no different. The Big 3 for them is `map`, `filter`, and `reduce`. Here's a famous picture that helps visualize in pseudo code how they work using emoji 😂:

```javascript
map([🐮, 🥔, 🐔, 🌽], cook)
=== [🍔, 🍟, 🍗, 🍿]

filter([🍔, 🍟, 🍗, 🍿], isVegetarian)
=== [🍟, 🍿]

reduce([🍔, 🍟, 🍗, 🍿], eat)
=== 💩
```

We'll cover them as well as using 3 additional functions they are used to build, `every`, `some`, and `zip`. Using these with predicates and other pure functions, you'll start to learn the basics of composing, and start to glimpse at how pure functions work well together in a more predictable fashion.

Finally, you'll gain a re-appreciation for an old friend, the `Array`, and how powerful she is.

## Note on Browser / Node Support

Many array comprehensions are being added to the core [JavaScript Array class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). That said, many will mutate the Array instead of returning a new Array. Even [Lodash](https://lodash.com/docs/4.17.10) will occasionally do this. That said, for things like `map`, `filter`, etc. we'll be using Lodash instead of the built-in versions merely because the Lodash functions are safe and immutable, and Lodash is an extremely battle tested library. Additionally, the syntax for Lodash and Ramda is based on pure functions taking inputs whereas most Array methods are based on class methods which are subject to being impure because of them being defined on the mutable `Array.prototype`. Remember the [Trouble With Dots](part1/trouble_with_dots.md). Modifying class prototypes has fallen out of fashion and is now a moderate security vulnerability. Most modern browsers including Node have good parity on ensuring `map` works the same in all browsers and engines. Thus you are welcome to use the native ones if you're so inclined.

For example, the [map in Lodash](https://lodash.com/docs/4.17.11#map) only provides your function with the item in the Array. The native [Array map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) however provides the item, the current index, and a reference to the original Array that is being iterated over. That index is very useful in some cases. Just be careful when you go `theArray.map` that `theArray` is actually `undefined` (see the [Trouble With Array Access](../part2/trouble_with_array_access.md)).