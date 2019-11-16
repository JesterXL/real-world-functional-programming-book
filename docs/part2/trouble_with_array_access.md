# The Trouble with Array Bracket Access

Like the Trouble With Dots, in many dynamic languages, you can access parts of structures like Objects, Arrays, and class instances through bracket access. Normally that works great:

```javascript
const jesse = {
    rightHand: 'Sword',
    leftHand: 'Shield'
}
jesse.rightHand // Sword
jesse['rightHand'] // Sword
```

While Array's use bracket syntax usually exclusively to access their items using indexes since you can't use property names that start with a `Number`:

```javascript
const weapons = ['Rapier', 'Main Gauche', 'Chakram']
weapons[2] // Chakram
weapons.2 // SyntaxError: Unexpected number
```

You can do the same with Strings, though, since it'll coerce it:

```javascript
weapons['2'] // Chakram
```

... which feels vaguely like doing the same with Objects to set properties:

```javascript
jesse['rightHand'] = 'Chakram'
jesse.rightHand // Chakram
```

And if the index is out of bounds, you'll just get `undefined`:

```javascript
weapons[128] // undefined
```

And if the Array is empty, that's ok too:

```javascript
const potions = []
potions[128] // undefined
```

As long as you use numbers without a preceding 0, you're good, right? Well, no:

```javascript
undefined[2] // TypeError: Cannot read property '2' of undefined
```

Like the Trouble With Dots, reading Arrays this way is dangerous. You may think you're reading an Array, but the Object you're accessing could be `undefined` or `null`. Avoid accessing Array's using bracket access. Check out Part 3: `map` to see safe ways to handle this using the `nth` function in [Lodash](https://lodash.com/docs/4.17.10#nth) and [Ramda](https://ramdajs.com/docs/#nth).