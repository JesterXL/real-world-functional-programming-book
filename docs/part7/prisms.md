# Prisms

A prism is an isomorphism that is [total](../part7/total_functions.md). Meaning, if `JSON.parse` fails, it doesn't throw an Error in our lens. Let's update our `jsonISO` we created in [Part 8's Isomorphism](isomorphisms.md) from a partial iso to a total iso. We take what we learned from [Part 7 on total functions](../part7/README.md) and make our Isomorphism total-ish. We don't have to worry, for now, about going back (i.e. the setter `JSON.stringify`), just the getter (`JSON.parse`).

## From Partial To Total

Instead of using our existing isomorphism:

```javascript
const jsonISO = iso(JSON.parse, JSON.stringify)
```

Instead, we'll create a new one that has basic error handling, and return `null` if it doesn't work:

```javascript
import { simplePrism } from 'focused'

const jsonPrism = simplePrism(
    string => {
        try {
            return JSON.parse(string)
        } catch (error) {
            return null
        }
    }, 
    JSON.stringify
)
```

Testing it out with a good string:

```javascript
const savedGameString = readFileSync('savedgame.json')
const updatedString = set(_.$(jsonPrism).saveDate, new Date(), savedGameString)
```

... it works the same:

```json
{ "saveDate": "2018-11-25T23:32:41.887Z",
    "map": "overworld",
    "chapter": 3,
    ...
```

However, notice if you give bad JSON that would cause `JSON.parse` to fail:

```javascript
set(_.$(jsonISOMaybe).saveDate, new Date(), '🐮')
// 🐮
```

... it just acts like an `identity` function, and gives you back the source string.
