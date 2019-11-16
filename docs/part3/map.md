# Map: 3 things go in, 3 new things come out

The `map` function is often used for parsing operations. You have a list of data, and you want all items in it modified the same way, and put back in the same spot they currently are.

## Old Sk00l for

Let's do that using the native `for` loop first, then show the map equivalent. We'll take an Array of strings and convert it to people objects.

```javascript
const peopleFields = [
    ["jesse warden", "123 Cow Ville", ["123-555-1234", "999-555-8234"], "human"],
    ["brandy fortune", "123 Cow Ville", ["123-867-5309"], "human"],
    ["albus dumbledog", "92 Dog Down", ["123-555-1234"], "dawg"]
]

const len = peopleFields.length
for(i = 0; i < len; i++) {
    const fields = peopleFields[i]
    peopleFields[i] = {
        name: fields[0],
        address: {
            street: fields[1],
            phone: fields[2]
        },
        type: fields[3]
    }
}
```

Printing it, you see it's replaced the Arrays of Strings with Arrays of people Objects:

```javascript
console.log(peopleFields)
[ { name: 'jesse warden',
    address: { street: '123 Cow Ville', phone: [Array] },
    type: 'human' },
  { name: 'brandy fortune',
    address: { street: '123 Cow Ville', phone: [Array] },
    type: 'human' },
  { name: 'albus dumbledog',
    address: { street: '92 Dog Down', phone: [Array] },
    type: 'dawg' } ]
```

## New School forEach

Cool, let's use the same code, but using the native `forEach` Array method:

```javascript
const mutateArrayToPerson = (fields, index, array) => {
    array[index] = {
        name: fields[0],
        address: {
            street: fields[1],
            phone: fields[2]
        },
        type: fields[3]
    }
}
peopleFields.forEach(mutateArrayToPerson)
```

Logging it out we get the same result:

```javascript
[ { name: 'jesse warden',
    address: { street: '123 Cow Ville', phone: [Array] },
    type: 'human' },
  { name: 'brandy fortune',
    address: { street: '123 Cow Ville', phone: [Array] },
    type: 'human' },
  { name: 'albus dumbledog',
    address: { street: '92 Dog Down', phone: [Array] },
    type: 'dawg' } ]
```

Tighter code, but risky with the dot, and mutates data.

## map

Let' s crate a pure function to parse the Array:

```javascript
const arrayToPerson = array =>
    ({
        name: array[0],
        address: {
            street: array[1],
            phone: array[2]
        },
        type: array[3]
    })
```

Take an Array and return a Person object. Let's test it out:

```javascript
console.log(arrayToPerson(peopleFields[0]))
{ name: 'jesse warden',
  address:
   { street: '123 Cow Ville',
     phone: [ '123-555-1234', '999-555-8234' ] },
  type: 'human' }
```

Great, now `map` can use that function on the entire list:

```javascript
import { map } from 'lodash'

console.log(map(peopleFields, arrayToPerson))
[ { name: 'jesse warden',
    address: { street: '123 Cow Ville', phone: [Array] },
    type: 'human' },
  { name: 'brandy fortune',
    address: { street: '123 Cow Ville', phone: [Array] },
    type: 'human' },
  { name: 'albus dumbledog',
    address: { street: '92 Dog Down', phone: [Array] },
    type: 'dawg' } ]
```

While we defined the function separately for unit testing purposes, you can write anonymous functions inline as well:

```javascript
const names = ['jesse warden', 'brandy fortune', 'albus dumbledog']

map(
    names, 
    name =>
        name.toUpperCase()
)

["JESSE WARDEN", "BRANDY FORTUNE", "ALBUS DUMBLEDOG"]
```

Instead of:

```javascript
const uppercaseName = name =>
    name.toUpperCase()
map(names, uppercaseName)
```

## Conclusions

Map: Take an Array of things in, give each thing to a function, store whatever that function gives you back in a new Array in the same position, then return that new Array back. The `map` function expects a pure function, and is itself a pure function.
