# Validation

A Validation is a data type that represents if what validation errors occurred on data. It's basically an `Array` with some helpful methods. This is my favorite Algebraic Data Type, mainly because it was one of my gateways to Functional Programming, and another gateway to Total Functions (we'll cover those in the next Chapter, [Part 7: Total Functions](../part7/README.md)). More importantly, it can tell you all the things that went wrong with a function in excruciating detail. When you start composing large programs together, it is what negates the need for interpreting the stack trace (sometimes); you just read the validation errors to see what happened.

You use Validations to validate data. In typed languages, it can be used for data coming from outside effects, like web servers, files, and environment variables. It can also be used to ensure certain rules pass or fail. For dynamic languages, it can do that as well as double as a runtime type checker. For front-end develop, it can be used to validate user data like form input.

```javascript
const Validation = require('folktale/validation')
const { Success, Failure } = Validation

const jesse = {
    name: 'Jesse Warden',
    clazz: 'Swashbuckler',
    hitPoints: 17,
    maxHitPoints: 22
} 

const brandy = {
    name: 'Brandy Fortune',
    clazz: 'Cleric',
    hitPoints: 11,
    maxHitPoints: 11
}

const isHealthy = member =>
    (member.hitPoints >= member.maxHitPoints)
    ? Success(member)
    : Failure([`${member.name} is not healthy.`])

console.log(isHealthy(jesse))
// folktale:Validation.Failure({ value: ["Jesse Warden is not healthy."] })

console.log(isHealthy(brandy))
// folktale:Validation.Success({ value: { name: "Brandy Fortune", clazz: "Cleric", hitPoints: 11, maxHitPoints: 11 } })
```

## Adding Success and Failure

Like `Maybe`, the `Validation` has 2 sub-types, `Success` and `Failure`. They each hold 2 types of data. `Success` holds the data that validated successfully. `Failure` holds a list of validation errors, typically strings. If the data you're validating has 3 errors, the `Array` inside the `Failure` will have 3 String items.

Unlike `Maybe`, you can add these types together. `Maybe`s can only chain or map 1 to 1 whereas `Validators` can be added together, specifically their Errors. It's similar to an Array `concat` method:

```javascript
let errors = []
errors = errors.concat(['Not healthy.'])
errors = errors.concat(['Not a healer.'])

console.log(errors)
// [ 'Not healthy.', 'Not a healer.' ]
```

When you're running data validation, you're typically running a bunch of checks, not just one like the example of above. Like `every`, if all pass, it's considered a `Success`. If even just 1 fails, it's a `Failure`, and it will include only that failure in the Array.

Adding `Success` to `Success` always breeds `Success` when cows are involved:

```javascript
const good = Success('🐮')
  .concat(Success('🐄'))
  .concat(Success('🐄'))
  .concat(Success('🐮'))
// folktale:Validation.Success({ value: "🐮" })
```

However, adding a `Failure` to a `Success` always ends up in `Failure`:

```javascript
const bad = Success('🐥')
  .concat(Failure([`Wait, he's not a cow.`]))

console.log(bad)
// folktale:Validation.Failure({ value: ["Wait, he's not a cow."] })
```

For every `Failure` you add, they'll be merged together:

```javascript
const onlyTheErrorsMam = Success('🐮')
  .concat(Failure([`The wave function collapsed.`]))
  .concat(Success('🐄`))
  .concat(Failure([`Dude, seriously, there is no Shannon, this bartender has been yelling her name for an hour, super loud.`]))

console.log(onlyTheErrorsMam)
// folktale:Validation.Failure({ value: [
//     "The wave function collapsed.", 
//     "Dude, seriously, there is no Shannon, this bartender has been yelling her name for an hour, super loud."] 
// })
```

## Combining Validations

Typically you'll make functions that validate some data, and then combine them together. Below we'll try to find a healthy healer in our list of party members. The character class has to be Cleric, and the hit points have to be above 75%. If both are true, we have a healthy healer:

```javascript
const isHealthy = member =>
  ((member.hitPoints / member.maxHitPoints) >= 0.75)
  ? Success(member)
  : Failure([`Hitpoints are lower than 75%, ${member.hitPoints}`])

const isCleric = member =>
    (member.clazz === 'Cleric')
    ? Success(member)
    : Failure([`${member.name} is not a Cleric, they're a ${member.clazz}.`])

const isHealthyHealer = member =>
    isHealthy(member)
    .concat(isCleric(member))

console.log(isHealthyHealer(jesse))
// folktale:Validation.Failure({ value: [
//     "Jesse Warden is not healthy.", 
//     "Jesse Warden is not a Cleric, they're a Swashbuckler."
// ] })

console.log(isHealthyHealer(brandy))
// folktale:Validation.Success({ value: { name: "Brandy Fortune", clazz: "Cleric", hitPoints: 11, maxHitPoints: 11 } })
```

In the above, Jesse is neither healthy, nor is his class a Cleric, so both validation errors are included. Brandy is both healthy and a Cleric, so her validation result is successful.

## Pattern Matching

Like `Maybe`, you can pattern match the `Validation` using `matchWith`. For `Success`, the `value` will be whatever you passed in, and for `Failure`, it's the `Array` of validation errors you made (typically an Array of Strings):

```javascript
isHealthy(member)
  .concat(isCleric(member))
  .matchWith({
      Success: ({ value }) =>
        console.log(`${member.name} is a HH!`),
      Failure: ({ value }) =>
        console.log(new Error(value.join(',')))
  })
```

You can use `matchWith` to create helpful validation predicates:

```javascript
const isHealthyHealer = member =>
    isHealthy(member)
    .concat(isCleric(member))
    .matchWith({
        Success: ({ value }) => true,
        Failure: ({ value }) => false
    })

console.log(isHealthyHealer(jesse)) // false
console.log(isHealthyHealer(brandy)) // true
```

## Conclusions

Validations are great for validating data and knowing exactly why it failed. When you're sanitizing your inputs in your API, you can provide wonderful feedback to yourself for debugging, and in your error messages to developers. For front-end development, it's a wonderful way to validate form fields, and to provide a lot of helpful error messages to users. For both, be as verbose as possible in the `Failure` to help debug validation later so there is no ambiguity why it failed. [Learn more](https://folktale.origamitower.com/api/v2.3.0/en/folktale.validation.html) from the Folktale `Validation` documentation. 

... omg, Shannon just showed up. Good thing I didn't say I was Shannon.