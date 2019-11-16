# Passing Functions To Functions

In many languages, functions are treated as values. You can store them in variables:

```javascript
const yo = () => console.log('yo')
```

And passing them as values to other functions:

```javascript
const yoDude = (greeting, name) => {
    greeting()
    console.log(` ${name}`)
}
yoDude(yo, 'Jesse!')
// yo Jesse!
```

## Extra Functions in Callbacks

This concept is used in [callbacks]. Callbacks are a way to handle asynchronous programming in [non-blocking languages](https://www.youtube.com/watch?v=aVLjh8A6OGU) like JavaScript and sometimes Python and Lua. If a function can't immediately return a value because it could take a while, and the programming language doesn't block, you hand it a function and say "Call this when you're done". This can happen for things you know will take a short while, like making REST calls to a server:

```javascript
const dataReceived = (error, response, body) => console.log("This is what the serer sent back:", body)
request.get('http://jessewarden.com', dataReceived)
```

It can also be for things that could possibly take a long while or never happen, such as a user clicking a button like [JQuery](https://api.jquery.com/) does:

```javascript
$( "#submitButton" ).click( () => alert("Submitted.") )
```

This concept is so common, many developers will define those functions in the function call itself like the JQuery example above, instead of defining them in their own variable like the `request` example above.

However, sometimes developers will create extra functions to be more clear, or because they have used `console.log` around the code for debugging purposes.

```javascript
const showHTML = html => {
    const smallVersion = html.substr(0, 100)
    $(".htmlResponse").html(smallVersion)
}

$.get('http://jessewarden.com', html => showHTML(html))
```

They're creating an extra function in the callback. If you're not actively debugging, there is no need for that extra function. Instead, just put the callback in:

```javascript
$.get('http://jessewarden.com', showHTML)
```

Internally, `$.get` will be in pseudo code:

```javascript
$.get = (url, callback) => {
    // various work
    callback(html)
}
```

Which is basically the same as:

```javascript
$.get = (url) => {
    // various work
    showHTML(html)
}
```

So why provide an extra function that does nothing but call the function?

```javascript
$.get = (url) => {
    // various work
    const extra = html => showHTML(html)
    extra(html)
}
```

## Extra Functions in Promises

In JavaScript, they've borrowed some of the best parts of [Finite State Machines](http://jessewarden.com/2012/07/finite-state-machines-in-game-development.html) and Functional Programming to create `Promises`. They allow you chain together synchronous and asynchronous functions and work great with pure functions.

However, the same problem developers do with creating extra functions in callbacks are worse in Promises, mainly because you'll have a lot more `then` functions to chain additional functions. Inline functions like examples show online for [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) are fine:

```javascript
fetch('http://example.com/movies.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
```

The 2nd `then` could be re-written to this and still do the same exact thing with 1 less function:

```javascript
.then(console.log)
```

However, you could argue it's justified because:

- JavaScript is a dynamic language
- Integrated Development Environments (IDE's) and various text editors used for coding are still bad at helping learn about your code and providing intellisense and code completion
- the documentation is helping you understand what the implied response type is: an `Object` parsed from `response.json()`
- JavaScript isn't a typed like language and there are no type definitions

Other notorious ones:

```javascript
const members = [
    { name: 'Jesse', type: 'human', hitPoints: 12, maxHitPoints: 24 },
    { name: 'Brandy', type: 'human', hitPoints: 11, maxHitPoints: 11 }
    { name: 'Albus', type: 'dawg', hitPoints: 5, maxHitPoints: 9 }
]

const filterHumans = members =>
  filter(member => member.type === 'human', members)
const filterLowHealth = members =>
  filter(member => member.hitPoints !== member.maxHitPoints, members)
```

We've defined some data and 2 functions to parse them in a chain. Watch how their used below, however, inside the `then`'s:

```javascript
Promise.resolve(members)
.then(members => filterHumans(members))
.then(humans => filterLowHealth(humans))
.then(unhealthyHumans => console.log("Unhealthy humans:", unhealthyHumans))
```

Whatever function you put into `then` will be **invoked automatically** with 1 argument it receives. There is no reason for you define another function on top of it to that invokes your function:

```javascript
.then(members => filterHumans(members))
```

Instead, just do:

```javascript
.then(filterHumans)
```

Otherwise, that's basically the same thing as:

```javascript
const filterHumans = members =>
  filter(member => member.type === 'human', members)
const filterHumansAgain = members =>
  filterHumans(members)

.then(filterHumansAgain)
```

Instead, you can just write the whole thing as:

```javascript
Promise.resolve(members)
.then(filterHumans)
.then(filterLowHealth)
.then(unhealthyHumans => console.log("Unhealthy humans:", unhealthyHumans))
```

## Conclusions

While some could argue this is for performance reasons, we bring this up because using curried functions, partial applications, and tacit programming / point free style, you'll commonly provide functions with some or no arguments. Re-defining functions like this can remove your function purity, or accidentally hide what you're trying to do. Being comfortable writing, and more importantly, reading code like the shrunken Promise example above is important to successfully compose functions together. On the other hand, without types, composition operators available in other languages, or familiarity with a library, clearly written parameters can help in readability. Sometimes the extra function is worth it for cognitive load reasons. This is not a hard rule, just awareness of how it works.
