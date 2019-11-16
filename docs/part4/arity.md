# How Many Arguments Does a Function Take

Function arity refers to how many arguments it takes. Functions in JavaScript are super dynamic, and these rules can differ between other dynamic languages like Python, Lua, and Ruby. It's important to know what arity means when you start talking about curried functions and partial applications.

An arity of 0 means none; "the function doesn't take in any arguments", "the function has no parameters":

```javascript
const alwaysTrue = () => true
alwaysTrue() // true
```

An arity of 1 means one:

```javascript
const sup = name => console.log(`Sup ${name}!`)
sup('Jesse') // Sup Jesse!
```

An arity of 2 means two:

```javascript
const loadWebsite = (request, url) => {
    ...
}
```

... and so on.

## Function.prototype.length

You can test this with Function Declarations, Function Expressions, and Arrow Functions by checking the `length` property of the function.

None:

```javascript
function alwaysTrue() {
    return true
}
alwaysTrue.length // 0
```

One:

```javascript
const sup = function(name) {
    console.log(`Sup ${name}!`)
}
sup.length // 1
```

Two:

```javascript
const loadWebsite = (request, url) => {
    ...
}
loadWebsite.length // 2
```

## Default Arguments

Be aware default arguments will change the `length` property.

```javascript
const loadWebsite = (request, url='http://jessewarden.com') => {
    ...
}
loadWebsite.length // 1
```

Although `loadWebsite` takes 2 parameters, we default the 2nd one to my website. Therefore, the function really only takes 1 parameter, but you can supply a 2nd if you want to, if not we'll just default to a usable value.

If you make them both have defaults, then it will have an arity of 0 "because you don't have to pass both if you don't want to":

```javascript
const loadWebsite = (requestModule=request, url='http://jessewarden.com') => {
    ...
}
loadWebsite.length // 0
```

However, this gets a bit weird if the first has a default, but the 2nd does not:

```javascript
const loadWebsite = (requestModule=request, url) => {
    ...
}
loadWebsite.length // 0
```

While the first parameter has a default, the 2nd does not and is required. Yet, JavaScript sees the default and stops counting.

## arguments and rest

Function Declarations have an `arguments` local variable that refers to the arguments you passed the function:

```javascript
function loadWebsite(request, url) {
    console.log("arguments:", arguments)
}
loadWebsite({ wat: 'fake request'}, 'http://jessewarden.com')
// { '0': { wat: 'fake request' }, '1': 'http://jessewarden.com' }
loadWebsite.length // 2
```

Often used for more dynamic than usual dynamic programming, you can not even declare arguments, and just use the `arguments` object to identify what the user passed into the function call. We'll just remove the arguments, but the function works the same:

```javascript
function loadWebsite() {
    console.log("arguments:", arguments)
}
loadWebsite({ wat: 'fake request'}, 'http://jessewarden.com')
// { '0': { wat: 'fake request' }, '1': 'http://jessewarden.com' }
loadWebsite.length // 0
```

Note although the first version had an arity of `2`, the second has an arity of `0`.

You can do the same using Arrow Functions via rest parameters:

```javascript
const loadWebsite = (...args) => {
    console.log("args:", args)
}
loadWebsite({ wat: 'fake request'}, 'http://jessewarden.com')
// [ { wat: 'fake request' }, 'http://jessewarden.com' ]
loadWebsite.length // 0
```

However, it'll interpret the rest parameters just like default arguments; the function arity is `0`.

## Variadic: Infinite Parameters

A lot of dynamic languages are variadic by default, meaning they take an infinite amount of parameters.

For example, if we want to dynamically add friends to the party, we can:

```javascript
const { reduce, toArray } = require('lodash')

const party = [
    {
        name: 'Jesse',
        clazz: 'Swashbuckler'
    }
]

function addFriendOrFriendsToParty(party) {
    const membersToAdd = toArray(arguments)
    membersToAdd.shift()
    return reduce(
        membersToAdd, 
        (currentParty, member) => {
            return [...currentParty, member]
        },
        party
    )
}
```

Now, we can add 1:

```javascript
addFriendOrFriendsToParty(party, { name: 'Brandy', clazz: 'Cleric' })
// [ { name: 'Jesse', clazz: 'Swashbuckler' },
//   { name: 'Brandy', clazz: 'Cleric' } ]
```

Or... 4:

```javascript
addFriendOrFriendsToParty(
    party, 
    { name: 'Brandy', clazz: 'Cleric' },
    { name: 'Albus', clazz: 'War Dog' },
    { name: 'Robo', clazz: 'Bard' },
    { name: 'Sydney', clazz: 'Mage' }
)
// [ { name: 'Jesse', clazz: 'Swashbuckler' },
//   { name: 'Brandy', clazz: 'Cleric' },
//   { name: 'Albus', clazz: 'War Dog' },
//   { name: 'Robo', clazz: 'Bard' },
//   { name: 'Sydney', clazz: 'Mage' } ]
```

This is built into JavaScript functions of all types. We've intentionally provided arguments to help the user the of function figure out what to pass, however, JavaScript functions work with/without parameters. There is no runtime enforcement of passing too little or too many. Too little, it'll default to `undefined`. Too many, it'll ignore them.

For example, although the `alwaysTrue` function below takes no parameters:

```javascript
const alwaysTrue = () => true
```

... we can still call it with 7 parameters, it'll still work, and we'll still get our expected result back:

```javascript
const result = alwaysTrue(false, 47, new Error('OH LOOK AT THE TIME'), {dat: 'pot pie tho'}, Array, () => {}, Math.Infinity)
console.log(result) // true
```

## Conclusions

Now you can see why functional programming with curried functions doesn't really play well with default arguments, nor variable arguments through `arguments` or rest parameters. Be aware Lodash, Ramda, Folktale, and Sanctuary **do** support some of these edge cases.
