# Union

A Union is a bunch of types in one value. You use them to represent many possible types. They're also a great replacement for one or many Booleans. Union types have a special ability called matching that uses a pure function and removes the need for using `if` statements. You've seen this briefly used in the [Validation](./validation.md) and [Result](./result.md) sections and we'll expound on it here.

## Scalars, Products, and Unions

A String  is a **scalar** type; `"cow"` is always `"cow"` and completely different from `"goat"`.

An Object is a **product** type; it's the combination of many types into one like:

```javascript
{ name: 'Dat Moo Moo', age: 2, type: '🐮', food: ['hay', 'grass'] }```

That `Object` contains 2 `String`s, a `Number`, and an `Array`.

A **union** type combines those products together. If you've read this book in order, you've already seen 3 Union types: `Maybe`, `Validation` and `Result`. A `Maybe` is either a `Just` or `Nothing`. Both are distinct types like `Array`, and they have similar methods, but represent completely different things. The `Maybe` marries the 2 into 1 type.

```javascript
const union = require('folktale/adt/union/union')

const Maybe = union('Maybe', {
    Just( value ) { return { value } }
    Nothing() {}
})
```

// [jwarden 3.10.2019] TODO/FIXME: Dude, what happened above? Why are you writing a book in code comments?


## Basic Custom Example

Below, we're searching a list of users by ID. If we find one, we want the user it found. If it didn't find one, we want a clear message saying so, and what ID we used to search for:

// [jwarden 3.10.2019] TODO/FIXME: break this down into smaller chunks

```javascript
const { find } = require('lodash/fp')
const { union, derivations} = require('folktale/adt/union')

const FindUserResult = union('FindUserResult', {
    User(user) { return { user } },
    IDNotFound(userID) { return { userID } }
}).derive(derivations.debugRepresentation)

const { User, IDNotFound } = FindUserResult

const findUserByID = (users, userID) =>
    find(
        user => user.id === userID,
        users
    )

const findUser = (users, userID) =>
    findUserByID(users, userID)
    ? User(findUserByID(users, userID))
    : IDNotFound(userID)

const users = [
    { name: 'Jesse', id: 1 },
    { name: 'Brandy', id: 2 }
]

const result1 = findUser(users, 2)
console.log(result1)
// FindUserResult.User({ user: { name: "Brandy", id: 2 } })

const result2 = findUser(users, 5)
console.log(result2)
// FindUserResult.IDNotFound({ userID: 5 })
```

Similar to `Maybe`, just more specific. Note the `.derive(derivations.debugRepresentation)` is so when we `console.log` it out, it doesn't just print as a normal looking `Object`.

## More Than 2

However, not all sub-types have to have 2 like `Maybe`, `Validation`, `Result`, and `FindUserResult`:

For example, if you're using Kafka or Amazon Kinesis to build a log monitoring application, you'll often be a stream processor. You'll listen to a series of input streams, parse and aggregate the data, and then output it on another stream. Given it's from a multitude of applications, you'll be getting many different types of messages, and each one contains different information, and in turn requires a separate parsing operation.

```javascript
const Message = union('Message', {
    Log(log) { return { log } },
    DatadogMetric(metric) { return { metric } },
    ManualAlert(alert) { return { alert } },
    NetworkInfo(source, info) { return { source, info } }
})
```

## What Could Possibly Go Wrong?

Union types are great for modeling errors. They help you know more clearly what went wrong, embed debug information for future you, while keeping things pure and composeable.

// [jwarden 3.10.2019] TODO/FIXME: Using the throttling example, may result in less code.

For example, if you want to upload an Excel file in this application we built at work, there are a lot of things to go wrong. You wouldn't know that, though, from reading this code:

```javascript
const uploadFile = request => form =>
    new Promise((success, failure) =>
        request.post('/upload', {form}, (err, res, data) =>
            err
            ? failure(err)
            : success(data)
    )
```

If you give it a `request` and some multi-part form data, she'll attempt to upload. If it works, great, you'll get the server response in the `Promise.then`. If it fails, you'll get an what went wrong in the `Promise.catch`. Cool right?

Well, no. This is an application for users who aren't always tech savvy and manage a lot of money. Any visual indication as to what went wrong can help in customer support calls and various escalations to higher level support, like the developers who wrote the code. If the developers use good error handling and the designer on the team creates a good error screen with well written copy, the developers hopefully won't ever get a support call. Additionally, any information a user might do to help fix the problem themselves can stop those calls from even happening.

So what can go wrong? There are known knowns, and known unknowns:

- your session can expire if you login and leave the web application open for 20 minutes without doing anything. Either the http status is 302, OR it's 200 but the URL is not the URL you posted too because you have a proxy in front of your API layer that makes strange decisions.
- we can't figure out who you are from the session
- you attempt to upload a file that isn't an Excel file
- you attempt to upload an Excel file that has macros in it
- you attempt to upload a virus
- you upload more than 1 file, and the first file is fine, but the other one(s) have 1 of the problems listed above
- the email took too long to send a successful email response or failed
- the messaging service that lets you know the status of your file either failed or couldn't be reached in time

Let's model that into a custom Union type:

```javascript
const FileUploadResult = union('FileUploadResult', {
    SessionExpired(error, httpStatusCode) { return { error, httpStatusCode } },
    NotLoggedIn(error, httpStatusCode) { return { error, httpStatusCode } },
    UnsupportedFileType(error, file, reason) { return { error, file, reason } },
    ExcelMacros(error, file, reason) { return { error, file, reason } },
    Virus(error, file, reason) { return { error, file, reason } },
    EmailFailed(error, file) { return { error, file } },
    MessageFailed(error) { return { error} }
    Success(file) { return { file } }
})
```

Notice all are errors, and many hold more information about the error, like the http status code vs. just looking around in the message String. The last one indicates a successful file upload and contains the file it uploaded.

Now that we have our type, we can use it to be more clear as to what went wrong or right by returning that from the `Promise`. We won't ever fail the `Promise`, though, we'll just let the caller decide, so we remove the typically success/failure, and just put resolve: 

```javascript
const uploadFile = request => form =>
    new Promise(resolve =>
        request.post('/upload', {form}, (err, res, data) =>
            resolve(getFileUploadResult(err, res, data))
    )
)
```

Calling it, we can build up String for each error to be clear what went wrong or right:

```javascript
const uploadResult = await uploadFile(require('request'))(fileForm)

uploadResult.matchWith({
    SessionExpired: ({error, httpStatusCode}) =>
        `You've been logged out. http code: ${httpStatusCode}, error: ${error.message}`,
    NotLoggedIn: _ => window.location.reload(true), // let Proxy redirect to login
    UnsupportedFileType: ({ error, file, reason }) =>
        `An unsupported file type was uploaded. We only support Excel files with no macros.
file: ${file}`,
    ExcelMacros: ({ file }) =>
        `The Excel file you uploaded contained macros. Please remove them and Save As to create a new Excel with the macros removed.
File: ${file}`,
    Virus: ({ file }) =>
        `The Excel file you uploaded was identified as a virus.
virus file: ${file}`,
    EmailFailed: ({ error }) =>
        `We failed to email your file successful. Error received: ${error}`,
    MessageFailed: _ =>
        `We emailed your file successfully, but failed to send a confirmation message. Please manually check your inbox.`,
    Success: ({ file }) =>
        `Successfully uploaded and emailed your file: ${file}`
})
```

## Did it Work or Not?

If you just want to know if it worked or not, you can simply return a `Boolean`. The `stubTrue` and `stubFalse` functions from lodash & lodash/fp are functions that always return true `() => true`, and always return false `() => false`:

```javascript
const { stubTrue, stubFalse } = 
const didUploadWork = result => result.matchWith({
    SessionExpired: stubFalse,
    NotLoggedIn: stubFalse,
    UnsupportedFileType: stubFalse,
    ExcelMacros: stubFalse,
    Virus: stubFalse,
    EmailFailed: stubFalse,
    MessageFailed: stubFalse,
    Success: stubTrue
})

console.log(didUploadWork(Success('some file'))) // true
console.log(didUploadWork(NotLoggedIn(new Error('boom', 400)))) // false
```

## matchWith vs. Type Checking

This style of wrapping complex return values into custom types is used in Object Oriented Programming as well. For example, simplifying a `fetch` call into 3 possible return values/

We got an HTTP status other than 200:

```javascript
class Failed {
    constructor(error) {
        this.error = error
    }
}
```

We got a good response, but couldn't parse the JSON:

```javascript
class JSONParseFailed {
    constructor(error) {
        this.error = error
    }
}
```

And a successful response with successful JSON parsing:

```javascript
class Successful {
    constructor(data) {
        this.data = data
    }
} 
```

You'd then check the type:

```javascript
someFetchCall()
.then(result => {
    if(result instanceof Failed) {
        error("HTTP call failed:", result.error)
        return result.error
    } else if(result instanceof JSONParseFailed) {
        error("JSON parsing failed:", result.error)
        return result.error
    } else {
        log("Successful:", result.data)
        return result.data
    }
})
```

Ranting about the problems with `if` statements especially without a type system is beyond the scope of this book, so suffice to say:
1. we're not checking specifically for `Successful`, we just assume if the first too aren't found, it's `Successful`.
2. If we were missing a type, we'd get a null pointer on `result.data` trying to access data on a class type that doesn't have it... not really helpful to say why the fetch call did or did not succeed.
3. If we add/remove a type, we have to be careful about ensuring the order of if statements and ensure each case is handled.
4. What do we put for the else if we did specifically check for `Successful`?
5. We're having to dot access class instances without lenses nor a type checker.
6. You could accidentally forget to return a specific/correct value from the class error / data property.
7. This is Imperative style code in a Functional Programming book, GTFO.

Let's change that to a pure function using `matchWith` and Union a type instead. We'll first define are types like we did in the OOP example:

```javascript
const FetchResult = union('FetchResult', {
    Failed(error) { return { error } }
    , JSONParseFailed(error) { return { error } }
    , Successful(data) { return { data } }
})
```

And to use it, we just use `matchWith`:

```javascript
someFetchCall()
.then(result =>
    result.matchWith({
        Failed: error =>
            error("HTTP call failed:", error)
        , JSONParseFailed: error =>
            error("JSON parsing failed:", error)
        , Successful: data =>
            log("data:", data)
    })
})
```

If you're not using a typed language like TypeScript or Flow, you can ensure you covered all possible cases with an `any`.

```javascript
const { any } = require('folktale/adt/union/union')

someFetchCall()
.then(result =>
    result.matchWith({
        ...
        , [any]: () =>
            error("unknown match.") // might not be error
    })
})
```

Remember, `matchWith` is a pure function. If you're forced to work with Promises, you can simply return the unboxed values, and the `data` will go to the `then` and the `error`'s will automatically go to the `catch`:

```javascript
...
.then(result =>
    result.matchWith({
        Failed: error =>
            error("HTTP call failed:", error) || error
        , JSONParseFailed: error =>
            error("JSON parsing failed:", error) || error
        , Successful: data =>
            log("data:", data) || data
    })
})
```

While I'm not a fan, many love the await/async syntax. If you use Union types as the return value instead of values or `Error`'s like you do with Promises, you can solve 2 problems:
1. no need for a try/catch
2. allow the consumer to pattern match the result

```javascript
const result = await someFetchCall()
const data = result.matchWith({
    ...
})
```

## Boolean Replacements

Jeremy Fairbank covers the problem with Boolean's is his presentation "[Solving the Boolean Identity Crisis](https://www.youtube.com/watch?v=6TDKHGtAxeg)". The short version is using Booleans, even outside of a type system can cause problems with `if` statements missing a case, and parameters not really being clear as to what they mean. We'll cover the latter problem.

For example, this function call from a game:

```javascript
jump(true)
```

Is the `true` meaning "how high" or "using gravity boots to stick on the celing" or.... what? No clue, so you go read the function definition to figure it out.

... vs this one:

```javascript
jump(Horizontal)
```

Suddenly it's more clear just by reading the function the first parameter means a horizontal jump vs a vertical one.

Before types, you have to check the Boolean value with an if statement:

```javascript
const jump = horizontal => {
    if(horizontal === false) { // vertical jump
        object.applyForce( 0, 2000, object.x, object.y )
    } else { // horizontal jump
        object.applyForce( 4000, 100, object.x, object.y )
    }
}
```

vs. using a Union type:

```javascript
const jump = direction =>
    direction.matchWith({
        Vertical: _ =>
            object.applyForce( 0, 2000, object.x, object.y )
        , Horizontal: _ =>
            object.applyForce( 4000, 100, object.x, object.y )
    })
```

No need to worry about adding new types of jumps and missing an if else block:

```javascript
const jump = direction =>
    direction.matchWith({
        Vertical: _ =>
            object.applyForce( 0, 2000, object.x, object.y )
        , Right: _ =>
            object.applyForce( 4000, 100, object.x, object.y )
        , Left: _ =>
            object.applyForce( -4000, 100, object.x, object.y )
    })
```

## Multiple Booleans in Asynchronous Redux

Whether you use [sagas](https://github.com/redux-saga/redux-saga) or [thunks](https://github.com/reduxjs/redux-thunk) to handle asynchronous calls in [Redux](https://redux.js.org/) in [React](https://reactjs.org/), the UI portion is probably the same.

1. Loading...
2. Successfully got data.
3. Failed to get data, here's the error and what you can do about it.

The typical pattern is to create an Object specifically for that [finite state machine](http://jessewarden.com/2012/07/finite-state-machines-in-game-development.html) that looks like this:

```javascript
// loading state
{
    loading: true
    , data: undefined
    , isError: false
    , error : undefined
}
```

And when you successfully got data:

```javascript
// success state
{
    loading: false
    , data: { loggedIn: true, user: { firstName: 'Jesse' } }
    , isError: false
    , error : undefined
}
```

And when it fails:

```javascript
// error state
{
    loading: false
    , data: undefined
    , isError: true
    , error : new Error('500 http status code returned.')
}
```

Creating reducer functions for this is pretty straightforward. However, you can prevent worrying about getting in invalid states such as:

```javascript
// wait, is this the default?
{
    loading: false
    , data: undefined
    , isError: false
    , error : undefined
}
```

Or my favorite:

```javascript
// "You are figh-ahd!"
// "At least you bought me lunch."
// "Guuuuud philosophy... see gud in beehd!"
{
    loading: true
    , data: { loggedIn : true, user: { firstName: 'Jesse' } }
    , isError: true
    , error : new Error('200 http status code returned.')
}
```

Once you start having multiple Booleans, it feels pure and safe having just a few reducer functions ensuring you can't really get into an invalid state. However, it's easier to just use a Union type and not have to worry about it ever happening at all:

```javascript
const LoginState = union('LoginState', {
    Loading() { return {} }
    , Failure(error) { return { error } }
    , Success(user) { return { user } }
})
```

Now for login, your reducer goes from this:

```javascript
const loginReducer = (previousState, action) => {
    switch(action.type) {
        case 'login':
            return {...previousState, loading: true, data: undefined, isError: false, error: undefined}
        case 'loginSuccess':
            return {...previousState, loading: false, isError: false, data: action.data }
        case 'loginError':
            return {...previousState, loading: false, isError: true, error: action.error }
        default:
            previousState
    }
}
```

To this:

```javascript
const loginReducer = (previousState, action) => {
    switch(action.type) {
        case 'login':
            return Loading()
        case 'loginSuccess':
            return Success(action.data)
        case 'loginError':
            return Failure(action.error)
        default:
            previousState
    }
}
```

And instead of your imperative JSX render method looking like this:

```javascript
render() {
    if(this.props.login.loading) {
        return <Loading />
    }
    if(this.props.login.isError) {
        return <ErrorScreen error={this.props.login.error} />
    }
    return <UserProfile user={this.props.login.data} />
}
```

You can just match against the Union in a more functional way:

```javascript
render => () =>
    this.props.login.matchWith({
        Loading: _ => <Loading />
        , Failure: error => <ErrorScreen error={error} />
        , Success: user => <UserProfile user={user} />
    })
```

## Conclusions

Union types are great for modeling errors, or when you have multiple return types. They can represent data or `null` more specifically than a simple `Maybe`, and give you more insight into what we wrong than a simple `Result.Error`. They make functions that use Booleans as parameters more readable to other developers without having to read the function body to understand what the Boolean parameter means as the Union literally has its meaning in its name. That, and no need for if statements which are easy to mess up. For multiple Booleans where you're making smaller state machines, they can help simplify it and ensure only the states you want are capable of being reached.
