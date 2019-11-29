# Basic Function Composition

Function composition is combining functions together. It's how you build libraries, API's, and programs using Functional Programming. It's a [well defined math term](https://en.wikipedia.org/wiki/Function_composition), and usually refers to combining Partial Applications together.

Once you create pure functions, you create more powerful functions by combinging them together. We'll cover the 4 main ways of doing this via nesting, composing, using Promises, and the pipeline operator.

## String to Formatted People Names

We're going to be converting a JSON string of people to a list of formatted names. We'll create 4 mostly pure functions and wire them together into 1 big parser function. Using these 4 functions, we'll show you the 4 different ways of composing pure functions together.

## JSON String

Our data is a JSON String list of 2 people and 1 dog.

```javascript
const peopleString = `[
	{
		"firstName": "jesse",
		"lastName": "warden",
		"type": "Human"
	},
	{
		"firstName": "albus",
		"lastName": "dumbledog",
		"type": "Dog"
	},
	{
		"firstName": "brandy",
		"lastName": "fortune",
		"type": "Human"
	}
]`
```

## Step 1: Parsing Function

Our mostly pure parsing function will take a string and parse it to a JSON Object:

```javascript
const parsePeople = str =>
	JSON.parse(str)
```

This has the subtly to have a single function 

## Step 2: Filter Humans

We need 2 functions to filter out the dog. The first is a predicate function that ensures a person’s type is “Human”.

```javascript
const filterHuman = person =>
    person.type === "Human"
```

Using the function above, `filterHuman({type: 'Human'})` would return `true` and `filterHuman({type: 'Dog'})` would return `false`.

The 2nd function will use that predicate in the `Array.filter` function so only humans will remain.

```javascript
const filterHumans = peeps =>
    peeps.filter(filterHuman)
```

## Format Names

We want to format the names so instead of 2 separate firstNameand lastName variables, instead they’re combined into a single string.

```javascript
const formatName = human =>
	`${human.firstName} ${
		human.lastName
    }
```

We can use it to take `formatName({firstName: 'bruce', lastName: 'campbell'})` which will result in “bruce campbell”.

Next is to use that function on everyone in the list using map:

```javascript
const formatNames = humans =>
    humans.map(formatName)
```

## Fixing The Name Case

The 4th and final thing to do is fix the name casing. All the names are lowercased and we want it to be proper with the first and last name having the first character uppercased. The easiest way is to simply us Lodash’ startCase function to do it for us.

```javascript
const startCaseName = name =>
    startCase(name)
```

That will take startCaseName('bruce campbell') and produce “Bruce Campbell”. Taking that function we can again apply it to every person in the list using map:

```javascript
const startCaseNames = humans =>
    humans.map(startCaseName)
```