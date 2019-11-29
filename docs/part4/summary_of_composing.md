# Summary Of Composing

When composing pure functions together to build more specific functions, hopefully now you can see you have some options. 

## Nesting

While nested functions work, like nested if’s, they’re hard to read, reason about, and breakpoints are painful to use with them. It's hard to turn off individual pieces and log the inbetweens unless you switch to an imperative style:

```javascript
const nesting = str =>
    startCaseNames(formatNames(filterHumans(parsePeople(str))))
```

## Composition

Composition using flow from Lodash and compose from Ramda are a lot nicer and more specific, but all the error handling is on you. JavaScript Error's do not support any type of chaining like Promises or [Folktale's Result](https://folktale.origamitower.com/api/v2.3.0/en/folktale.result.html). This means some of your functions will spit out only Strings, but others will spit out Strings or Errors; really painful.

```javascript
const compose = str =>
	flow([
		parsePeople,
		filterHumans,
		formatNames,
		startCaseNames
	])(str)
```

## Promise

Promises are nice and flexible between sync and async with built-in error handling, but sometimes adding that level of complication isn’t what you want. In JavaScript, however, it's often the most pragmmatic approach that assures your FP code works everywhere. An accidental side benefit of this is you get concurrency for free using `Promise.all`.

```javascript
const promise = str =>
    Promise.resolve(str)
        .then(parsePeople)
        .then(filterHumans)
        .then(formatNames)
        .then(startCaseNames)
```

## Pipeline

The pipeline operator is probably the easiest to read, works with Promises too, but has the same problem with flow / compose around error handling.

```javascript
const pipeline = str =>
    parsePeople(str)
    |> filterHumans
    |> formatNames
    |> startCaseNames
```

