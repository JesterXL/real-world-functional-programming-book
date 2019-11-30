# Parameter Order

Function currying won't help you unless the arguments are in a good order. The more arguments, the more you have to think about what order they should go in. There are often known dependencies, despite the fact you have to declare it as a function argument.

In the previous chapter, we did the same with `Array.map` and `filter` when writing curried functions:

```javascript
filter = predicate => array =>
    array.filter(predicate)
```

We did this because when building our functions, we know what the `predicate` will be; we're writing the function. You couldn't write it if you didn't know what it'd be:

```javascript
filterHumans =
    filter(
        peep => peep.type === 'Human'
    )
```

Note in the above we do **NOT** know what the `Array` of if Humans and Dogs are. That's the data we're waiting for someone to pass into the `filterHumans` function. They could pass an empty `Array`:

```javascript
filterHumans([])
// []
```

... or an `Array` of just Dogs:

```javascript
filterHumans([{ type: 'Dog'}, { type: 'Dog' }])
// []
```

... or just a single Human:

```javascript
filterHumans([{ type: 'Human'}])
// [{ type: 'Human' }]
```

... or even of something completely different:

```javascript
filterHumans([{ type: 'Cow'}, { type: 'Chicken' }])
// []
```

The point is, we don't know. That's the dynamic data we probably want the function to do work on. The known stuff, typically functions and variables on how the function works, those are known.

## Left Knowns, Right Unknowns

The known things, or things that are static and unchanging you typically want to put to the left (first) in the function arguments. The dynamic things, or things you won't know until the last possible moment, you put to the right (last).

To illustrate how this makes your functions useful vs. painful to use, let's make 2 functions that do the same thing. We'll reference our `filterHumans` above.

We'll create our `curriedLeft` function version of `filter`:

```javascript
const curriedLeft = predicate => array =>
    array.filter(predicate)
```

And our `curriedRight` does the same thing, just the arguments are reversed:

```javascript
const curriedRight = array => predicate =>
    array.filter(predicate)
```

Both functions have the same assumptions:

**Known**: `predicate` will be used.

**Unknown**: `array`, we don't know what it is yet.

Let's rewrite the top part of our `parsePeopleNames` from the previous chapter using our 2 new curried functions. We'll use the `curriedLeft` first:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            curriedLeft
                (person =>
                    person.type === 'Human')
        )
```

Note in the above, the `curriedLeft` takes a predicate function first. We define it right there and give it to it: take a person and return `true` if it's a Human. When the Promise' `then` function runs, it'll give it the `Array` it parsed from the `JSON.parse`.

Now doing the same thing using our `curriedRight` function:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            array =>
                curriedRight
                    (array)
                    (person =>
                        person.type === 'Human')
        )
```

... ok, that defeats the purpose of using curried functions. Since the `Array` is first, you have to define a function so you can give it a name, then use it in the first parameter. That curried function is so un-useful, you have to create another function to use it. That's how much parameter order matters.

To add insult to injury, let's replace with the native OOP version:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            array =>
                array.filter(person =>
                        person.type === 'Human')
        )
```

You will make these kinds of mistakes, sometimes intentionally, as you learn to wield curried functions effectively. Sometimes you don't know the best parameter order and have to use them, then refactor to get a feel for what's best.

## Practice Makes Perfect

Don't fret if you continually refactor argument order until it feels right, it'll develop as a habit with practice. Like with [muscle memory](https://en.wikipedia.org/wiki/Muscle_memory) that you learn from physical sports and exercise. Muscle memory is actually a cache of common movement tasks your brain stores for quick access. The more you do it, the more your brain caches & improves how quickly and easily you can do the movement on instinct, without thinking. So too with parameter order. Your brain will "know" which ones to put first and which ones to put further right in real-time.

Remember, favor curry left. Put the known things to the left, and the unknown, dynamic data to the right.