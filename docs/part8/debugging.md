# Debugging

// [jwarden 3.10.2019] TODO: add async tap example and Validation tap example.

Debugging Functional code is a bit different than imperative or Object Oriented code. Your primary means of debugging in procedural and Object Oriented code is exceptions, stack traces, and step debuggers. For functional programming, you often don't have access to the implementation details. That said, you can still use both.

## Imperative Debugging

In imperative and OOP, you'll have lines of code that you can set breakpoints or logs on to figure out "what's going on inside":

```javascript
import { startCase } from 'lodash'
const log = console.log

const fixName = name => {
    log("fixName, name:", name)
    const list = name.split(' ')
    log("list:", list)
    list[0] = startCase(list[0])
    log("list:", list)
    list[1] = startCase(list[1])
    log("list:", list)
    const fixedName = `${list[2]}, ${list[0]}`
    log("fixedName:", fixedName)
    return fixedName
}
```

There's a bug in the `fixName` function. We've put a log message on every line. We'll run the code and see where things start to break down.

```javascript
fixName, name: jesse warden
list: [ 'jesse', 'warden' ]
list: [ 'Jesse', 'warden' ]
list: [ 'Jesse', 'Warden' ]
fixedName: undefined, Jesse
undefined, Jesse
```

Things were fine until `fixedName`. The `list[2]` should be `list[1]`, whoops. If we fix:

```javascript
...
// list[1] was list[2]
const fixedName = `${list[1]}, ${list[0]}`
...
```

...and re-run:

```javascript
fixName, name: jesse warden
list: [ 'jesse', 'warden' ]
list: [ 'Jesse', 'warden' ]
list: [ 'Jesse', 'Warden' ]
fixedName: Warden, Jesse
Warden, Jesse
```

W00t!

## Functional Debugging: The Cop-Out

Let's do the same thing using a `Promise` chain:

```javascript
const fixName = name =>
    Promise.resolve(name)
    .then(name => name.split(' '))
    .then(list => [startCase(list[0]), list[1]])
    .then(list => [list[0], startCase(list[1])])
    .then(list => `${list[2]}, ${list[0]}`)
```

As you start to learn, it's ok to do the cop-out; i.e. going back to imperative. The only bad thing about this method is you're changing the function itself by effectively re-writing it. Still, I recommend it to get comfortable writing no `{}` in your code. It can be a bit of a pain matching up the braces `{}` and parenthesis `()` without compiler help as there are cases where you can misplace them and get errors at runtime that aren't helpful.

```javascript
const fixName = name =>
    Promise.resolve(name)
    .then(name => name.split(' '))
    .then(list => [startCase(list[0]), list[1]])
    .then(list => {
        log("list:", list)
        return [list[0], startCase(list[1])]
    })
    .then(list => `${list[2]}, ${list[0]}`)
```

## Functional Debugging: Tap

The frustration from imperative/OOP coders is "you can't see what's going on in the pipes". So you make a tap; a pipe that tells you what's going on inside it.

```javascript
const tap = arg => {
    console.log("tap:", arg)
    return arg
}
```

Typically, `Promise`s used in chains take 1 argument, just like `Result`, `Maybe`, etc. So our function will take the argument, then just return it; the only difference is it logs it. We then insert our logger pipe:

```javascript
const fixName = name =>
    Promise.resolve(name)
    .then(tap)
    .then(name => name.split(' '))
    .then(tap)
    .then(list => [startCase(list[0]), list[1]])
    .then(tap)
    .then(list => [list[0], startCase(list[1])])
    .then(tap)
    .then(list => `${list[2]}, ${list[0]}`)
    .then(tap)
```

When we run, it looks very similar:

```javascript
fixName('jesse warden').then(console.log)
tap: jesse warden
tap: [ 'jesse', 'warden' ]
tap: [ 'Jesse', 'warden' ]
tap: [ 'Jesse', 'Warden' ]
tap: undefined, Jesse
undefined, Jesse
```

We can use tap to inspect the pipes without violating pure function rules.

## Conclusions

You can use cop out if you're in a hurry or just completely confused. Composing functions in a sync and async way is a huge new concept, and imperative code can be very crystal clear about what is happening. You can still use breakpoints if your IDE supports it, just be aware pure functions sometimes don't expose their local variables easily in some IDE's... because they don't have any. There are a variety of taps, as well, especially once you incorporate partial applications to help give you more insight into the different stages of chaining your code is doing.

```javascript
const tap = label => arg => {
    console.log(`${label}: ${arg}`)
    return arg
}
```

Then we can give a custom label to each section:

```javascript
const fixName = name =>
    Promise.resolve(name)
    .then(tap('start'))
    .then(name => name.split(' '))
    .then(tap('after split space'))
    .then(list => [startCase(list[0]), list[1]])
    .then(tap('starCase first name'))
    .then(list => [list[0], startCase(list[1])])
    .then(tap('starCase last name'))
    .then(list => `${list[2]}, ${list[0]}`)
    .then(tap('done'))
```

It's a bit more clear when it prints out:

```javascript
start: jesse warden
after split space: jesse,warden
starCase first name: Jesse,warden
starCase last name: Jesse,Warden
done: undefined, Jesse
undefined, Jesse
```
