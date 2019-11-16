# reduce: 3 things go in, whatever you want comes out

The `reduce` function takes an `Array`, a function to modify the data, and a starting value. The function gets each item in the Array and the current value of the accumulator. Whatever you return in the function will update the accumulator value. You don't have to update the accumulator at all if you don't want to.

Reduce is [the Squat](https://startingstrength.com/article/squat-mechanics-a-clarification) of the big 3. Unlike `map` and `filter`, he might not even return an `Array`; he could return anything. Don't stress if `reduce` is challenging for months. Other languages will sometimes call it "fold" instead of "reduce".

Reduce also has a special name for the function you give it called a `reducer`. If you've learned any Redux, then you'll immediately recognize it. The Redux framework is a bunch of `reducer` functions.

[jwarden 1.8.2019] TODO: I like this example, but it's pretty advanced. Perhaps people skipping around might want something simpler. We should put at least 2 here; one showing the Array return, and the this one showing the String return.

## Old Sk00l for

Let's accumulate using the traditional `for` loop. We want to iterate over a list of party members and create a formatted `String` summarizing what is in the list.

```javascript
const party = [
    {
        name: 'Jesse',
        clazz: 'Swashbuckler',
        hitPoints: 20,
        maxHitPoints: 22
    },
    {
        name: 'Brandy',
        clazz: 'Cleric',
        hitPoints: 14,
        maxHitPoints: 14
    },
    {
        name: 'Albus',
        clazz: 'War Dog',
        hitPoints: 5,
        maxHitPoints: 9
    }
]

let summary = ''
for(i = 0; i < party.length; i++) {
    const member = party[i]
    summary += `${member.name} \t- ${member.hitPoints}/${member.maxHitPoints}\n`
}
console.log(summary)
```

The `summary` ends up looking like:

```
Jesse   - 20/22
Brandy  - 14/14
Albus   - 5/9
```

# reduce

We can purify that by using `reduce`. First, our reduce function:

```javascript
const addMemberToSummary = (summary, member) =>
    `${summary}${member.name} \t- ${member.hitPoints}/${member.maxHitPoints}\n`
```

Let's test it out:

```javascript
addMemberToSummary(
    '', 
    {
        name: 'Jesse',
        clazz: 'Swashbuckler',
        hitPoints: 20,
        maxHitPoints: 22
    })
)
// Jesse   - 20/22
```

Nice, now we'll use that function in `reduce` below:

```javascript
const partyToString = party =>
    reduce(
        party,
        addMemberToSummary,
        ''
    )
partyToString(party)
```

Gives us:

```
Jesse   - 20/22
Brandy  - 14/14
Albus   - 5/9
```

The `addMemberToSummary` will be called for each item of the Array. The `reduce` function will give the accumulator as the first argument, and the item in the Array as the 2nd. Since it returns a String, the accumulator will be set to that string. Notice while we're returning a new String each time, we ensure it's appended to the accumulator by injecting it in the front; whatever we add always goes at the end.

What was `summary` in the `for` loop example is our 3rd argument to the `reduce` function. The key difference is in our `for` loop:
- it was a variable
- it was mutated each loop
- we had to store it

Using `reduce`:
- it's an immutable constant
- your function returns a new value to set it to for the next function call
- `reduce` stores it

## Conclusions

Reduce: Take an Array of things in as well as an accumulator, give the current value of the accumulator and the current item in the Array to the reduce function, whatever that function returns will be set as the new value for the accumulator. Whatever the accumulator value is after the last item in the Array has been iterated over, that's what is returned from the function. The `reduce` function expects a pure reducer function, and is itself a pure function.

It's called "accumulator" because it's assumed to accumulate, or "collect" values over time, but that isn't always the case. You can return whatever you want from your `reducer` function.

Unlike `map` and `filter`, the `reduce` function can take long while to wrap your head around. 

> Map... change stuff.
> Filter... filter stuff.
> Reduce... uh... convert, or... uh....

Additionally, you can still struggle to remember exactly how it works for a long time, and continually look up the documentation on parameter order, and the reducer function parameter order. Also, the accumulator can be anything (a `Number` for adding numbers, another `Array` for doing a more complicated `map`, etc) so it can take time to find creative uses from your own exploration. Give yourself some slack; this is the hardest of The Big 3 list comprehensions to memorize, use, and get proficient with.
