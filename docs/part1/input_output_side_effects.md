# Pure Functions: Same Input, Same Output, No Side Effects

A pure function is a function that will always give the same output with the same input and has no side effects. A function that takes some arguments will always return the same value and not be affected by variables outside the function, nor will it change variables outside of it after it's done executing.

## Same Input, Same Output

Below we'll show an impure and a pure version of an addition function. Learning the rules is one thing, seeing how they are broken, and how you fix code to not break the rules is key. I promise this is the only math function this book has.

### Impure Add

This function that will add 2 numbers plus whatever `data` equals.

```javascript
let data = 0
const add = (a, b) =>
    a + b + data
```

If we call it three times, it may look like it's same input, same output:

```javascript
add(1, 2) // 3
add(1, 2) // 3
add(1, 2) // 3
```

However, if we change the value of the `data` variable and call the function again:

```javascript
add(1, 2) // 3
add(1, 2) // 3
add(1, 2) // 3
data = 1
add(1, 2) // 4
add(1, 2) // 4
add(1, 2) // 4
```

Now it's `4`. Same input, **not the same output**. It's affected by things outside of the function.

### Pure Add

**Solution**: Ignore the outside world.

To make it pure, it needs to ignore the outside world. We can only add things that are passed into the function via the arguments. Here is the pure version of `add`.

```javascript
const addPure = (a, b) => a + b
```

If we call `addPure(1, 2)`, it will always return `3`.

```javascript
let data = 0
addPure(1, 2) // 3
addPure(1, 2) // 3
addPure(1, 2) // 3
```

If we set the `data` variable to `5`:

```javascript
let data = 0
addPure(1, 2) // 3
addPure(1, 2) // 3
addPure(1, 2) // 3
data = 5
addPure(1, 2) // 3
addPure(1, 2) // 3
addPure(1, 2) // 3
```

We'll still follow the first rule of same input, same output.

## Outside Effects

Side effects can be both outside and inside. Below is a function with NO inputs can still be affected by things happening outside of the function.

### Impure isCow

Here we have a variable that's a cow emoji:

```javascript
friend = '🐮'
```

And here we have a function that detects if it's a cow or not:

```javascript
const isCow = () => {
    if(friend === '🐮') {
        return true
    } else {
        return false
    }
}
```

If we call it three times, it'll follow the first rule of same input, same output. In this case, no input will equal `true`:

```javascript
isCow() // true
isCow() // true
isCow() // true
```

However, if we change person to a chicken and then call it, we get a `false` back:

```javascript
friend = '🐮'
isCow() // true
isCow() // true
isCow() // true
friend = '🐔'
isCow() // false
isCow() // false
isCow() // false
```

Even with no inputs, this function still fails to follow the rules of same input, same output. Even no input, it still returns a different value because it's affected by "effects", or a variable changing, outside of itself that effects it.

### Pure isCow

**Solution**: Pass in the outside world through function arguments.

The `add` function was made by pure by ignoring the outside world. However, `isCow` needs to _know_ about the outside world so it can report if the `friend` is a cow or not. The only way inside a pure function is through its arguments. We'll pass the `friend` in:

```javascript
const isCowPure = friendObject => {
    if(friendObject === '🐮') {
        return true
    } else {
        return false
    }
}
```

Now when we call it and pass in the outside world:


```javascript
friend = '🐮'
isCow('🐮') // true
isCow('🐮') // true
isCow('🐮') // true
friend = '🐔'
isCow('🐮') // true
isCow('🐮') // true
isCow('🐮') // true
```

Since we pass the outside world in, the function can still report on it, and still not by affected what happens outside. It follows the rules of same input, same output, no side effects.

## Inside Effects

The 2nd rule of no side effects applies not just to the outside world affecting the function, but also the function affecting the outside world. If "the world" changes after a function ran, it probably has side effects.

## Impure haveBirthday

Here is an example of how the function can affect the outside world after it has run.

This `person` Object starts at the age of `18`:

```javascript
var person = {
    age: 18
}
```

For the `person` to have a birthday, we have to increment the age. We're trying to be pure, so we follow the example above and pass in the outside world into the function via its arguments:

```javascript
const haveBirthday = person => {
    person.age += 1
    return person
}
```

While the `person` _does_ have its `age` incremented:

```javascript
console.log(person) // { age: 18 }
console.log(haveBirthday(person)) // { age: 19 }
console.log(person) // { age: 19 }
console.log(haveBirthday(person)) // { age: 20 }
console.log(person) // { age: 20 }
console.log(haveBirthday(person)) // { age: 20 }
console.log(person) // { age: 21 }
```

The world was affected by the function running. The `person`'s age was changed after the function run. Notice it keeps changing the world each time it is run. This function appears to follow the same input, same output rule, though:

```javascript
console.log(haveBirthday( { age: 18 } )) // { age: 19 }
console.log(haveBirthday( { age: 18 } )) // { age: 19 }
console.log(haveBirthday( { age: 18 } )) // { age: 19 }
```

## Pure haveBirthday: 

**Solution**: Do not mutate data, use immutable data instead.

What is immutable data? It's data you can't mutate; data you can't change.

The `haveBirthday` function mutates the `person` Object. Although it was passed in, most Objects are dynamic languages are by reference. You affect one reference, you affect the Object and all the references that point to that Object will update to show the changes. Think of it like a global variable.

The way you fix it is to **not** mutate data. The easiest way to do that is to clone Objects and only change 1 property on the clone.

```javascript
const haveBirthdayPure = personObject => {
    const clone = {...person, age: personObject + 1}
    return clone
}
```

Now when you run it, it follows both the same input, same output rule AND not affecting the outside world after it has been run:

```javascript
console.log(person) // { age: 18 }
console.log(haveBirthdayPure(person)) // { age: 19 }
console.log(person) // { age: 18 }
console.log(haveBirthdayPure(person)) // { age: 19 }
console.log(person) // { age: 18 }
console.log(haveBirthdayPure(person)) // { age: 19 }
console.log(person) // { age: 18 }
```

## Conclusions

You've learned the 2 rules pure functions must follow:

1. same input, same output
2. no side effects

To ensure same input, same output, functions must only deal with data that came from their parameters. Pure functions must ignore the outside world.

If there is something in the outside world like a global variable, closure variable, or even a module that the function needs to work, it MUST be passed in via the arguments, else it will violate rule #1.

You've learned that passing in the outside world through function parameters is not enough. If you mutate the data while it is inside the function, or call other impure functions that do, you can affect the outside after the function is run. This will violate rule #2. To solve that, you must not mutate data, and instead use immutable data.
