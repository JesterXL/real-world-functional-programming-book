# Composition and Tacit Programming

[Tacit Programming](https://en.wikipedia.org/wiki/Tacit_programming), which also goes by the name of point-free style, is a way to write functions without specifying their arguments. It's useful for:

- to write less code
- to help in composition of functions
- same reason you use partial applications in reducing the amount of arguments you need to provide

## map and get

We've already covered using curried functions from the [Lodash FP section](lodash_fp.md) to reduce the amount of code you can write and to create re-usable functions from partial applications.

```javascript
// lodash
const getNames = party => map(
    party, 
    person => get(person, 'name')
)

// lodash/fp
const getNames = map(get('name'))
```

Those partial applications used in the lodash/fp example don't define their function parameters. Below, we compare the point style where they define the arguments, and point-free where they don't, even when using lodash/fp:

```javascript
// point style
const getName = object => get('name', object)
const mapNames = party => map(getName, party)
const getNames = party => mapNames(party)

// point-free style
const getName = get('name')
const mapNames = map(getNames)
const getNames = mapNames
```

## Pro's and Con's

There are 3 upsides to using point-free:

1. less code
2. sometimes less wasted functions
3. sometimes you create re-usable functions

The `map(get('name'))` is much less code than `map(party, person => get(person, 'name'))`, and we don't have to create functions merely to ensure the arguments are in the right order. Assuming the common stuff is the left/first parameter, we can create a lot of re-usable functions using partial applications by only passing in some of the arguments to curried functions.

There are 3 downsides to point-free, specific to dynamic languages:

1. memorize function signatures
2. no types nor runtime assertions
3. it's an extra step of "thinking"

Do you know what `get`'s function signature is? And `map`'s? We've just covered it. How about `reduce` in lodash/fp instead of lodash? When you see `map(get('name'))`, you have to have memorized what the function signatures are for `get` and `map`. If you haven't, then you have to go look them up, else you don't understand the code. One could argue you have the same problem for any abstraction, but do you have to do the same for this?

```javascript
const getName = object =>
  get('name', object)
const getNamesFromListOfObjects = party =>
    map(
        member => getName(member),
        party
    )
```

None of those functions are needed using lodash/fp, but we used them to be more clear in what the code does. So you don't have to memorize the function signatures, nor force those reading your code to memorize them too. You don't have to think because the functions clearly list their function arguments, and use adjectives to give you hints as to what they are and what they might return. In dynamic languages where there are no types to help you and intellisense in your IDE is of varying quality, being verbose like this can lead to much more readable code.

Let's give a few more examples to see if you like it or not. Sometimes you'll just have to pick and choose where you use it.

## Validating Data

Let's validate data using lodash/fp in a point and point-free styles so we can contrast them. Validating data in dynamic languages typically is saying "does it look like the Object I want?" Unlike typed languages where "it must be this type" whether at compile time or runtime, in dynamic languages, you're like "if it has a `then`, it's probably something that that acts like a Promise, so we can treat it like one in our system; good enough for government work!". You'll do this a lot when parsing data in API's.

Our data:

```javascript
const person = {
    name: 'Jesse Warden',
    address: {
        street: '123 Cow Ville',
        phone: [
            '123-555-1234',
            '999-555-8234'
        ]
    }
}
```

We'll use `has` to verify the Object has a property we expect to find, and `every` to run through all the properties we're looking for. As long as it found all the properties, the Object is probably ok.

```javascript
const { has, every } = require('lodash/fp')

const legitPerson = person =>
    every(
        hasResult => hasResult === true,
        [
            has('name', person),
            has('address.street', person),
            has('address.phone[0]', person)
        ]
    )

console.log(legitPerson(person)) // true
```

We can reduce how verbose it is using point-free style on the `has`. Instead of populating the Array with a bunch of Booleans, we can instead populate it with a bunch of Functions. We still keep the original `legitPerson` point style, but at least reduce the contents of the function:

```javascript
const legitPerson = person => every(
    predicate => predicate(person),
    [
        has('name'),
        has('address.street'),
        has('address.phone[0]')
    ]
)

console.log(legitPerson(person)) // true
```

## Default Values via getOr with Filtering

### getOr

Sometimes you want default values in case what you're trying to get doesn't exist. We've covered `get` in [Part 2: Get](part2/get.md), which allows you to safely get data. If the data isn't there, it'll return `undefined`. If you want to use default values in the case of `undefined`, however, it's a bit unwieldy:

```javascript
import { get } from 'lodash/fp'

const getPersonType = person => {
    let result = get('type', person)
    if(result === undefined) {
        result = 'unknown'
    }
    return result
}
```

We can instead use `getOr` to say "Maybe there is a value there... if it is, great, use it, otherwise just use the default."

```javascript
import { getOr } from 'lodash/fp'

const getPersonType = person =>
  getOr('unknown', 'type', person)
```

Or point-free:

```javascript
const getPersonType = getOr('unknown', 'type')
```

I should point out, the regular Lodash version reads more naturally: "from this Object, get the 'type', or just use 'unknown'" whereas lodash/fp reads "If we don't find anything use 'unknown', when looking for the 'type' property, on this Object". Lesson: Curry friendly doesn't always mean reader friendly.

### Using getOr and flow with filter

Point-free can either really help if you've memorized the API, or really harm, when you start composing functions together. As they get larger, you can prevent this from being too verbose via point-free style. Below we'll filter a list by only getting the humans using `getOr` and `filter`. Below is our needed imports and `party`:

```javascript
const { getOr, filter } = require('lodash/fp')

const party = [
    { name: 'Jesse', type: 'human' },
    { name: 'Brandy', type: 'human' },
    { name: 'Albus', type: 'dawg' }
]
```

We'll use `filter` in a point style to only get the humans:

```javascript
const filterHumans = people =>
    filter(
        person => getOr('unknown', 'type', person) === 'human',
        people
    )
```

Running it against the `party`, we get:

```javascript
console.log(filterHumans(party))
// [ { name: 'Jesse', type: 'human' },
//   { name: 'Brandy', type: 'human' } ]
```

If we rewrote that in point-free style, we could remove the `people` parameter because `filter` is already curried by default, and expects the Array as the 2nd parameter:

```javascript
const filterHumans =
    filter(
        person => getOr('unknown', 'type', person) === 'human'
    )
```

We can't further make it point-free without creating some additional pure functions, namely the predicate we pass to filter. Let's shrink `getOr` to be point-free first:

```javascript
// from
const getTypeOrUnknown = person => getOr('unknown', 'type', person)
// to
const getTypeOrUnknown = getOr('unknown', 'type')
```

Now we can put that into our `filter`:

```javascript
const getTypeOrUnknown = getOr('unknown', 'type')
const filterHumans =
    filter(
        person => getTypeOrUnknown(person) === 'human'
    )
```

### isEqual

Almost all operators in JavaScript have equivalent pure function versions of them in lodash/fp. Operators work well and should used, but they do not compose as well as functions do. The `isEqual` is like `===`, just a function. We can replace the `thing === 'human'` with `isEqual`:

```javascript
// point style
const equalsHuman = thing => isEqual('human', thing)

// point-free style
const equalsHuman = isEqual('human')
```

Using that in our `filter`:

```javascript
const getTypeOrUnknown = getOr('unknown', 'type')
const equalsHuman = isEqual('human')
const filterHumans =
    filter(
        person => equalsHuman(getTypeOrUnknown(person))
    )
```

Great, one function left.

### Flow

However, you see the nesting up there? The `equalsHuman(getTypeOrUnknown(person))` part. Once you have 2 or more functions nested like this, you can break them into a line using `flow`. It allows you to compose functions into a chain or set of pipes, just like Promises do, but synchronously. See the previous chapter [composing functions](composing_functions.md) for a refresh on how `flow` works.

To make the filter predicate point-free, we have to remove that `person` parameter. The only way to do that is to write a function that wraps `equalsHuman` and `getTypeOrUnknown`:

```javascript
const isHuman = person => equalsHuman(getTypeOrUnknown(person))
```

... but he isn't point-free. Let's use `flow`:

```javascript
const isHuman = person => flow([getTypeOrUnknown, equalsHuman])(person)
```

And then the point-free version:

```javascript
const isHuman = flow([getTypeOrUnknown, equalsHuman])
```

Now, using that in our `filter` to make all of it point-free:

```javascript
const getTypeOrUnknown = getOr('unknown', 'type')
const equalsHuman = isEqual('human')
const isHuman = flow([getTypeOrUnknown, equalsHuman])
const filterHumans = filter(isHuman)
```

## Conclusions

Point-free style can significantly reduce the amount of code you have to write, and often happens when you use a lot of partial applications. The cost is increased cognitive load: it makes you think more when reading it unless you abstract it. Most of what we you do as a programmer is read code, not write it. That's why some people call point-free programming "pointless programming".
