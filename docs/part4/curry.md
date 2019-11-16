# Curry: All Functions Take 1 Argument

Function currying was originally created to make functions easier to work in math equations. In real world functional programming, you use them to:

- shorten how many arguments a function requires
- write less code
- create reusable functions from other functions
- write in point free style
- expose useful functions for developers using our code
- make it easier to create partial applications so you can more easily compose functions

// [jwarden 3.10.2019] Redo this section. It has some good parts, but needs a do-over.

## Manual Currying

Let's manually curry an existing function. If you want to make a GET call using the pure function below, you need 2 parameters:

```javascript
const loadWebsite = (request, url) =>
    new Promise( ( success, failure ) )
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
```

If we call it, you have internet, and my website isn't broken again, you'll get gallons of HTML back, so I do just the 15 characters to show the doctype tag:

```javascript
const request = require('request')
loadWebsite(request, 'http://jessewarden.com')
.then(html => console.log(html.substring(0, 15)))
.catch(error => console.log("error:", error))
// <!DOCTYPE html>
```

To curry it, we need to ensure all functions only take 1 parameter. If a function, like our `loadWebsite` needs 2 to do something useful, it'll return a function for the 1st parameter, and then the `Promise` for the 2nd since that function returns a `Promise`:

```javascript
const loadWebsite = (request) => (url) =>
        new Promise( ( success, failure ) =>
            request.get(url, (error, response, html) =>
                error
                ? failure(error)
                : success(html)
            )
        )
```

I've kept the parenthesis to help you visualize we're creating a series of functions that only have 1 argument. Same function, we've just changed this:

```javascript
const loadWebsite = (request, url) =>
```

To this:

```javascript
const loadWebsite = (request) => (url) =>
```

Let's call it with 1 argument:

```javascript
const newFunctionCallWhoDis = loadWebsite(request)
console.log("wat the:", newFunctionCallWhoDis)
// wat the: (url) =>
//         new Promise( ( success, failure ) =>
//             request.get(url, (error, response, html) =>
//                 error
//                 ? failure(error)
//                 : success(html)
//             )
//         )
```

Cool, it's a function that takes a url and will make a request. Notice the `request` is nowhere to be found in the function arguments. In dynamic languages, there's a trick to store variables that a function can access without defining them called "closures". You can read more about this in [Part 4 - Closures and Immutability](closures_and_immutability.md).

Let's call that returned function:

```javascript
const result = newFunctionCallWhoDis('http://jessewarden.com')
console.log("result:", result)
// result: Promise { <pending> }
```

That function when called returns us a `Promise` and makes an HTTP call. First parameter gives us a function, calling that function with the URL _actually does the work_.

Can we call that on 1 line?

```javascript
loadWebsite(request)('http://jessewarden.com')
.then(html => console.log(html.substring(0, 15)))
.catch(error => console.log("error:", error))
// <!DOCTYPE html>
```

Same result as before. When dealing with curried functions, they only ever take 1 argument, so call them like that.

Old function that had 2 arguments was called like this using only 2 parenthesis and a comma:

```javascript
loadWebsite(request, 'http://jessewarden.com')
```

New, curried function is called like this using 4 parenthesis and no comma:

```javascript
loadWebsite(request)('http://jessewarden.com')
```

## Functions Returning Functions

You may not be used to functions returning functions. In many programming languages, functions are treated just like variables.

```javascript
const name = 'Jesse'
const singSong = () => {
    console.log('🎶 Copy Pasta Coding 🎶')
    setTimeout(() => {
        console.log("... for the win.")
    }, 1000)
}

const whoDat = (name, song) => {
    console.log("name is:", name)
    // song is a function, whatever you
    // pass in, this function will call it
    // with no arguments
    song()
}

whoDat(name, singSong)
// name is: Jesse
// 🎶 Copy Pasta Coding 🎶
// ... for the win.
```

Note whether we pass a function a `String` or a `Function`, it's cool with either. Same goes for return values:

```javascript
const sayMyName = name => {
    const youAreAwesome = () => {
        console.log(`${name} is...
        
        _______ _  _  _ _______ _______  _____  _______ _______
        |_____| |  |  | |______ |______ |     | |  |  | |______
        |     | |__|__| |______ ______| |_____| |  |  | |______
`)
    }
    return youAreAwesome
}

const PowerMan = sayMyName('Luke Cage')
PowerMan()
/*
Luke Cage is...

        _______ _  _  _ _______ _______  _____  _______ _______
        |_____| |  |  | |______ |______ |     | |  |  | |______
        |     | |__|__| |______ ______| |_____| |  |  | |______
*/
```

I can make a function that takes dynamic arguments, and store it for later.

```javascript
const getTensionBreaker = () => {
    const phraseThatPays = [
        'That Girl is...',
        'Take me down to the Paradise City...',
        'Yo... His palms are sweaty, knees weak, arms are heavy...',
        'Soooooooo tell me what you want, what you really really want...',
        'Get Busy Child...'
    ]
    const len = phraseThatPays.length
    const randomInt = Math.floor(Math.random() * len)
    return () => phraseThatPays[randomInt]
}
const lol = getTensionBreaker()
lol() // That Girl is...
```

## Closures

You can use good 'ole closures for this too. While not pure, they work great:

```javascript
const request = require('request')

const loadWebsite = url =>
    new Promise( ( success, failure ) )
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
```

And if you want that more pure:

```javascript
const loadWebsite = (request, url) =>
    new Promise( ( success, failure ) =>
        request.get(url, (error, response, html) =>
            error
            ? failure(error)
            : success(html)
        )
    )
```

And then, to save people form having to manually put in `request` because we all know you're going to use `request` as the 1st parameter anyway:

```javascript
const request = require('request')
const loadWebsiteWithRequest = url => loadWebsite(request, url)
```

You'll note, that closure example looks a lot like the curried version, but the curried version below is less code:

```javascript
const request = require('request')
const loadWebsiteWithRequest = loadWebsite(request)
```

## One Or No Arguments

If a function has 1 argument, it cannot be curried... because that's the last argument needed to run the function and do the real work. While curried functions ensure all functions they manage take 1 argument, they themselves are only needed if a function takes more than 1 argument.

These functions will always return a `Promise`:

```javascript
loadWebsiteWithRequest('http://jessewarden.com')
loadWebsiteWithRequest('http://google.com')
```

The same goes for a function with no arguments:

```javascript
const loadJesseWardenDotKizzohm = () => loadWebsiteWithRequest('http://jessewarden.com')
```
