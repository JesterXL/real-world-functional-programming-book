# Curry and Partial Application

*Warning*: This chapter makes no sense unless you understand how to compose pure functions together. If you don't know what that means, go read [Part 4: Composing Functions](../part4).

Currying, or function currying, is when you make all functions take 1 argument, even those that normally need more. This means if you have a function that takes 2 arguments to do something useful, if you call it with 1 argument, it'll return a function. If you call that returned function with 1 argument, it'll then return the result. It's named after the guy who invented the technique, [Haskell Brooks Curry](https://en.wikipedia.org/wiki/Haskell_Curry). Currying functions is done so they're easier and more flexible to compose.

## How You Do It

Here we have a function that takes an environment such as development, staging, and production as well as a query parameter. Using both, we'll construct a URL for doing text searches.

```javascript
const getSearchURL = (query, environment) =>
    `https://${environment}-server.com/search?query=${query}`
```

You'd normally call it with either the QA or Prod enivronments:

```javascript
getSearchURL('pizza', 'dev') // https://dev-server.com/search?query=pizza
getSearchURL('chicken', 'prod') // https://prod-server.com/search?query=chicken
```

To curry our above function, each function must take 1 parameter. Since our `getSearchURL` takes 2 parameters, we instead need to have it return a function for the first parameter. We can do that with a slight syntax change using arrow functions:

```javascript
const getSearchURL = (query) => (environment) =>
    `https://${environment}-server.com/search?query=${query}`
```

If you're not used to writing short arrow functions, it can be unclear what is going on, so let's show the same thing using function declaration syntax:

```javascript
function getSearchURL(query) {
    return function(environment) {
        return `https://${environment}-server.com/search?query=${query}`
    }
}
```

Whichever version you use, you call it slightly differently than a normal function call:

```javascript
getSearchURL('pizza')('dev') // https://dev-server.com/search?query=pizza
getSearchURL('chicken')('prod') // https://prod-server.com/search?query=chicken
```

It's subtle; if you missed it, it's `getSearchURL('pizza')('dev')` instead of `getSearchURL('pizza', 'dev')`. An imperative version of the above:

```javascript
const searchPizza = getSearchURL('pizza')
const searchPizzaOnDevResult = searchPizza('dev')
console.log(searchPizzaOnDevResult) // https://dev-server.com/search?query=pizza

const searchChicken = getSearchURL('chicken')
const searchChickenOnProdresult =  searchChicken('prod')
console.log(searchChickenOnProdresult) // https://prod-server.com/search?query=chicken
```

## Why Are We Doing This?

Currying can make composing easier by allowing to not have to wrap functions just to simplify their arguments. Let's revist the composition in the last chapter. We had 4 functions to parse some people JSON string into a list of formatted names.

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(parsePeople)
        .then(filterHumans)
        .then(formatNames)
        .then(startCaseNames)
```

## Non-Curried Pipeline

Instead of making a bunch of predicate functions and then assembling together, let's instead do it all in 1 function. We'll build it one at a time. The only change in implementation is 

First, parsing the people and dog JSON string to an Array:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(
            str =>
                JSON.parse(str)
        )
```

Next, filtering out the dog and only keeping the humans:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(
            str =>
                JSON.parse(str)
        )
        .then(
            peeps =>
                peeps.filter(
                    person =>
                        person.type === 'Human'
                )
        )
```

Next, take the humans and strip off their first and last name into a full name in a string:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(
            str =>
                JSON.parse(str)
        )
        .then(
            peeps =>
                peeps.filter(
                    person =>
                        person.type === 'Human'
                )
        )
        .then(
            humans =>
                humans.map(
                    human =>
                    `${human.firstName} ${human.lastName}`
                )
        )
```

Finally, we'll fix the capitalization for their first and last name to ensure the first letter is uppercase:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(
            str =>
                JSON.parse(str)
        )
        .then(
            peeps =>
                peeps.filter(
                    person =>
                        person.type === 'Human'
                )
        )
        .then(
            humans =>
                humans.map(
                    human =>
                    `${human.firstName} ${human.lastName}`
                )
        )
        .then(
            names =>
                names.map(
                    startCase
                )
        )
```

The above function is the same from the previous chapter, just self-contained. There are no functions defined elsewhere. Each `then` has the pure function it needs to take a single output, and return a value for the next function in the chain.

## Too Many Functions

The `JSON.parse` is super easy to integrate because it has 1 argument. Because JavaScript is an untyped language, the whole point of that function is simply for readability:

```javascript
 .then(
    str =>
        JSON.parse(str)
)
```

That reads "Yo, whenever the Promise is done, I'll get a string. We'll take it, throw it into the JSON parser fun wagon, and whatever comes out, you'll get!"

The same thing can be shortened, without the extra, un-needed function like so:

```javascript
 .then(JSON.parse)
```

That results in a modified pipeline that looks like:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            peeps =>
                peeps.filter(
                    person =>
                        person.type === 'Human'
                )
        )
        .then(
            humans =>
                humans.map(
                    human =>
                    `${human.firstName} ${human.lastName}`
                )
        )
        .then(
            names =>
                names.map(
                    startCase
                )
        )
```

Let's keep going to shrink her further using function currying.

## Curried Filter

To shrink things further, we have to whip out the curry. To do that, we cannot utilize the built in `Array.filter` method. Instead, we'll write our own.

```javascript
const filter = predicate => array =>
    array.filter(predicate)
```

A normal Array filter method is like this, only gimme the humans:

```javascript
peeps = [{ type:'Human', name:'Jesse' }, { type:'dog', name:'Albus' }]
peeps.filter(
    peep =>
        peep.type === 'Human'
)
// { type:'Human', name:'Jesse' }
```

Using our curry wrapper, we can do the same thing. First parameter takes a predicate function, the second takes an Array:

```javascript
...
filter
    (peep =>
        peep.type === 'Human')
    (peeps)
...
```

Using the above on the same data:

```javascript
peeps = [{ type:'Human', name:'Jesse' }, { type:'dog', name:'Albus' }]
result = filter
            (peep =>
                peep.type === 'Human')
            (peeps)
console.log(result) // { type:'Human', name:'Jesse' }
```

Ok, that's if we supply 2 parameters; what happens if we supply 1?

```javascript
watThis = filter
    (peep =>
        peep.type === 'Human')
console.log(watThis) // [Function (anonymous)]
```

A function. This function should take an Array that filters out humans:

```javascript
whatThis([ { type:'Human', name: 'Jesse' }, { type:'Cow', name:'Dude' } ])
// [ { type: 'Human', name: 'Jesse' } ]
```

Cool, so that means that is the same as:

```javascript
filter
    (peep =>
        peep.type === 'Human')
    ([ { type:'Human', name: 'Jesse' }, { type:'Cow', name:'Dude' } ])
// [ { type: 'Human', name: 'Jesse' } ]
```

Get it? Give it 1 parameter, it'll return a function. Give it 2, it'll return the filtered Array. Give it 1 parameter which is a predicate function, it'll return a funtion awaiting an Array. Use that returned function with 1 Array parameter, it'll do the work and give you the filtered Array back. Use it with 2 parameters, the first being a predicate function, the second being an Array, it'll do the work and give you the filtered Array back.

## Using Curried Filter

Now that we grok how our curried filter function works and the 2 ways to call it, let's take the old filter:

```javascript
.then(
    peeps =>
        peeps.filter(
            person =>
                person.type === 'Human'
        )
)
```

And replace it with our curried one:

```javascript
.then(
    peeps =>
        filter
            (person =>
                    person.type === 'Human')
            (peeps)
)
```

Notice the duplicated `peeps`, however, this is key. All `Promise.then` take a function that takes only 1 input and expects an output. It just so happens our curried function does that if you only give it 1 parameter. We only need to give it the predicate, the `Promise.then` will give it the `peeps` Array. Refer to the `JSON.parse` example above for the exact same technique. Let's shrink it by removing the extra, un-needed function, and the 2nd parameter:

```javascript
.then(
    filter
        (person =>
                person.type === 'Human')
)
```

Remember, `filter(predicate)` returns a function that's expecting 1 parameter, an Array, and will give you an Array back. Above, `filter(predicte)` returns a function, and the `Promise.then` holds onto it and says "Thank you, when I get a peeps Array, I'll give it to you. Whatever you return back, I'll give the next `.then`".

Our final function looks like:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            filter(
                person =>
                    person.type === 'Human'
            )
        )
        .then(
            humans =>
                humans.map(
                    human =>
                    `${human.firstName} ${human.lastName}`
                )
        )
        .then(
            names =>
                names.map(
                    startCase
                )
        )
```

## Curried Map

Let's wrap `Array.map` the same way:

```javascript
const map = convert => array =>
    array.map(convert)
```
 
For context, here was the old `formatNames`:

```javascript
names = [
    { firstName: 'jesse', lastName: 'warden' },
    { firstName: 'brandy', lastName: 'fortune' }
]
names.map(
    name =>
        `${human.firstName} ${human.lastName}`
)
// [ 'jesse warden', 'brandy fortune' ]
```

And here's the curried version doing the same thing:

```javascript
names = [
    { firstName: 'jesse', lastName: 'warden' },
    { firstName: 'brandy', lastName: 'fortune' }
]
names.map(
    name =>
        `${human.firstName} ${human.lastName}`
)
// [ 'jesse warden', 'brandy fortune' ]
```

We'll replace the first map:

```javascript
.then(
    humans =>
        humans.map(
            human =>
                `${human.firstName} ${human.lastName}`
        )
)
```

With our curried one:

```javascript
.then(
    humans =>
        map
            (human =>
                `${human.firstName} ${human.lastName}`)
            (humans)
)
```

Then we'll remove the extra, un-needed function and the 2nd parameter:

```javascript
.then(
    map
        (human =>
            `${human.firstName} ${human.lastName}`)
)
```

Now our parse function looks like:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            filter
                (person =>
                    person.type === 'Human')
        )
        .then(
            map
                (human =>
                    `${human.firstName} ${human.lastName}`)
        )
        .then(
            names =>
                names.map(
                    startCase
                )
        )
```

## One More Time

The last `map` that fixes the capitalization of the names, since we already created a curried `map` function, we can use again here and change:

```javascript
.then(
    names =>
        names.map(
            startCase
        )
)
```

To a curried version:

```javascript
.then(
    names =>
        map
            (startCase)
            (names)
)
```

And then get rid of the un-needed function, and the 2nd names parameter:

```javascript
.then(
    map
        (startCase)
)
```

That leaves our parsing function looking like:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(
            filter
                (person =>
                    person.type === 'Human')
        )
        .then(
            map
                (human =>
                    `${human.firstName} ${human.lastName}`)
        )
        .then(
            map
                (startCase)
        )
```

If you don't like whitespace like I do and want to smoosh it together, you can re-write it like:

```javascript
const parsePeopleNames = str =>
    Promise.resolve(str)
        .then(JSON.parse)
        .then(filter(person => person.type === 'Human'))
        .then(map(human => `${human.firstName} ${human.lastName}`))
        .then(map(startCase))
```

Be aware, [Prettier](https://prettier.io/), the popular code formatter, favors more of the smooshing and doesn't really support the Lisp-like way of writing JavaScript curried functions shown above. Also, as your JavaScript starts to look more like Lisp/Closure, you may start to get lost lining up all the parenthesis. https://github.com/CoenraadS/Bracket-Pair-Colorizer-2

## Conclusions










