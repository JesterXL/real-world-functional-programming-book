# Known Knowns, and Known Unknowns

Function currying won't help you unless the arguments are in a good order. There are often known dependencies, despite the fact you have to declare it as a function argument. Yes, a function must say "I need you to give me the `fetch` module as a function parameter vs. me referencing the import as a function closure".

... however, we all know, if you're building browser applications today to make http REST calls, you'll be using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch).

... however, we all **DON'T** know what URL's we'll be using yet.

```javascript
// request will be require('request')
// url... well... you have to call it for us to know...
const loadWebsite = (request, url) => ...
```

Knowns and unknowns.

While we have to follow the pure function rules and define the dependencies, some of them we may know what'll they'll end up being, like, forever.

## Left Knowns, Right Unknowns

The known things, or things that are static and unchanging you typically want to put to the left (first) in the function arguments. The dynamic things, or things you won't know until the last possible moment, you put to the right (last).

You've seen our `loadWebsite` function from before, let's make a browser ES6 version that compensates for older browsers:

```javascript
import fetch from 'cross-fetch'

const loadJSON = (fetch, url) =>
    fetch(url)
    .then(response => response.json())
```

Here's the closure version:

```javascript
const loadJSONWithFetch = url => loadJSON(fetch, url)
```

Here's the curried version:

```javascript
const loadJSON = fetch => url =>
    fetch(url)
    .then(response => response.json())

const loadJSONWithFetch = url => loadJSON(fetch) 
```

**Known**: `fetch` will be used.

**Unknown**: `url`, we don't know what it is yet.

Both bake in the `fetch` since we know we'll be using that class; we're just following pure function rules.

... however, watch what happens if we put the dynamic stuff to the left, and the known stuff to the right.

```javascript
const loadJSON = (url, fetch) =>
    fetch(url)
    .then(response => response.json())
```

For the closure, it still works, we just move `url` first, and `fetch` second:

```javascript
const loadJSONWithFetch = url => loadJSON(url, fetch)
```

For the curried function, though... it doesn't work at all:

```javascript
const loadJSON = url => fetch =>
    fetch(url)
    .then(response => response.json())

const loadJSONWithFetch = url =>loadJSON(url)(... er... what the heck goes here...)
```

You'd have to know the URL first before you can call it again with `fetch`. Could we use a closure to fix it?

```javascript
const loadJSONWithFetch = url => loadJSON(url)(fetch)
```

Score one for closures. As you can see, curried functions aren't forgiving when dynamic stuff is left, and known stuff is right. This is compounded when you have a lot more arguments.

## Practice Makes Perfect

Don't fret if you continually refactor argument order until it feels right, it'll develop as a habit with practice. Like with [muscle memory](https://en.wikipedia.org/wiki/Muscle_memory) that you learn from physical sports and exercise. Muscle memory is actually a cache of common movement tasks your brain stores for quick access. The more you do it, the more your brain caches & improves how quickly and easily you can do the movement on instinct, without thinking. So too with parameter order. Your brain will "know" which ones to put first and which ones to put further right in real-time.
