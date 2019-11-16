# Practice Purity Through Predicates

The simplest way to learn how to create pure functions without worrying about the side effects part is creating predicates. Predicates are pure functions that only return `true` or `false`.

## alwaysTrue and alwaysFalse

You can do it the old school way:

```javascript
function alwaysTrue() {
    return true
}
```

or the new school, whatever is comfortable for you:

```javascript
const alwaysTrue = () => true
```

For `false`, it's the same:

```javascript
const alwaysFalse = () => false
```

These functions will never fail. Unit testing them requires no fixtures or stubs. You can do it the imperative way so you can later `console.log` steps and parts that aren't making sense:

```javascript
const result = alwaysTrue()
expect(result).to.equal(true)
```

Or just go for it inline since "they never fail":

```javascript
expect(alwaysTrue()).to.equal(true)
```

## Runtime Type Checkers

Dynamic languages often don't have good, if any, runtime type validation. That's part of the allure of them, not to be burdened with types if you want to quickly play with ideas or ship software.

Sometimes, though, you need to know if something is of a certain type. Some languages provide functions for this, like `type` in Python and Lua. For JavaScript, it varies, but a lot are built upon the `typeof` operator. These can get quite nuanced, so don't worry if yours aren't exact, were more concerned with you feeling comfortable not doing math equations in functions, and instead creating pure functions you'd actually use in your day to day work.

For example, if a user is logging into a website, you'll probably do form validation on the client to verify that the user hasn't entered blank text. On the server, you'll do the same check as well to verify the client sent you a username that has at least some text in it, else you'll send back a custom error letting them know what went wrong.

First we have to know what a string is:

```javascript
const isString = o => typeof o === 'string'
```

Let's test her out:

```javascript
isString('cow') // true
isString(1) // false
isString(true) // false
isString(new Date()) // false
isString([]) // false
isString({}) // false
```

Cool, so far so good. Now let's create a predicate that uses our `isString` predicate to check if the String is a valid one. The "legit" is slang for "legitimate".

```javascript
const legitString = o => isString(o) && o.length > 0
```

You could just instead write:

```javascript
const legitString = o => o.length > 0
```

But then that would throw an Error if you gave it `null` or `undefined` by accident:

```javascript
legitString(undefined) // TypeError: Cannot read property 'length' of undefined
```

And gives you possibly strange results with `Arrays`:

```javascript
legitString([]) // false
legitString(['a']) // true... whaaaaa
```

We need to be specific that we're talking about Strings, but notice no need for composition, using an `&&` and or `||` or is fine.






