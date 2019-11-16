# The Trouble with Dots

In many dynamic languages, you can access parts of structures like Objects, Arrays, and class instances through `.`, the dot operator. Normally that works great:

```javascript
const person = {
    firstName: 'Jesse',
    lastName: 'Warden',
    age: 39,
    address: {
        home: {
            street: '007 Cow Lane',
            phone: ['123-456-7890']
        },
        work: {
            street: '123 Work Blvd'
        }
    }
}
```

To access the `firstName` property on the `person`, I just use a dot accessor:

```javascript
console.log(person.firstName) // Jesse
```

If you misspell a property, no worries:

```javascript
console.log(person.fistName) // undefined
```

If you misspell the object, though:

```javascript
console.log(persn.fistName) // ReferenceError: persn is not defined
```

The second comes from accessing a sub property you THINK exists, but doesn't such as misspelling home to hom:

```javascript
console.log(person.address.hom.street) // TypeError: Cannot read property 'street' of undefined
```

You spelled street right. However, you could of spelled it wrong. Either way, what the error MEANT to say was: "There is no `hom` property on `person.address`, perhaps you meant `home`?".

As you see, reading data through dots is dangerous. These errors are with a known Object. Often you're dealing with data that _isn't_ known, coming from external sources like REST calls, text files, databases, etc. These are side effects that you can't control.
