
# Composing Lenses

// [jwarden 3.10.2019] TODO: need a larger example at the bottom.

Both Lodash and Ramda have ways of digging deeper into Objects. For Lodash in a `get`, you just keep adding dots or Array accessors. Ramda uses `path` with each item in the `Array` being 1 level deeper into the Object.

## Lodash Deep Get

For example, if we want to see the 2nd characters 2nd inventory item name in Lodash:

```javascript
import get from 'lodash/fp/get'

const name = get('characters[1].inventory[1].name', gameObject)
console.log(name) // White Cape
```

## Ramda Deep Path and Lens

And in Ramda using `path`:

```javascript
import { path } from 'ramda'

const name = path(['characters', 1, 'inventory', 1, 'name'], gameObject)
console.log(name) // White Cape
```

And Ramda's `lensPath`:

```javascript
import { view, lensPath } from 'ramda'

const name = view(
    lensPath(['characters', 1, 'inventory', 1, 'name']), 
    gameObject
)
console.log(name) // White Cape
```

## Focused Compose and Proxy Compose

In Focused, instead of parsing a `String` like Lodash does or looping through an `Array` like Ramda does, Focused makes you explicitly compose them. Think of `prop` like Lodash' `get` or Ramda's `prop` and `index` like Lodash' `nth` or Ramda's `prop`:

```javascript
import { view, compose, prop, index } from 'focused'

const lens = compose(
    prop('characters'),
    index(1),
    prop('inventory'),
    index(1),
    prop('name')
)
const name = view(lens, gameObject)
console.log(name) // White Cape
```

That is super verbose to write, hence the proxy syntax Focused offers; it automatically calls `compose` for you.

```javascript
import { lensProxy, view } from 'focused'

const _ = lensProxy()
const name = view(_.characters[1].inventory[1].name, gameObject)
console.log(name) // White Cape
```
