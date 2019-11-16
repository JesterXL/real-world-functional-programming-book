# get or prop

The safe way to access `Objects` is to create a get function. For objects you know the shape of, meaning you know what properties and value types they typically have, you can create these yourself.

```javascript
const getFirstName = person => {
    if(person) {
        return person.firstName
    }
    return undefined
}
```

Then you can test it to verify it's safe:

```javascript
expect(getFirstName(person)).to.equal('Jesse')
expect(getFirstName(undefined)).to.equal(undefined)
```

This is such a common thing to do that [Lodash](https://lodash.com/docs/4.17.10#get) has a `get` function, [Ramda](https://ramdajs.com/docs/#prop) and Sanctuary have [prop](https://sanctuary.js.org/#prop).

```javascript
import { get } from 'lodash'

console.log(get(person, 'firstName')) // Jesse
console.log(get(person, 'fistName')) // undefined
console.log(get(undefined, 'firstName')) // undefined
```

## Dem Deep Gets

Deeply nested properties, however, require null or [null operators](https://github.com/tc39/proposal-nullish-coalescing):

```javascript
const getStreetAddress = person => {
    if(person && person.address && person.address.home) {
        return person.address.home.street
    }
    return undefined
}
```

Using the operator could be re-written as:

```javascript
const getStreetAddress = person =>
    person.address?.home?.street
```

It's less code and safer just to use `get` with the path:

```javascript
const getStreetAddress = person =>
    get(person, 'person.address.home.street')
```

Now those are just Objects. Arrays require you to do runtime type checking:

```javascript
const getFirstHomePhone = person => {
    if(
        person 
        && person.address 
        && person.address.home 
        && Array.isArray(person.address.home.phone)
        ) {
        return person.address.home.phone[0]
    }
    return undefined
}
```

... or you could just use `get`:

```javascript
const getFirstHomePhone = person =>
    get(person, 'person.address.home.phone[0]')
```

This also works great for deeply nested JSON data structures you often get back from REST API's as well as SOAP and XML you've parsed to JSON.

## Default Values

You'll often configure your Node API using the [config](https://github.com/lorenwest/node-config) library. One thing you'll run into when configuring for different development environments like dev, qa, and prod is default values in case the configuration intentionally doesn't exist. In the browser, if you run into configuration errors, you just fall back to the defaults so the application still works. 

You can do that using `get` or [Ramda's propOr](https://ramdajs.com/docs/#propOr):

```javascript
const url = get(configuration, 'services.emailURL', 'http://dev.server.com/email')
```

If it can't find the `services.emailURL` path on `configuration`, or if `configuration` is `undefined`, it'll just default to that dev url, 'http://dev.server.com/email'.

## Conclusions

Using `get` ensures you never have errors. The `Object` can change it's property names on you, or even be `undefined`, but your program still won't have errors. It also helps you avoid error prone, verbose null checks and results in smaller code. As we'll see in future chapters, using this `get` function will allow us to compose her very flexibly into a variety of ways.