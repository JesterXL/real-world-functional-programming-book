# Isomorphisms

If a thing can change into something different, but then change back, then those two things are isomorphic.

One example is JSON. You can have a JSON string that turns into a JSON Object via `JSON.parse`, but then can turn back into the exact same string again via `JSON.stringify`. In working with legacy systems such as [XML SOAP](https://en.wikipedia.org/wiki/SOAP) we'll often convert those large XML structures to JSON, and then back again to XML SOAP. If you're familiar with the [Memento Design Pattern](https://en.wikipedia.org/wiki/Memento_pattern), it's kind of like that.

If you're building a game and want to save it, you'll typically implement the Memento design pattern to create a small `Object` that represents the game state as it is right now, and then write that to disk as a file, and possibly sync to a cloud server as well. When loading the game, that `Object` has all the information you need to load the correct level, character stats, and place in the story the player should resume at.

The only thing that isn't deterministic about save games is the date they were created. Most games will sort the save games by latest so when you click "Continue", it'll load your latest saved game. This includes games that have an Autosave feature. When you save a new game, it'll make that the latest save by updating the date to "right now".

We can implement this feature as purely as possible using lenses to give you an example of using isomorphisms in practice. Below we'll walk through saving a game and then loading a save game below using the [Focused](https://github.com/yelouafi/focused) library as it has support for isomorphisms and an easier way to compose lenses together.

Be aware Focused has 2 ways to use it; using the facade api which is magic af, or the explicit API which looks a lot more like [Ramda]. We'll show both, although the proxy option is one of `focused`'s selling points over Ramda for advanced Optics. Also note most functions in `focused` are curried by default and support the regular function way of calling them (`set(lens, value, object)`) as well as a single argument per function cal (`set(lens)(value)(object)`).

## Basic Set

Our game object looks like so, containing where the player is in the game's story, the map location, x and y tile coordinates, and the current protagonists in the party with their inventory.

```javascript
const gameState = {
    saveDate: '2018-11-24T18:27:08.950Z',
    map: 'overworld',
    chapter: 3,
    location: { x: 323, y: 422 },
    characters: [
        {
            name: 'Jesse',
            level: 21,
            attack: 510,
            magic: 122,
            inventory: [
                {
                    name: 'Scimitar',
                    power: 3
                },
                {
                    name: 'Mithral Glove',
                    defense: 21
                }
            ]
        },
        {
            name: 'Brandy',
            level: 22,
            attack: 501,
            magic: 210,
            inventory: [
                {
                    name: 'Green Rod',
                    magic: 19
                },
                {
                    name: 'White Cape',
                    defense: 11
                }
            ]
        }
    ]
}
```

First, we need to import focused's proxy. Like how some developers use Lodash, they'll assign it to an underscore to make it small and easy to use:

```javascript
import { lensProxy } from 'focused'

const _ = lensProxy()
```

Next, let's import `set` to update our `Object` much like we'd do in Lodash or Ramda. Notice, however, the use of `_` and dotting properties; that is how you create a basic `prop` or `get` lens using Focused's proxy api. Specifically the `_.saveDate` below would be `get('saveDate')` in Lodash:

```javascript
import { ..., set } from 'focused'

const updated = set(_.saveDate, new Date(), gameState)
```

If we log out `updated`, you'll see she works just like [a set in Lodash](../part2/set.md) and gives you back a new Object with the `saveDate` to whatever time it is right now:

```javascript
{ saveDate: '2018-11-25T18:17:44.214Z',
  map: 'overworld',
  chapter: 3,
  ...
```

## Basic Isomorphism

However, the game object is often read from disk as text. Meaning, you'd have to parse it using `JSON.parse`:

```javascript
import { readFileSync } from 'fs'

const savedGameString = readFileSync('savedgame.json')
const gameState = JSON.parse(savedGameString)
```

Then make your changes and convert it back to text using `JSON.stringify`:

```javascript
const updated = set(_.saveDate, new Date(), gameState)
const gameStateString = JSON.stringify(updated)
```

Converting data back and forth is so common, like `map`, that Focused has an Isomorphism function called `iso`:

```javascript
const { ..., iso } = require('focused')

const jsonISO = iso(JSON.parse, JSON.stringify)
```

Now, we can collapse those 3 lines of code above to:

```javascript
const savedGameString = readFileSync('savedgame.json')
const updatedString = set(_.$(jsonISO).saveDate, new Date(), savedGameString)
```

Logging out the `updatedString` string, it looks like:

```json
{ "saveDate": "2018-11-25T18:51:09.227Z",
    "map": "overworld",
    "chapter": 3,
    ...
```

## Conclusions

Isomorphisms are used when you convert data back and forth. It happens often in places like Orchestration API's where you have a [back-end for your front-end](https://samnewman.io/patterns/architectural/bff/). The Node API will call a SOAP service and translate the XML to JSON. If the user does something that we need to update in the back-end, we'll convert the JSON from the front-end application to XML and call the SOAP service again. Reading and writing JSON files to disk like in the above save game example is another. I've used it at work to update the `proxy` url in `package.json` for [Create React App's proxy feature](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development) since we have multiple environments. If you're dealing with any relational databases, this pattern [can also help you a lot there](https://enterprisecraftsmanship.com/2016/11/03/oop-fp-and-object-relational-impedance-mismatch/).
