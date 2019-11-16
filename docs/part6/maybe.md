[jwarden 1.8.2019] TODO: Remove some of the chaining stuff perhaps? A lot of examples, not sure the value of multiple... maybe need to sleep (again) on it.

Also, need to show how we can compose using Maybe to make better pipelines... probably belongs in a separate section.

# Maybe

A Maybe is a data type that represents data either being there or not. It's used a lot when you are getting data from effects; loading data from a server, reading from a text file, or environment variables. It can also be used when you're asking for data that might not be there such as searching Array's or keys in Objects. We've covered `get` in [Part 3: get](../part3/get.md) and `getOr` in [Part 5: Tacit Programming](../part5/tacit_programming.md). They are similar to a `Maybe` in practice; maybe this Object exists and has this property, and it isn't `undefined`... maybe not. Where `get` and `getOr` are functions that return data, Maybe is a type that holds data.

Let's import `get` from lodash/fp and `Maybe` from Folktale to compare them. Here we have a `config.json` that has a `serverURL` property (`require` in Node will automatically attempt to `JSON.parse` a JSON file).

```javascript
const { get } = require('lodash/fp')
const Maybe = require('folktale/maybe')

const configFile = require('./config.json')
console.log("configFile:", configFile)
// { "serverURL": "http://cow.com" }
```

The `get` will attempt to read the "serverURL" property from the parsed JSON:

``` javascript
// get
const getServerURL = () =>
    get('serverURL', configFile)

console.log(getServerURL())
// http://cow.com
```

The `Maybe` just holds the response... in a `Just`:

```javascript
// Maybe
const serverURLMaybe = () =>
    get('serverURL', configFile)
    ? Maybe.Just(get('serverURL', configFile))
    : Maybe.Nothing()

console.log(serverURLMaybe())
// folktale:Maybe.Just({ value: "http://cow.com" })
```

When we attempt to read the "pingURL", a non-existent property in the JSON using `get`, we'll get `undefined`:

```javascript
const getPingURL = () =>
    get('pingURL', configFile)

console.log(getPingURL())
// undefined
```

When we do the same with `Maybe`, we get back a `Nothing`:

```javascript
const getPingURLMaybe = () =>
    get('pingURL', configFile)
    ? Maybe.Just(get('pingURL', configFile))
    : Maybe.Nothing()

console.log(getPingURLMaybe())
// folktale:Maybe.Nothing({  })
```

## Easier Usage

A lot of types have sub-types, so if we destructure those, it's a bit easier to read once you've memorized the API.

```javascript
const { Just, Nothing } = Maybe

const getPingURLMaybe = () =>
    get('pingURL', configFile)
    ? Just(get('pingURL', configFile))
    : Nothing()

console.log(getPingURLMaybe())
// folktale:Maybe.Nothing({  })
```

## Array and Object Access

Depending on language, even with strong typing, you can't always ensure at runtime an `Array` or `Object` will have the value/key you need. Here's an Array with 3 items:

```javascript
const friends = ['Steven', 'Albus', 'Cow']
```

To get item 3, you go:
```javascript
friends[2]
// Cow
```

What if you go item 4?

```javascript
friends[3]
// undefined
```

What if you get item 3, but the `Array` is empty?

```javascript
const friends = []
friends[2]
// undefined
```

In [Part 2 - Getting and Setting Data](../part2/README.md), we showed you how using lenses allowed safer data access. However, you could still get `undefined`, and what we really wanted was "is data there or not"? That's where `Maybe` comes in. We'll create a wrapper function to get our data:

```javascript
const getFriend = index =>
  friends[index]
  ? Just(friends[index])
  : Nothing()
```

Here's getting item 3 again:

```javascript
getFriend(2)
// Just('Cow')
```

And the non-existent item 4:

```javascript
getFriend(3)
// Nothing()
```

And the empty array:

```javascript
getFriend(2)
// Nothing()
```

You can use the same technique for `Object`s as well. Here's a Player:

```javascript
const player = {
  rightHand: 'scimitar',
  leftHand: null
}
```

Let's combine `get` and `Maybe` to determine if the player has a weapon equipped in her right hand:

```javascript
const rightHandEquipped = () =>
  get('rightHand', player)
  ? Just(player.rightHand)
  : Nothing()
  
rightHandEquipped() // Just('scimitar')
```

And the left:

```javascript
const leftHandEquipped = () =>
  get('leftHand', player)
  ? Just(player.leftHand)
  : Nothing()
  
leftHandEquipped() // Nothing()
```

## Getting Data Out

There are two ways in Folktale, `getOrElse` and `value`, but value isn't really a public function so use at your own risk (or for debbugging only). The `getOrElse` works like `getOr`; either give me the value, else if it's `undefined` or `null`, give me the default I provide.

```javascript
const maybeServerURL = Just('http://cow.com')
const serverURL = maybeServerURL.getOrElse('http://localhost:8080')
console.log(serverURL) // http://cow.com

const maybePingURL = Nothing()
const pingURL = maybePingURL.getOrElse('http://localhost:3000/ping')
console.log(pingURL) // http://localhost:3000/ping
```

## Chaining Maybes

A Promise chain with a bunch of thens will continue modifying the data until the last then. A flow/compose chain will do the same thing. What a Promise chain, and a Maybe chain, have in common, however, is the abort concept. If any one of the Promises error, all the subsequent `then`'s aren't run, and the `catch` is fired with what rejected the chain. Maybe is similar in that all returned `Just`'s will continue, but a returned `Nothing` will abort the chain.

Here's a chain of Promises that modify data on down the line:

```javascript
Promise.resolve('warden jesse')
.then(name => Promise.reject(new Error('b00m b00m')))
.then(name => name.reverse())
.then(name => startCase(name))
.then(name => console.log("name:", name))
.catch(boom => console.log("boom:", boom))
// Jesse Warden
```

The same chain, but with an error in the first `then`:

```javascript
Promise.resolve('warden jesse')
.then(name => Promise.reject(new Error('b00m b00m')))
.then(name => name.reverse())
.then(name => startCase(name))
.then(name => console.log("name:", name))
.catch(boom => console.log("boom:", boom))
// boom: Error: b00m b00m
```

Maybe's can be chained in a similar way:

```javascript
console.log(
    Just('warden jesse')
    .chain(name => Just(name.split(' ')))
    .chain(name => Just(name.reverse()))
    .chain(name => Just(startCase(name)))
    .getOrElse('parsing failed, brah')
)
// Jesse Warden
```

And a `Nothing` will abort the chain, just like a rejected `Promise` will abort a Promise chain:

```javascript

console.log(
    Just('warden jesse')
    .chain(name => Nothing())
    .chain(name => Just(name.reverse()))
    .chain(name => Just(startCase(name)))
    .getOrElse('parsing failed, brah')
)
// parsing failed, brah
```

Just remember to return a `Maybe` to keep the chain going. A Promise is flexible in that you can return any value or a `Promise`; it supports both whereas `chain` only supports returning a `Maybe`.

## Changing The Value

You can also change the value instead using `map` which works like an Array's map:

```javascript
console.log(
    Just('warden jesse')
    .map(name => name.split(' '))
    .map(name => name.reverse())
    .map(name => startCase(name))
    .getOrElse('parsing failed, brah')
)
// Jesse Warden
```

Just be aware it is mapping the value, so it doesn't handle errors, or handle `Nothing`... it's just a `map`:

```javascript
console.log(
    Just('warden jesse')
    .map(name => Nothing()) // Nothing doesn't have a reverse method...
    .map(name => name.reverse())
    .map(name => startCase(name))
    .getOrElse('parsing failed, brah')
)
// TypeError: name.reverse is not a function
```

## Error Handling

You can use `Maybe`'s to represent data that might work. However, instead of getting a default value, you may want to run a function, just like you do in a Promise's `catch` function. You can use `orElse`.

It's ignored if it succeeds with a `Just`:

```javascript
console.log(
    Just('warden jesse')
    .chain(name => Just(name.split(' ')))
    .chain(name => Just(name.reverse()))
    .chain(name => Just(startCase(name)))
    .orElse(() => {
        console.log('Parsing failed.')
        return false
    })
)
// folktale:Maybe.Just({ value: "Jesse Warden" })
```

If any return a `Nothing`, it'll fire the `orElse`:

```javascript
console.log(
    Just('warden jesse')
    .chain(name => Just(name.split(' ')))
    .chain(name => Just(name.reverse()))
    .chain(name => Just(startCase(name)))
    .orElse(() => {
        console.log('Parsing failed.')
        return false
    })
)
// false
```

## Pattern Matching

If you want to react to both, you can use Pattern Matching via `matchWith`. It's a flexible function, acting like an if/else, and you can return whatever you want from the matcher Object you pass in, and you can ignore the `value` passed in from the `Just` as well:

```javascript
const maybeCow = Just('cow')
const result = maybeCow.matchWith({
    Just: ( { value } ) => `We have a value: ${value}`,
    Nothing: () => 'No cow... sadness.'
})
console.log(result)
// We have a value: cow

const hopefullyNotNothing = Nothing()
const ohNo = hopefullyNotNothing.matchWith({
    Just: () => `Dark sequel, man...`,
    Nothing: () => 'Say my name, Bastion!'
})
console.log(ohNo)
// Say my name, Bastion!
```

You can end cap your long chains for `Just`:

```javascript
console.log(
    Just('warden jesse')
    .chain(name => Just(name.split(' ')))
    .chain(name => Just(name.reverse()))
    .chain(name => Just(startCase(name)))
    .matchWith({
        Just: ({value}) => `Parse result: ${value}`,
        Nothing: () => 'Parsing failed.'
    })
)
// Parse result: Jesse Warden
```

... as well as long chains for `Nothing`:

```javascript
console.log(
    Just('warden jesse')
    .chain(name => Nothing())
    .chain(name => Just(name.reverse()))
    .chain(name => Just(startCase(name)))
    .matchWith({
        Just: ({value}) => `Parse result: ${value}`,
        Nothing: () => 'Parsing failed.'
    })
)
// Parsing failed.
```

## Conclusions

Whenever you are getting data from an outside source of your code like servers, files, and environment variables, `Maybe` is a great return value choice. When calling functions that may not have the data you're looking for, like looking in Array's or for specific key/values in Objects, Maybe is a much safer, and easier to work with return value, than `undefined`, `null`, or `-1`. [Learn more](https://folktale.origamitower.com/api/v2.3.0/en/folktale.maybe.html) from the Folktale `Maybe` documentation. 