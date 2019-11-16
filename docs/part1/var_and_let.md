# Et tu const?

If a function mutates data that is passed into it, it will affect the outside world, failing to follow the 2nd pure function rule of no side effects. The world, variables and data defined outside of the function, should not change after a function is run. Does that mean `var`, `let`, and possibly even `const` are off limits?

They are not off limits. Just use them inside a pure function.

## Playing & Thinking in Procedural

A lot of time in programming, we're writing procedural code and storing those results in local variables. Local variables are variables only used for the life of the function, and are intentionally put there to be used by a closure. This could be for a variety of reasons.

- playing with ideas
- teaching
- working on a complicated algorithm and want instant feedback
- want to easily debug or log each line or to inspect variables
- easier for you to think and build code this way vs. "ALL PURE FUNCTIONS"
- the above with Test Driven Development / Red Green Refactor

For example, here is parsing URL parameters manually instead of using a library:

```javascript
const log = console.log
const url = "/api/search?name=jesse"
let query = url.split('?')
log(query) // [ '/api/search', 'name=jesse' ]
query = query[1]
log(query) // name=jesse
query = query.split('=')
const key = query[0]
const value = query[1]
query = {[key]: value}
log(query) // { name: 'jesse' }
```

It's really easy and quick to create temporary `let` and `const` variables in a procedural way to play with ideas. You can log each line to see exactly what is happening to learn or find mistakes.

## Pure lets

**Solution**: Follow the pure function rule and you're fine.

This behavior and style of writing is still encouraged. Many of us coming from Imperative backgrounds thinking in terms of "how" something should work vs. "what" should happen. If this mode of thinking is easier for you, then go for it! You can still write this way and keep things pure if you just follow the 2 rules. Let's take the above and make it mostly pure.

```javascript
const log = console.log
const url = "/api/search?name=jesse"

const parseQuery = url => {
    let query = url.split('?')
    log(query) // [ '/api/search', 'name=jesse' ]
    query = query[1]
    log(query) // name=jesse
    query = query.split('=')
    const key = query[0]
    const value = query[1]
    query = {[key]: value}
    log(query) // { name: 'jesse' }
    return query
}
log(parseQuery(url)) // { name: 'jesse' }
```

Copy pasta coding! Notice that we just copy and pasted the code inside a function. It follows the same input, same output rule. The outside world part we need, the `url`, is passed into the arguments. The `query`, although it's a `let` variable, it only exists for the life of the function and doesn't affect the outside world. Same for the `key` and `value` are constants, but they too only exist inside the function. 

The `log` technically breaks the being affected by the outside world, and affecting the world after its run. He's a noop, though, a function that returns no value so we assume it "does no operation". You'll start to develop a 6th sense when you see noops, they probably indicate side effects happen after you call the function. We also use the `log` as a closure variable. He's harmless though, so this is ok. For now. See [Part 9: Logging & Purity](../part9/log_purity.md) to see a counterpoint to this.

## const Ain't So Constant

The `const`, or constant, is not a panacea to immutability. While we can define complex objects like Arrays and Objects using `const`:

```javascript
const friends = ['🐄', '🐕']
```

If we then try to re-assign it, anywhere:

```javascript
friends = ['🦆']
TypeError: Assignment to constant variable.
```

We get an error. However, there are other ways around this:

```javascript
friends.push('🦆 ')
console.log(friends) // [ '🐄', '🐕', '🦆' ]
```

## Pure const

**Solution**: Use immutable return values, assign those to `const`.

Complex objects like `Object` and `Array`, or even modules and class instances will have methods that can hide mutation; changing a variable's value. This is how you're supposed to do things in Object Oriented Programming, hiding data access and modification. Practice immutability by creating new objects, deep clones, or using [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) shown in [Same Input, Same Output, No Side Effects](part1/input_output_side_effects.md) inside of pure functions.

Our example above can be changed to pure by using Array destructuring:

```javascript
const addFriends = (friends, newFriend) =>
    ([...friends, newFriend])
```

Now, we can add all kinds of friends, multiple times, and it's a pure function, and doesn't really care if `const` works like one would assume a constant should work or not:

```javascript
const friends = ['🐄', '🐕']
const newFriends = addFriends(friends, '🦆')
console.log(friends) // [ '🐄', '🐕' ]
console.log(newFriends) // [ '🐄', '🐕', '🦆' ]
const newFriendsAgain = addFriends(friends, '🦆')
console.log(friends) // [ '🐄', '🐕' ]
console.log(newFriends) // [ '🐄', '🐕', '🦆' ]
console.log(newFriendsAgain) // [ '🐄', '🐕', '🦆' ]
```

## Conclusions

Using `let` and `const` is fine as long as your function follows the pure function rules of same input, same output, no side effects. Using closure variables and functions, however, is dangerous. As you saw above, `console.log` is ok because he's a `noop`, but most aren't. For closure variables, most are by ref, if they don't come in by your function arguments and affect the output, your function will break the rules and not be pure. Making copies won't work because sometimes closures won't be there causing a null pointer error. As long as you contain the mutations within the life of your function, it's pure, and using `var`, `let`, and `const` is fine.
