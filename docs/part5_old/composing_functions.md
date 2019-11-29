# Composing Functions

// [jwarden 3.10.2019] TODO/FIXME: We need to drive the partial application usage home. We're also missing using the pipeline operator which makes way more sense. We should probably just expand this section to show before/after of partial, and then create a new section for pipeline since I have a pretty good example of that here: https://gist.github.com/JesterXL/174a83a21fdff671bc5a7a8c954c6949 We should probably also separate flow, promises, and the pipeline operator into their own sections. The overview here is good, but each has different users. Finally, as much as I loathe RxJS, we should probably give it some love to show it's power in mixing async and sync.

Composing functions is when you combine a bunch of functions together to form a new function. When you build applications using Functional Programming, you'll be building new functions from existing functions. Flow in Lodash, Compose in Ramda, Folktale, and Sanctuary, allow you to pipe functions together in JavaScript. We briefly showed an example of this in the [Tacit Programming](tacit_programming.md) section using `flow`. Python and Lua make this a lot easier since both synchronous things like adding numbers and asynchronous things like loading data from websites work the exact the same way if you use the basics of the language.

JavaScript, however, handles asynchronous completely differently through `Promises`, Python optionally through their various concurrency options, and Lua through coroutines. We'll cover both below so you'll be deadly no matter which language you choose to wield. Also, RxJS and other libraries have been created to allow composition in JavaScript without caring if it is asynchronous or not.

## Prior Art: Chaining

A lot of languages and libraries already do some form of composition where you'll "dot chain" functions together to string together the output of one into the arguments of another.

String and Array in plain JavaScript:

```javascript
'Jesse,Brandy'
.split(',')
.map(name => `${name} is crunk on vacay, urrrkaaayy!`)
.sort()
.join('\n')
.toUpperCase()
// BRANDY IS CRUNK ON VACAY, URRRKAAAYY!
// JESSE IS CRUNK ON VACAY, URRRKAAAYY!
```

Chaining selectors in [JQuery](https://jquery.com/):

```javascript
$(document).ready(() => {
    $('#dvContent')
    .addClass('dummy')
    .css('color', 'red')
    .fadeIn('slow');    
})
```

And straddling both the sync and async worlds of JavaScript using RxJS (the `listAWSFunctions` makes a REST call that may take awhile):

```javascript
const { fromPromise, from } = require('rx')

const getLambdaFunctions = functions => 
    fromPromise(listAWSFunctions(functions))
    .pluck('Functions')
    .selectMany(from)
    .filter(lambda => get('Runtime', lambda) === 'nodejs')
    .filter(containsBasicRole)
    .toArray()
```

## Sync With Flow

To get a list of human names from our party in JSON will be a series of pure parsing functions. We'll compose them together keeping them as point-free as possible.

Our party in JSON:

```javascript
const peopleString = `[
  ["jesse warden", "swasbuckler", 18, 21, "human"],
  ["brandy fortune", "cleric", 11, 11, "human"],
  ["albus dumbledog", "war dog", 7, 9, "dawg"]
]`
```

## Parsing

Let's create our function and continue to add to it so we can see the process of how composition starts small and simple, yet can be augmented over time.

```javascript
import { flow } from 'lodash/fp'

const showHumans = flow([JSON.parse])

console.log(showHumans(peopleString))
// [ [ 'jesse warden', 'swasbuckler', 18, 21, 'human' ],
//   [ 'brandy fortune', 'cleric', 11, 11, 'human' ],
//   [ 'albus dumbledog', 'war dog', 7, 9, 'dawg' ] ]
```

The `JSON.parse` function takes 1 parameter, a String, and will output the parsed JSON Object. It's not pure because it'll throw if the String fails to parse, but we'll handle that scenario in [Part 6: Algebraic Data Types](part6/README.md).

## List to People

Our party members have their attributes flattened into an Array. Let's convert them to proper people Objects. e'll give the `map` our list of party members, and he'll destructure the Array into properties, then return them in an Object with the properties having the same name:

```javascript
const listToPeople = map( ([name, clazz, hitPoints, maxHitPoints, type]) =>
    ({ name, clazz, hitPoints, maxHitPoints, type })
)
```

Plugged into our flow, she'll get whatever `JSON.parse` spits out:

```javascript
const showHumans = flow([
    JSON.parse,
    listToPeople
])

console.log(showHumans(peopleString))
// [ { name: 'jesse warden',
//     clazz: 'swasbuckler',
//     hitPoints: 18,
//     maxHitPoints: 21,
//     type: 'human' },
//   { name: 'brandy fortune',
//     clazz: 'cleric',
//     hitPoints: 11,
//     maxHitPoints: 11,
//     type: 'human' },
//   { name: 'albus dumbledog',
//     clazz: 'war dog',
//     hitPoints: 7,
//     maxHitPoints: 9,
//     type: 'dawg' } ]
```

## Filter Humans

Like we've shown in the previous section, if any of the person's type is a human, we keep those in the newly returned Array. This means no Albus the dog in the filtered `party` Array.

```javascript
const filterHumans =
    filter(
        person => getOr('unknown', 'type', person) === 'human'
    )
```

Plugging her in:

```javascript
const showHumans = flow([
    JSON.parse,
    listToPeople,
    filterHumans
])

console.log(showHumans(peopleString))
// [ { name: 'jesse warden',
//     clazz: 'swasbuckler',
//     hitPoints: 18,
//     maxHitPoints: 21,
//     type: 'human' },
//   { name: 'brandy fortune',
//     clazz: 'cleric',
//     hitPoints: 11,
//     maxHitPoints: 11,
//     type: 'human' } ]
```

## Fix Name Casing

We can correct the casing of the names using Lodash' `startCase` method. It'll change 'jesse warden' to 'Jesse Warden'. We covered `set` in [Part 3: Set](part3/set.md), the function used to clone an Object and update a piece of data on the clone. We'll use both below to correct the casing of all the names on the human party members:

```javascript
const formatNames =
    map(
        list => set('name', startCase(get('name', list)), list)
    )
```

Popping her in results in both names fixed:

```javascript
const showHumans = flow([
    JSON.parse,
    listToPeople,
    filterHumans,
    formatNames
])

console.log(showHumans(peopleString))
// [ { name: 'Jesse Warden',
//     clazz: 'swasbuckler',
//     hitPoints: 18,
//     maxHitPoints: 21,
//     type: 'human' },
//   { name: 'Brandy Fortune',
//     clazz: 'cleric',
//     hitPoints: 11,
//     maxHitPoints: 11,
//     type: 'human' } ]
```