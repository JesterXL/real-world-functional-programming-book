# Nesting

The most common way to compose functions is to nest them. If we want to parse the JSON string, we’ll first call `parsePeople`:

```javascript
const parse1 = str =>
    parsePeople(str)
```

That’ll give us our Array of people Objects, so we can next filter out the humans:

```javascript
const parse1 = str =>
    filterHumans(parsePeople(str))
```

The `filterHumansfunction` will take in whatever `parsePeople(str)` returns. Next is to format all the human names:

```javascript
const parse1 = str =>
    formatNames(filterHumans(parsePeople(str)))
```

Two nested functions is where people start to draw the line on things being unreadable, similar to nested if statements. However, there is only 1 more left, and that’s fixing the case of the names:

```javascript
const parse1 = str =>
    startCaseNames(formatNames(filterHumans(parsePeople(str))))
```

Calling `parse1(peopleString)` will result in:

```javascript
["Jesse Warden", "Brandy Fortune"]
```

One thing you can possibly do to make it more readable is to treat it like nested if blocks and space it appropriately:

```javascript
const parse1 = str =>
	startCaseNames(
		formatNames(
			filterHumans(
				parsePeople(str)
			)
		)
    )
```

At the time of this writing, debug breakpoints won't even respect that, though. If you want imperative debugging, you're better to break out the brackets and manual `return` keyword so you can more easily do step debugging:

```javascript
const parse1 = str => {
    const peeps = parsePeople(str)
    const humans = filterHumans(peeps)
    const names = formatNames(humans)
    const cased = startCaseNames(names)
	return cased
}
```
