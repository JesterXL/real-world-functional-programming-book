# every: 3 things go in, true or false comes out

The `every` function takes an `Array` and a predicate function (a function that only returns `true` or `false`). It returns `true` if every item that's given to the predicate returns `true`, else `false`. It's a great example of an Array comprehension that is built upon `reduce`. It's used a lot in data validation.

Think of `every` as asking "Is everything true that ___". The blank is whatever your predicate function is figuring out to be true or not based on the input.

## Old Sk00l for

Let's verify everyone in our party has full health or not. Hit points are a measurement using numbers of a person's health. If your current hit points equal your max, then you're healthy. If their half, you're seriously injured or sick. Not the good sick, the bad sick.

```javascript
const party = [
    {
        name: 'Jesse',
        clazz: 'Swashbuckler',
        hitPoints: 20,
        maxHitPoints: 22
    },
    {
        name: 'Brandy',
        clazz: 'Cleric',
        hitPoints: 14,
        maxHitPoints: 14
    },
    {
        name: 'Albus',
        clazz: 'War Dog',
        hitPoints: 5,
        maxHitPoints: 9
    }
]

let allHealthy = true
for(i = 0; i < party.length; i++) {
    const member = party[i]
    if(member.hitPoints < member.maxHitPoints) {
        allHealthy = false
    }
}
console.log(allHealthy)
```

It's `false` because Brandy is the only one healthy. Note the use of a variable, mutation of it later in the loop.

## every

We can purify that by using `every`:

```javascript
const { every } = require('lodash')

const memberIsHealthy = member =>
    member.hitPoints >= member.maxHitPoints

const partyIsHealthy = party =>
    every(party, memberIsHealthy)

partyIsHealthy(party) // false
```

"If I give every party member to `memberIsHealthy`, does it return `true` for every single Array item?"

## Data Validation

You can combine other predicates to validate data. In dynamic languages, since we don't have types, we may sometimes want to validate a piece of data we didn't make, say something coming from a parsed REST response or from reading a file.

Here, we'll write some predicates to verify our new party member really is a party member, then we'll use `every` to ensure all are `true`. If even one fails and returns `false`, we want to know about it.

The predicates:

```javascript
import { isString, isInteger, get } from 'lodash'

const hasLegitName = o =>
    isString(get(o, 'name'))
    && get(o, 'name').length > 0

const legitHitPoints = o =>
    isInteger(o)
    && o >= 0

const hasLegitHitPoints = o =>
    legitHitPoints(get(o, 'hitPoints'))

const hasLegitMaxHitPoints = o =>
    legitHitPoints(get(o, 'maxHitPoints'))
```

Now we'll load them into `every`:

```javascript
const legitPerson = o =>
    every(
        [
            hasLegitName,
            hasLegitHitPoints,
            hasLegitHitPoints
        ],
        predicate => predicate(o)
    )

legitPerson({
    name: 'Rowan',
    clazz: 'Bard',
    hitPoints: 4,
    maxHitPoints: 4
}) // true
legitPerson({
    name: 'Chicken Pot Pie'
}) // false
```

##  Conclusions

Every: Take an Array of things as well as a predicate function, give every value to the predicate function, and if even one returns false, then `every` will return false, else return `true`.
