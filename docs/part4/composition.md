# Composition

Ramda uses [compose](https://ramdajs.com/docs/#compose) and Lodash calls it [flow](https://lodash.com/docs/4.17.15#flow). They take a bunch of functions you want piped together and give you a new one. Taking our nested function:

```javascript
const parse1 = str =>
    startCaseNames(formatNames(filterHumans(parsePeople(str))))
```

Which is parsing the people JSON string, then filtering the dog out, then formatting the names as strings, and finally fixing the casing. We can do that, in order like we did in the promise. Using Lodash’ `flow` to make 1 function of all them:

```javascript
const supaParse =
    flow([
        parsePeople,
        filterHumans,
        formatNames,
        startCaseNames
    ])
```

However, instead of storing it as supaParse, we can you can just use it inline (see the `(str)` at the end that invokes it):

```javascript
const parse2 = str =>
	flow([
		parsePeople,
		filterHumans,
		formatNames,
		startCaseNames
	])(str)
```

Calling `parse3(peopleString)` will result in `["Jesse Warden", "Brandy Fortune"]`. Like the Promise example in the next chapter, it’s easier to read and follow the order of what’s happening. Unlike the Promise, it’s synchronous, so there is no need to worry about Promise chains, async/await, etc. However, like async/await, error handling is on you, and some of your intermediate functions may not know how to handle errors as their inputs when they were expecting a string of Arrays like `startCaseNames` or even `parsePeople` getting bad JSON.

### Turning Off Pieces

One advantage Composing and Promise have over Nesting is you can more easily toggle parts off and log how the pipe is operating at each stage. Like the Promise example, you can comment out parts of the sequence to better debug how your data is being modified up to a certain point. Think of it as turn parts of your pipeline off.

```javascript
const parse2 = str =>
	flow([
		parsePeople,
		filterHumans,
		// formatNames,
		// startCaseNames
	])(str)
```

### Debugging

You can log out each part using a modified tap:

```javascript
const tap = arg => {
    log(arg)
    return arg
}
```

And then use it:

```javascript
const parse2 = str =>
	flow([
		parsePeople,
		tap,
		filterHumans,
		tap,
		formatNames,
		arg => log("after format names:", arg) || arg,
		startCaseNames
    ])(str)
```