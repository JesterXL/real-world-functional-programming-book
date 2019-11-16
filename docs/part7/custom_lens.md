
# Creating a Custom Lens

// [jwarden 3.10.2019] TODO/FIXME: I found this a bit hard to follow coming back after a couple months. We should probably run the code as you write it.

Using this basic isomorphism concept and the `compose` function, you can combine the reading and writing of the file together to its own lens. While a `Buffer` that comes from reading a file, turned into `String`, then an `Object`, then back again is also an isomorphism, we need some information about the original Object so we'll just create a custom lens.

## Lens Function: Getter

Like `iso`, a `lens` function's first parameter is a getter, and the function's signature is basically a `map` function; take in some data as a single parameter, return some transformed data. The `readFileSync` is straightforward; if you give it a filename, it'll return the contents of that file, hence we just give it the function as the first parameter:

```javascript
import { ..., lens } from 'focused'

const fileLens = lens(
    readFileSync,
    ...
)
```

## Lens Function: Setter

The `writeFileSync` however takes 2 parameters; the filename and contents, yet returns nothing. If we supply a simple wrapper, pre-filling the 1st parameter:

```javascript
import { ..., writeFileSync } from 'fs'

const fileLens = lens(
    readFileSync,
    (data, originalData) => writeFileSync('savedgame.json', data)
)
```

Better, but one problem; the setter part of the lens is supposed to be a `map` function and return what it set. Since `writeFileSync` is mainly about side effects, specifically writing the file, it doesn't return anything and throws if it fails. Very imperative and not what we need. Let's modify it and just return the data you wrote for now. Since `writeFileSync` always returns `undefined`, the short circuit `||` will always return `data`.

```javascript
const fileLens = iso(
    readFileSync,
    (data, originalData) => writeFileSync('savedgame.json', data) || data
)
```

## Composing Lenses

Internally, Focused uses its own `compose` method to combine all the lenses together. Our `set`:

```javascript
set(_.$(jsonISO).saveDate, ...
```

Without the proxy syntax could be written as:

```javascript
const { ..., prop, compose } = require('focused')

const lens = compose(
    jsonISO,
    prop('savedDate')
)
const updated = set(lens, new Date(), gameState)
```

Let's do that so we can combine our `fileLens` first, then our `jsonISO` 2nd:

```javascript
const readAndParseLens = compose(
  fileLens,
  jsonISO
)
```

## Using Our Custom Lens

And we can still keep our proxy syntax with `savedDate`. Notice we give it the filename instead of the `gameState` as the 3rd parameter:

```javascript
const updatedString = set(_.$(readAndParseLens).saveDate, new Date(), 'savedgame.json')
```

Logging out the `String`:

```json
{ "saveDate": "2018-11-25T21:24:58.726Z",
    "map": "overworld",
    "chapter": 3,
    ...
```

And to verify the side effect of writing the file worked, the contents of the file:

```json
{ "saveDate": "2018-11-25T21:24:58.726Z",
    "map": "overworld",
    "chapter": 3,
    ...
```

## Enhancing Our Custom Lens

When saving games, you have many saved games. We're using our "savedgame.json" as a template, but then writing over it every time. Our custom lens even hardcodes "savegame.json" inside of it. What we want is to have a new filename each time we set the `saveDate`, and have that be part of the filename to make sorting easier and ensure unique filenames.

My kids date hack on various games such as [Animal Crossing](http://www.animal-crossing.com/); meaning they manually change the video game console's system clock backwards and forwards so they don't have to wait in the real world. This results in the game rewarding them "earlier" than it should, and allowing them to experience special days whenever they want by travelling to the future in game time. This also means using a date as a filename could have collisions, so we'll enhance our lens to use a unique string from a Universal Unique Identifier via the [uuid library](https://www.npmjs.com/package/uuid) to prevent those collisions. Date hacking should be allowed and shouldn't result in them accidentally overwriting saved games. Although writing files is a side effect, we'll attempt to keep it as immutable as possible.

From our original lens function:

```javascript
const fileLens = iso(
    readFileSync,
    (data, originalData) => writeFileSync('savedgame.json', data) || data
)
```

Let's utilize the 2nd parameter of our lens setter, the `originalData` which is the filename you passed in to read, `savedgame.json`:

```javascript
import uuidv4 from 'uuid/v4'
...
    (data, originalData) => {
        const filename = 
            originalData
            .split('.json')
            .join('')
        const dataJSON = JSON.parse(data)
        const newFilename = `${filename}_${dataJSON.saveDate}_${uuidv4()}.json`
        writeFileSync(newFilename, data)
        return newFilename
    }
...
```

Nice, now each time we run her, we'll get a new filename generated and written to, using our template read-only, even with date hacking:

```javascript
const updatedString = set(_.$(readAndParseLens).saveDate, new Date(), 'savedgame.json')
// savedgame_2018-11-26T00:21:47.141Z_26ca739b-7e86-4a4d-9363-f63f8e3828e6.json
```

And the data inside:

```json
{ "saveDate": "2018-11-26T00:21:47.141Z",
    "map": "overworld",
    "chapter": 3,
    ...
```