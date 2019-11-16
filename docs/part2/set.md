# Mutating Data

Knowing the problems with dots and assuming you've avoided them, if you've read the Part 1, you know what's wrong with this code:

```javascript
person.firstName = 'Cow'
```

That isn't a function. It mutates data instead of using immutable data. It affects the outside world by modifying an Object vs. copying it. You no longer set data that way. You CAN set it like that inside pure functions, though.

## Set

Now that you know how to get data, setting is very similar. To update the `firstName`, you can write your own pure setter:

```javascript
const setFirstName = (person, newFirstName) => {
    return {...person, firstName: newFirstName}
}
```

And if you manually test it to ensure it's pure:

```javascript
console.log(person.firstName) // Jesse
setFirstName(person, 'Cow').firstName // Cow
console.log(person.firstName) // Jesse
```

But same problem as before with deeply nested properties. For that, use Lodash' `set`:

```javascript
const setFirstPhoneNumber = (person, newPhoneNumber) => {
    return set(person, 'address.home.phone[0]', newPhoneNumber)
}
```

Pure. Immutable data. Same input, same output, and no side effects.