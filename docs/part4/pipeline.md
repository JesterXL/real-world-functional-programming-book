# Pipeline Operator

There is a proposal to add a [pipeline operator](https://github.com/tc39/proposal-pipeline-operator) to JavaScript like F#, Ocaml, Elm, and Elixir have. At the time of this writing, you can play with 2 of the 3 proposed styles: Minimal, F#, and Smart in Babel 7.2. I’ll show just Minimal and Smart below for now.

Taking our existing nested function:

```javascript
const parse1 = str =>
    startCaseNames(formatNames(filterHumans(parsePeople(str))))
```

We can use the pipeline operator |> to accomplish the same thing:

```javascript
const parse4 = str =>
    parsePeople(str)
    |> filterHumans
    |> formatNames
    |> startCaseNames
```

Calling `parse4(peopleString)` will result in `["Jesse Warden", "Brandy Fortune"]`.

## Debugging

Like the others, you can comment out the parts at the bottom to see how things are progressing:

```javascript
const parse4 = str =>
    parsePeople(str)
    |> filterHumans
    // |> formatNames
    // |> startCaseNames
```

You can re-use the same sync tap function as Composition:

```javascript
const parse4 = str =>
    parsePeople(str)
    |> tap
    |> filterHumans
    |> tap
    |> formatNames
    |> (arg => log("after format names:", arg) || arg)
    |> startCaseNames
```