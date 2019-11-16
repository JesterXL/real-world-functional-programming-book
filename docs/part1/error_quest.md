# Hold Up, Wait a Minute, Let Us Trap The BOOM In It

Returning `Error`s from functions is supported and encouraged in Functional Programming, but throwing them is not. Throwing errors via `throw new Error('boom')` breaks the first rule of pure functions, same input, same output because there is no output. Sometimes, an Error can cause unintended side effects in a piece of code, and breaks the "same output" part of the rule. Finally, once you throw an Error, the world is affected after the function ran, thus breaking the second rule of no side effects.

When running Node in in a concurrent environment like [ECS](https://aws.amazon.com/ecs/), [Kubernetes](https://kubernetes.io/), or [Lambdas](https://aws.amazon.com/lambda/) through a [Step Function](https://aws.amazon.com/step-functions/) this can be a good or bad thing depending upon how you handle it. This can cause a [pm2](http://pm2.keymetrics.io/) to restart one of your Node processes, a [Docker container](https://www.docker.com/) to be destroyed in your [ECS cluster](https://aws.amazon.com/ecs/) or all kinds of infrastructure to be recycled based on error logs. Those are quite a lot of side effects from a simple `throw`.

The bad news is, you're always going to have errors. Functional Programming won't fix your internet being down when you're making a REST call or your browser out of memory when you attempt to `console.log` some big JSON.

The good news is when Errors occur in FP code, they won't break your program. For UI code, you can design for these errors predictably. If you're willing to create total functions, it'll tell you exactly what went wrong without you having to make sense of a long stack trace.

## Standard Error Handling

Let's take our existing bullet-proof, never fail function:

```javascript
const alwaysTrue = () =>
    true
```

And unit test it:

```javascript
const result = alwaysTrue()
expect(result).to.equal(true)
```

Now let's create one that always booms:

```javascript
const alwaysBoom = () => {
    throw new Error('boom')
}
```

And unit test it a similar way:

```javascript
const result = alwaysBoom()
expect(result).to.equal(true)
```

Instead of the `expect` line running, it explodes with `Error: boom`. It breaks the same input, same output rule because there is no output. To be more explicit about that, let's wrap in a try catch:

```javascript
let result
try {
    result = alwaysBoom()
} catch (error) {
    console.log("error:", error)
}
console.log("result:", result)
expect(result).to.equal(true)
```

It'll print out your error, and then `result: undefined`. That's because it never returned a value, went straight to the `catch`.

## Return The Error

**Solution**: Return the Error.

When a function has a problem, instead of throwing an Error, return the Error. Think about functions that could throw errors. Suddenly, they can have 2 possible return values, just like a `Promise` can either fulfill in the `then` or fail in the `catch`. It worked, and here's your data, or it failed, and here is why.

```javascript
const safeParseJSON = string => {
    try {
        const result = JSON.parse(string)
        return thingsWorked
    } catch(error) {
        return thingsFailed
    }
}
```

... but what should we return to signal things worked or failed? Is `undefined` and the JSON Object good enough? That makes it a bit hard to work with on the caller side. What does `undefined` mean; it worked, or the JSON string was bad?

Let's see how other languages handle this in a slightly functional way.

### Go Error Handling

This is a common pattern solved in other languages. In Go, it's built INTO the language. In Go, you can return multiple values. This has made it a convention to return errors as the last argument, and check them in a procedural style before continuing. 

This function attempts to parse a JSON String. It returns `parsed`, the parsed JSON Object, and `err`, the error if it failed:

```go
func safeParseJSON(jsonString string) (object, error) {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("couldn't parse JSON and it panicked", r)
            return nil, errors.New("jsonString")
        }
    }()
    parsed, err := json.Marshal(jsonString)
    return parsed, err
}
```

To use it, you simply call  and assign it to the 2 values, `obj` and `err`:

```go
obj, err := safeParseJSON("{\"foo\":\"bar\"}")
```

You can then revert back to imperative style coding and see if the `err` exists, and if so, abort all code moving forward.

```go
if err != nil {
    fmt.Printf("couldn't parse JSON: %v\n", err)
    return
}
fmt.Println("Parsed JSON:", obj)
```

Here, we log it, but in functions where you're inside other functions, you'd simply return your own error:

However, it's still written in a procedural style, hence Rebecca Skinner creating [Gofpher](https://github.com/asteris-llc/gofpher) for [Monadic Error Handling in Go](https://speakerdeck.com/rebeccaskinner/monadic-error-handling-in-go?slide=61) (i.e. JavaScript `Promise` style). Note the verbose [defer](https://blog.golang.org/defer-panic-and-recover) to recover from panics. 

### Lua Error Handling

Lua has multiple return values for functions as well, and provides a function called `pcall`, short for "protected call" that works similarly. Unlike Go, the first value is "did this function work or not". Also, if Go uses `panic`, the entire error blows away the stack, and you get no return value, forcing you to use a `defer`. In Lua, the p stands for "protected", effectively a try/catch. If the function failed via an Exception, the 2nd return value will be the error, else whatever value(s) the function returns. So Lua's `pcall` is pretty powerful compared to Go.

```lua
local success, errorOrObject = pcall(JSON.parse, string)
if success == false then
    print("Failed:", errorOrObject)
    return
end
print("Parsed JSON:", errorOrObject)
```

The downside here is the `errorOrObject` is either the error, or your value. It's not very explicit or clear; you have to look at the success first to know which it is.

### Python Error Handling

Python supports multiple return values through Tuples, an immutable Array, that you can then easily unpack into return values.

```python
def safe_json_parse(string):
    try:
        result = JSON.parse(string)
        return (True, None, result)
    except Exception as e:
        return (False, str(e), None)
```

Notice when we use it, it flattens out into those variables; `success` will be `True` or `False`, `error` will be `None` or the string error, and `obj` will either be your data, or `None`:

```python
success, error, obj = safe_json_parse(string)
if success == False:
    print("Failed:", error)
    return
print("Parsed JSON:", obj)
```

### The Simple Object

As you can see, 3 other languages support returning multiple values from a function to determine if that function worked, and if not, what went wrong. JavaScript does not support multiple values, but there are multiple ways to provide the same style of error handling.

The first way is just to return an `Object`, then destructure the values. Let's update our original `safeParseJSON` function:

```javascript
const safeParseJSON = string => {
    try {
        const result = JSON.parse(string)
        return { ok: true, data: result }
    } catch(error) {
        return { ok: false, error }
    }
}
```

If it works, say `ok` is true, and return the data. If it fails, say `ok` is false, and return the error.

```javascript
const { ok, error, data } = safeParseJSON(`{"foo":"bar"}`)
if(ok === false) {
    console.log("Failed:", error)
    return
}
console.log("Parsed JSON:", data)
```

## Async Simple Object: sureThing

If you're dealing with asynchronous errors, and you want the same syntax, whip out the async/await syntax. This also has the nice addition of ensuring you never have to use try/catch with async/await again. You don't even need to use the `catch` ever again if you don't want to. It's called a `sureThing`, a Promise that always succeeds, created by my co-worker Jason Kaiser.

First have your Promise resolve with the same Object structure:

```javascript
const safeReadFile = fileName =>
    new Promise( success =>
        fs.readFile(fileName, (error, data) =>
            error
            ? success({ ok: false, error })
            : success({ ok: true, data })
        )
    )
```

Then use it the same with, just with `await`:

```javascript
const example = async () => {
    let { ok, error, data } = await safeReadFile(`config.json`)
    if(ok === false) {
        console.log("Failed:", error)
        return
    }
    console.log("File contents:", data)
    ( { ok, error, data } = safeParseJSON(data) )
    if(ok === false) {
        console.log("Failed to parse JSON:", error)
        return
    }
    console.log("Parsed JSON:", data)
}
```

Contrast the above with typical async/await syntax that doesn't return this type of Object:

```javascript
const example = async () => {
    let configString
    try {
        configString = await safeReadFile(`config.txt`)
        console.log("File contents:", configString)
    } catch (configError) {
        console.log("Failed:", configError)
        return
    }

    let json
    try {
        json = safeParseJSON(configString)
        console.log("Parsed JSON:", json)
    } catch(parseError) {
        console.log("Failed to parse:", parseError)
    }
}
```

If you're ok with using normal Promise chaining, that works too:

```javascript
const example = () =>
    safeReadFile(`config.json`)
    .then( ({ok, error, data}) =>
        ok
        ? safeParseJSON(data)
        : error)
    .then( ({ok, error, data}) =>
        ok
        ? data
        : error
    )
    .then(json => console.log("Parsed JSON:", json))
    .catch(error => console.log("Read or parse error:", error))
```

## Pure Object

Now that you get the basics around returning if a function failed or not using an Object, let's make it more pure. First, the `safeParseJSON` does not declare it's global dependencies, so we need to fix that:

```javascript
const safeParseJSON = (JSON, string) => {
    try {
        const result = JSON.parse(string)
        return { ok: true, data: result }
    } catch(error) {
        return { ok: false, error }
    }
}
```

As explained later in the Working With OOP section, we take the whole `JSON` object vs. just it's `parse` function as the first parameter, and the string second. You'll see this pattern of "known things to the left, dynamic things to the right" a lot and should do it yourself as well.

Now for purifying `safeReadFile`, declaring his dependency on the `fs` file system module:

```javascript
const safeReadFile = (fs, fileName) =>
    new Promise((success, failure) =>
        fs.readFile(fileName, (error, data) =>
            error
            ? failure({ ok: false, error })
            : success({ ok: true, data })
        )
    )
```

And putting it all together again:

```javascript
const example = (JSON, fs) =>
    safeReadFile(fs, `config.json`)
    .then( ({ok, error, data}) =>
        ok
        ? safeParseJSON(JSON, data)
        : error)
    .then( ({ok, error, data}) =>
        ok
        ? data
        : error
    )
    .then(json => console.log("Parsed JSON:", json))
    .catch(error => console.log("Read or parse error:", error))
```

## A Bunch of Things Could Go Wrong

The above lumps all errors into the `catch` as a String. We have to search in 1 place without any ability to be proactive or reactive. Sometimes we need to know what error occurred as either some are ok, or some require different code paths for us to take. We'll cover this advanced error handling in the "Result" section in Part 5 and being more clear about what exact error it was in "Union" in Part 6.
