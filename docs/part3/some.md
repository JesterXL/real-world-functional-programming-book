# some: 3 things go in, true or false comes out.

The `some` function takes an Array and a predicate function, and returns `true` if the predicate function returns true for at least 1 of the Array items. Like `every`, it's another Array comprehension built atop `reduce`.

## Old Sk00l for

Let's see if at least one of our party members can act as a Doctor for the other party members in case they get hurt.

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

let atLeast1Healer = false
for(i = 0; i < party.length; i++) {
    const member = party[i]
    if(member.clazz === 'Cleric') {
        atLeast1Healer = true
    }
}
console.log(atLeast1Healer) // true
```

It's `true` because Brandy is a Cleric even though Jesse and Albus are not.

## some

We can purify that by using `some`:

```javascript
const { some } = require('lodash')

const isCleric = member =>
    member.clazz === 'Cleric'

const partyHasAtLeastOneDoctor = party =>
    some(party, isCleric)
```

Because Brandy is a Cleric, the `isCleric` function will return `true` at least once while `some` is looping through all 3 party members.

