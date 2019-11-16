# Boomerang

The `identity` function gives you back whatever you give it. It typically takes 1 input and looks like this:

```javascript
const identity = something => something
```

When you call it with things, it'll give those exact things back:

```javascript
identity('sup dawg') // sup dawg
identity(7) // 7
identity({ name: 'Jesse' }) // { name: 'Jesse' }
```

I say "exact things" on purpose as it is NOT a function that returns immutable values, but rather... it really does give you the same thing back:

```javascript
const personA = { name: 'Jesse' }
const personB = identity(personA)
personA == personB // true
personA === personB // true
```

In languages where immutability is built in, like Erlang or Elm, you don't really care, but in languages like JavaScript, Python, Lua, etc. it's important to note you CAN accidentally mutate it. Despite identity being such a simple function, still be in your guard to follow the pure function no side effects rule of mutating data.

I call it a boomerang because it basically just returns the same thing doesn't really appear to do anything unless their's magic involved somewhere that I'm missing.

## Uh... So what do you do with it?

At first glance, identity looks pretty useless. When would you ever need such a simple, yet pointless looking function?

### Logging Composed Functions

We'll cover it more in depth in [Part 9 - Debugging](../part9/debugging.md), but `identity` is the easiest way to get into any set of composed functions without breaking the chain to help you log. When you have long ones like we created in [Part 5 - Composing Functions](../part5/composing_functions.md), it can be useful to see how your data is being changed as it goes through each of the "pipes". We have 4 functions there, and don't want to modify what's going through them... we just wanna "see" it. The best way to do that is to say:

> "Yo dawg, I'm going to sit here between pipe 1 and 2; whatever pipe 1 gives me, I'll send to 2 so I won't break y'alls chaing, but I need to log out first."

By not touching the value, you're being really "pure" about the value, hence why some languages, like PureScript, call it [pure](https://github.com/purescript/purescript-prelude/blob/master/src/Control/Applicative.purs#L32).

In our case, we just wanna `console.log` things to know what the heck is going on.

Here's a composed set of functions that parses some JSON, and formats the names:

```javascript
const data = `[{"name": "jesse"}, {"nam": "brandy"}]`
const listNames = list =>
    list
    |> JSON.parse
    |> map(get('name'))
    |> map(startCase)
```

... however, it has a problem:

```javascript
listNames(data) // ["Jesse", ""]
```

We can create a `tap` function which is another word for "`identity` with a `console.log` inside":

```javascript
const tap = thing => {
    console.log(thing)
    return thing
}
```

Simply adding our `tap` in the composed functions, we can see what's going down dem pipes at each juncture:

```javascript
const listNames = list =>
    list
    |> JSON.parse
    |> tap // [Object, Object]
    |> map(get('name'))
    |> tap // ["jesse", undefined]
    |> map(startCase)
```

Wait, 2 Objects, but after we pluck the name off, that fails? Let's inspect that 2nd Object:

```javascript
[Object, Object]
0: Object
name: "jesse"
1: Object
nam: "brandy"
```

... oh, the 1st one Jesse has `name` and the 2nd one Brandy has `nam`. That's why `get('name')` was failing; there is no `name` property, just `nam` because it's mispelled in the JSON.

You can now comment them out to return the function to it's original, non logging way, but still leave them there in case you wish to debug later:

```javascript
const listNames = list =>
    list
    |> JSON.parse
    // |> tap
    |> map(get('name'))
    // |> tap
    |> map(startCase)
```

### Error Chains

// TODO, find that crazy chain example