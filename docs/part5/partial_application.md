# Partial Applications

Partial applications are functions with some of their arguments already given. You've already seen these types of functions in the [Curry](README.md) section, they just didn't have a name until now.

They're useful for:
- you don't have a choice, this is what curried functions without all their arguments return, lol
- used in function composition and chaining
- being more explicit when you want to use default parameters, yet still support pure, curried functions
- helping in debugging
- reducing the number of arguments you need for a function
- using them as arguments to other functions to further reduce their argument count
- exposing functions to developers to use with all the concrete modules/classes already included

## Curried Functions Make Partial Applications

You've seen partial applications in action in the previous 2 chapters. The `Array.filter` we made to filter Humans out of an `Array`. First you create a curried version of `array.filter`:

```javascript
filter = predicate => array =>
    array.filter(predicate)
```

Then create a partial application from it:

```javascript
filterHumans = filter(peep => peep.type === 'Human')
```

The `filterHumans` is the partial application. It is the curried function `filter` with some of it's arguments applied. It's a function that takes an `Array`, and gives you a filtered `Array` back. We can then use it like a normal function:

```javascript
filterHumans([ { type: 'Human', name: 'Jesse' }, { type: 'Dog', name: 'Albus' }])
// [ { type: 'Human', name: 'Jesse' }]
```

## Partial Applications Reduce Code Size

We've seen in previous chapters that you can utilize Partial Applications to reduce code size. Using curried functions with some of their arguments means they return a function. Most things in function composition take functions like `Promise` chains using `.then`, or pipeline chains using the pipeline operator `|>`. Curried functions that take some of their arguments return functions, so this works quite well in function composition. Below, we leverage this feature to have the `filter` function defined inline to parse out Humans from the people `Array` the previous function parsers:

```javascript
parsePeople = str =>
    parsePeopleJSON(str)
    .then(filter(peep => peep.type === 'Human'))
```

Now you could define it elsewhere, and then use it:

```javascript
filterPeople = filter(peep => peep.type === 'Human')

parsePeople = str =>
    parsePeopleJSON(str)
    .then(filterPeople)
```

However, doing it inline reduces code, and makes it easier for those reading after you what is going on. If `filterPeople` becomes more complex, sure, feel free to refactor into it's own function.

## Partial Applications Promote Code Reuse

Partial Applications allow you to more easily re-use functions elsewhere. The programming convention of DRY: Don't Repeat Yourself was created to ensure you don't duplicate the same logic in multiple places. That way, if you find a problem in one and fix it, it'll still be broken in the other 2 places unless you remember to copy paste. Sometimes copy pasta coding isn't easy to do based on the implementation.

The caveat to DRY is taking it too far. Sometimes code becomes quite unweidly because the logic is abstracted away to follow DRY, but is too hard to use in multiple places. Sometimes you're exploring ideas, and the logic may appear the same, but differs in slightly subtle ways. This colocation of the code can help as the logic is near where you're using it. Your mileage _will_ vary.

In our previous chapter, we refactored `array.map` to be a curried function:

```javascript
map = mapper => array =>
    array.map(mapper)
```

Then we used it in 2 places. The first was to convert people `Object`'s with their full name as a `String`:

```javascript
map(human =>`${human.firstName} ${human.lastName}`)
```

The second is to correct the capitaliation of the names to ensure the first and last name have their first character uppercased:

```javascript
map(startCase)
```

Same `map` function, just a different predicate function. This results in 2 differnet kinds of partial applications.

## Stubs vs. Mocks

When unit testing pure functions with side effects, in non-functional languages, you'll often have modules/classes/functions that handle them. For pure functions, this means we have to pass in our dependencies. For unit testing, this means you can pass in stubs for those dependencies instead of their original concrete implementations.

For our `JSON.parse`, it has side effects when the JSON isn't parseable and will throw an error. If we refactor our `parsePeople` function to be more pure, we can declare the JSON dependency:

```javascript
parsePeople = jsonParser => str =>
    Promise.resolve(str)
    .then(jsonParser)
    .then(filter(peep => peep.type === 'Human'))
```

Then, in your unit test, you can pass in a stub:

```javascript
it('should find 1 human when I pass it 1 human and 1 dog', () => {
    const jsonStub = jsonString => [{type: 'Human', name: 'Jesse'}, {type:'Dog', name:'Albus'}]
    const result = parsePeople(jsonStub)('whatever')
    expect(result[0].name).toBe('Jesse')
})
```

Note, we did this stub inline. You can simply put it up top and re-use the partial application in all of your tests. The advantage here is stubs are pure functions; same input, same output. This means they're deterministic. So it's ok to define them once and use in many places.

```javascript
const jsonStub = jsonString => [
    {type: 'Human', firstName: 'Jesse', lastName: 'Warden' }, 
    {type:'Dog', name:'Albus'}
]

it('should find 1 human when I pass it 1 human and 1 dog', () => {
    const result = parsePeople(jsonStub)('whatever')
    expect(result[0].name).toBe('Jesse')
})
it('should return formatted human names', () => {
    const result = parsePeopleNames(jsonStub)('whatever')
    expect(result[0]).toBe('Jesse Warden')
})
```

## Conclusions

Partial Applications are the functions returned from a curried function when you only supply it some of its arguments. Partial Applications are also curried funtions. If you call a Partial Application with only some of it's arguments, it'll give you a Partial Application back.

Partial Applications and Curried Functions are similiar to the distinction between function parameters and arguments. The parameter is what you write when you write the function such as `filter = predicate => array =>` which has parameters of `predicate` and `array`. The arguments are the values you actually pass such as `filter(filterHumans)(peepsList)` where `filterHumans` and `peepsList` are the actual arguments. Partial applications and curried functions, like arguments and parameters, are often used so interchangeably if you say one or the other, people know what you mean. However, there _is_ a difference, and knowing the difference can help in learning the true language and being clear when learning more advenced concepts of programming.

You've seen how you can make them from curried functions, how they help reduce code size, promote code reuse, and how they can help with stubs in unit testing. 