# Result

A `Result` is a data type for modeling errors. Unlike `try`/`catch` and `throw`, it can give you more control on propagating those errors in a pure way. When in doubt, if it's async and it can fail, use `Promise`. If it's sync and it can fail, use `Result`.

// [jwarden 3.10.2019] TODO: break down this massive code example and provide an easier one at first.

```javascript
const Result = require('folktale/result')
const { Ok, Error } = Result
const fs = require('fs')

// async
const readFile = file =>
    new Promise((success, failure) =>
        fs.readFile(file, (err, data) =>
            err
            ? failure(err)
            : success(data)
        )
    )

readFile('non-existent-file.cow')
.then(contents => console.log("contents:", contents))
.catch(error => console.log("file read error:", error))
// file read error: { Error: ENOENT: no such file or directory, open 'non-existent-file.cow'

// sync
const readFileSync = file => {
    try {
        const data = fs.readFileSync(file)
        return Ok(data)
    } catch(readError) {
        return Error(readError.message)
    }
}

const result = readFileSync('non-existent-file.cow')
// result: folktale:Result.Error({ value: "ENOENT: no such file or directory, open 'non-existent-file.cow'" })
```

## Ok and Error

The two sub-types of `Result` are `Ok` and `Error`. `Ok` means whatever you were doing worked, and `Ok` will contain the data. It could also just mean "things didn't blow up".

The `Error` contain what went wrong. This can be any data type you want. If it's one thing, a String is usually best. If you don't know, the original native `Error` is better. If you decide to create a custom one, be careful of name collisions. Destructuring `Error` leads to confusion when you start going `new Error('t3h failurez')` and get back a Folktale `Result` `folktale:Result.Error({ value: "t3h failurez" })` instead of what you thought, a native error with stack trace included `Error: t3h failurez`.

When many things can go wrong, its better to use a Union Type (see next section, [Part 6: Union Types](union.md)).

## Chi Chi Chain Chain

Like `Promise` and `Maybe`, you can chain `Result`. The `chain` method works like the others; good things like `Ok` will continue the `chain`. As soon as an `Result.Error` is returned, the whole `chain` is aborted.

Below, everything is fine:

```javascript
const Result = require('folktale/result')
const { Ok, Error } = Result
const { startCase } = require('lodash/fp')

const safeSplit = name => {
    try {
        const result = name.split(' ')
        return Ok(result)
    } catch(error) {
        return Error(error.message)
    }
}

console.log(
    Ok('warden jesse')
    .chain(name => safeSplit(name))
    .chain(name => Ok(name.reverse()))
    .chain(name => Ok(startCase(name)))
)
// folktale:Result.Ok({ value: "Jesse Warden" })
```

However, if we inject bad data at the beginning:

```javascript
console.log(
    Ok(undefined)
    .chain(name => safeSplit(name))
    .chain(name => Ok(name.reverse()))
    .chain(name => Ok(startCase(name)))
)
// folktale:Result.Error({ value: "Cannot read property 'split' of undefined" })
```

Just like `Promise` and `Maybe`; good values will keep chaining, bad ones immediately abort.

## Getting Data Out

Like `Maybe`, if there is data in the `Ok`, you can get it out, else supply a default in case of an `Error`:

```javascript
const castSpellResult = Error('Failed, not enough mana.')
const didSpellWork = castSpellResult.getOrElse('Spell casting failed.')

console.log(didSpellWork)
// Spell casting failed

const attackResult = Ok('Success, 4 points of damage!')
const didAttackWork = attackResult.getOrElse('Attack failed.')
console.log(didAttackWork)
// Success, 4 points of damage!
```

## Pattern Matching

Like `Maybe` and `Validator`, you can use `matchWith` to pattern match on the `Result`:

```javascript
const attackResult = Ok( { hit: true, attacker: 'Jesse', target: 'Bad Guy', weapon: 'Boomerang' } )
const printedResult = attackResult.matchWith({
    Ok: ( { value } ) =>
        value.hit
        ? `${value.attacker} successfully hit ${value.target} with ${value.weapon}!`
        : `${value.attacker} missed ${value.target} with ${value.weapon}...`
})

console.log(printedResult)
// Jesse successfully hit Bad Guy with Boomerang!
```

## try

Just like using `promisify` became a habit to more easily wrap callback methods to return a Promise instead, so too is it common to wrap methods that can `throw` errors with `Result` using `Result.try`:

```javascript
const result = Result.try(() => JSON.parse(undefined))

console.log(result)
// folktale:Result.Error({ value: SyntaxError: Unexpected token u in JSON at position 0 })
```

## Conclusions

Use `Result` when something can go wrong, typically a native Error is thrown, or a bunch of things can go wrong. When it's ok, like an Array not having your data, or an environment variable not being set, use a `Maybe`. If you need to know a series of Errors, `Validation` is probably better. [Learn more](https://folktale.origamitower.com/api/v2.3.0/en/folktale.result.html) from the Folktale `Result` documentation. 