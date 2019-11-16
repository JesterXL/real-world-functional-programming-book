# The 5 Stages of Learning Function Currying

There are 5 stages of learning function currying:

1. creating closures
2. creating partial applications
3. using curried functions to create partial applications
4. writing curried functions
5. EVERYTHING IS A CURRIED FUNCTION
6. ???

This book assumes you've already comfortable with #1. [Part 4: Partial Applications](partial_applications.md) handles #2.

Below, we'll get you more practice at creating partial applications with less work, and the beginnings of seeing how curried functions create partial applications.

## Lodash vs Lodash FP

Lodash provides another version of itself called "Lodash FP", which stands for Lodash Functional Programming. The 2 features that make it appealing are:

1. All methods are curried
2. all data is immutable (within reason)

This is a wonderful tool to slowly start using partial applications, get comfortable using curried functions in different styles, and start creating your own. Most of the functions Lodash have in Lodash/fp are there, just their arguments are reversed to be static left, dynamic right.

### get

Using a deeply nested Object:

```javascript
const person = {
    firstName: 'Jesse',
    lastName: 'Warden',
    age: 39,
    address: {
        home: {
            street: '007 Cow Lane',
            phone: ['123-456-7890']
        },
        work: {
            street: '123 Work Blvd'
        }
    }
}
```

Using regular Lodash to get the `firstName`:

```javascript
const { get } = require('lodash')

const firstName = get(person, 'firstName')
console.log(firstName) // Jesse
```

Note the static/known variable, the property we're looking for, `firstName` is last, and the dynamic piece of data `person` is first.

Let's see that in lodash/fp:

```javascript
const { get } = require('lodash/fp')

const firstName = get('firstName', person)
console.log(firstName) // Jesse
```

Note the static/known variable, the property we're looking for, `firstName` is _first_ this time, and the dynamic piece of data `person` is _last_. This makes it easier to create a re-usable function as a partial application like so:

```javascript
const getFirstName = get('firstName')
const firstName = getFirstName(person)
console.log(firstName) // Jesse
```

The `get` function takes 2 arguments. We only gave it 1. The return value from `get('firstName')` is a function, a partial application, that's waiting for some object so it can see if it has a `firstName` property or not.

If you were only allowed to use lodash, you could do that using `partialRight`:

```javascript
const { get, partialRight } = require('lodash')

const getFirstName = partialRight(get, ['firstName'])
const firstName = getFirstName(person)
console.log(firstName) // Jesse
```

Cool, but gross since lodash/fp is available to you. The `partialRight` creates a function, a partial application, that looks like:

```javascript
const getFirstName = person => get(person, 'firstName')
```

These are two of the ways lodash/fp is useful, specifically around creating re-usable partial applications with a convenient argument order built for currying.

## map

All the list comprehensions in lodash/fp like `map`, `filter`, etc. are the same as well with arguments basically reversed. Given we have a list `party`:

```javascript
const party = [
    { name: 'Jesse', clazz: 'Swasbuckler' },
    { name: 'Brandy', clazz: 'Cleric' },
    { name: 'Albus', clazz: 'War Dog' }
]
```

We'll use Lodash to turn that into a list of names using `get` and `map`:

```javascript
const { map, get } = require('lodash')

const names = map(
    party, 
    person => get(person, 'name')
)
console.log(names) // [ 'Jesse', 'Brandy', 'Albus' ]
```

And the same in lodash/fp:

```javascript
const { map, get } = require('lodash/fp')

const names = map(
    get('name'),
    party
)
console.log(names) // [ 'Jesse', 'Brandy', 'Albus' ]
```

Note 2 things. The function used to do the `map` is first instead of second. You'll usually know the function you're using to map first anyway, and the array you want to map over last. Also notice instead of defining a new function like we did for lodash using `person => get(person, 'name')`, we instead just use `get('name')`. Both do the same thing, one just returns a partial application, and is shorter to write.

### Functions That Make Functions That Make Functions

Let's expand this re-use of partial applications one step further. Given we have bunch of `parties`:

```javascript
const fortuneWardens = [
    { name: 'Jesse', clazz: 'Swasbuckler' },
    { name: 'Brandy', clazz: 'Cleric' },
    { name: 'Albus', clazz: 'War Dog' }
]
const icewindDale = [
    { name: 'Bruenor', clazz: 'Fighter' },
    { name: 'Drizzt', clazz: 'Ranger' },
    { name: 'Wulfgar', clazz: 'Barbarian' },
    { name: 'Catti-brie', clazz: 'Fighter' },
    { name: 'Regis', clazz: 'Thief' }
]
const work = [
    { name: 'Cal', clazz: 'Developer' },
    { name: 'John', clazz: 'Developer' },
    { name: 'Jesse', clazz: 'Developer' }
]
```

Let's create a re-usable `map` in Lodash:

```javascript
const getNames = party => map(
    party, 
    person => get(person, 'name')
)
getNames(fortuneWardens)
// [ 'Jesse', 'Brandy', 'Albus' ]
getNames(icewindDale)
// [ 'Jesse', 'Brandy', 'Albus' ]
getNames(work)
// [ 'Cal', 'John', 'Jesse' ]
```

And the same in lodash/fp:

```javascript
const getNames = map(get('name'))
getNames(fortuneWardens)
// [ 'Jesse', 'Brandy', 'Albus' ]
getNames(icewindDale)
// [ 'Jesse', 'Brandy', 'Albus' ]
getNames(work)
// [ 'Cal', 'John', 'Jesse' ]
```

The two `getName` functions are drastically different in size; this should drive home how powerful partial applications and currying are and inspire you to start using lodash/fp. Do more with less code. Ramda & Sanctuary do this by default.

