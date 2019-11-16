# Only Stubs, No More Mocks or Spies

[jwarden 3.10.2019] TODO/FIXME: I think this chapter started out good, but needs a redo. There's some good content in here, but it's easier to show WHY FP doesn't need mocks vs. stubs without resorting to a lesson what all these things are in excruciatingly detail.

You don't need mocks in Functional Programming because mocks test side effects. If you're writing Functional code, it is made up of pure functions. Pure functions don't have side effects. So no need for mocks. If you're trying to isolate code, you may still need stubs.

However, in the real world, you may be working with non-FP code, so you'll still need Mocks to test for side effects.

Let's get some nomenclature down first.

## Unit Test

A unit test is supposed to be a unit. No one knows (but think they know) what a unit is in programming. For now, a unit is any Object you want to test: Object, class, function, module, whatever.

## Object Under Test

An "object under test" is the thing you're testing. If you have an `it` in [Jest](https://jestjs.io/)/[Jasmine](https://jasmine.github.io/)/[Mocha](https://mochajs.org/) in JavaScript or [Busted](https://olivinelabs.com/busted/) in Lua, or a `test_*` function Python's [PyTest](https://docs.pytest.org/en/latest/), whatever that test function is supposed to be testing, that's the "object under test". Given how Mocks/Spies work, however, it may not be immediately obvious "what is the actual object under test here?"

## What is a Stub?

A stub is typically an `Object` or `Function` that always does the same thing, typically returning the hardcoded value you need. If you want your unit tests to be deterministic, and thus dependable, you ensure they always do the same thing every time they run. Given our `loadWebsite` function:

```javascript
const loadWebsite = request => url => ...
```

If we want to stub `request` to guarantee the test works whether the internet works or not with minimal/no side effects, you stub it:

```javascript
const requestStub = {
    get: (url, callback) => callback(undefined, {}, 'hey')
}
```

This stub is mostly a pure function, and we can use it to create a dependable unit test:

```javascript
it('loadWebsite should work', ()=> {
    return loadWebsite(requestStub, 'some url')
    .then(result => {
        expect(result).toBe('hey')
    })
})
```

## What is a Mock?

Mocks are stubs that can track what happened to them during the test execution. You can then make assertions on what they remember. They are sometimes called spies because the Object will record what it sees "covertly". Whether using Object Oriented Programming or Functional, the "how things happen" is intended to be hidden, so using an Object in this way is considered spying. In Dynamic languages, they'll sometimes re-use a real implementation, and overwrite functions, methods, or properties with temporary Objects unlike statically typed languages where it's wrapped through Composition. This may cause a `restore` step, where you turn the Object back to the way it was after the test/suite.

Let's cover post assertions, testing specifically for side effects, and pre-assertions.

## Mocks in Post Assertions

Given our old school `for` loop:

```javascript
const getParsedNames = (names, callback) => {
    for(let i = 0; i < names.length; i++) {
        const parsedName = parseName(names[i])
        callback(parsedName, i)
    }
}
```

We can test what happened to the callback; did it get inside the function and get used like we think it should? To do that, we need a function that remembers what happened to itself.

```javascript
const mockCallback = (...args) => {
    mockCallback.calls++
    mockCallback.calledWith.push(args)
}
mockCallback.calls = 0
mockCallback.calledWith = []
```

Not when we test it, we can make some assertions on it in the test:

```javascript
it('getParsedNames should be called with correct parsed names 3 times for 3 item array', ()=> {
    const names = ['jesse warden', 'brandy fortune', 'albus dumbledog']
    getParsedNames(names, mockCallback)
    expect(mockCallback.calls).toBe(3)
    expect(mockCallback.calledWith[1][0]).toBe('Fortune, Brandy')
})
```

### Call Something Here, Read About It Over There 

Pure function rules are same input, same output, and no side effects. Class methods typically are not pure functions because although they sometimes may have inputs, many don't have return values, and almost always are setting data internally on a mutable `this` or `self` property that is the place where all the data internally for the class is stored. While you can write pure functions in a class, and even make them public, if you're using a class, you're going to follow the Object Oriented Programming rule of encapsulation. That is hiding data internally, and exposing access to it from a public API.

In a sense, one could argue that a class can be a pure function because it can follow the spirit of the pure function rules:

```javascript
class Adder {
    add(a, b) => {
        this._result = a + b
    }
    get result() {
        return this.result
    }
}

const a = new Adder()
a.add(1, 2)
console.log("result:", a.result)
```

However, as soon as you test it, you know you're testing side effects because there:

- is no return value
- the value changes on the object after you set a method

```javascript
it("Adder's add, when called will add 2 numbers", () => {
    const instance = new Adder()
    expect(instance.result).toBe(undefined)
    const result = instance.add(1, 2)
    expect(instance.result).toBe(3)
    expect(result).toBe(undefined)
})
```

Let's read those expectations in order:

1. Make sure the Object's result property is `undefined`
2. Make sure the method has a side effect on the Object.
3. Make sure the method didn't return a result.

Let's re-write that as a pure function with test:

```javascript
const add = (a, b) => a + b

it('add will add 2 numbers', () => {
    const result = add(1, 2)
    expect(result).toBe(3)
})
```

Has a return value, no need to check before and after for side effects. You'll do this a lot in UI frameworks where you're trying to see "if the UI updated after I set data".

### Pre-programmed Assertions

[jwarden 3.10.2019] TODO/FIXME: TypeScript is unnecessary here and the examples are verbose. I know mocks are verbose, but try harder.

Traditionally, mocks are known for pre-programmed assertions. You use them in this way to ensure things are being used as expected... if not, fail the test. Instead of testing how something was used, like a spy, you make your assertions before you even call your object under test. Let's OOP-i-fy our names parser using [TypeScript](https://www.typescriptlang.org/docs/handbook/classes.html) so we can enforce public/private properties and methods:

```javascript
import { startCase } from 'lodash'

export default class NamesParser {
    private names: Array<String>
    private _parsedNames: Array<String>

    public get parsedNames(): Array<String> {
        return this._parsedNames
    }

    constructor(names: Array<String>) {
        this.names = names
        this._parsedNames = []
    }

    private parseName(name) : String {
        return name.split(' ').reverse().map(startCase).join(', ')
    }

    public parseNames() {
        this._parsedNames = []
        for(let i = 0; i < this.names.length; i++) {
            this._parsedNames[i] = this.parseName(this.names[i])
        }
    }
}
```

For the unit test, we know it should return a good value, so let's build that assertion into the mock. This one will pass because `parseName` is only being called once for the 1 item in the Array:

```javascript
it('NamesParser should call parseName one time for 1 value', () => {
    const parser = new NamesParser(['jesse warden'])
    const mock = sinon.mock(parser)
    mock.expects("parseName").once().throws()
    parser.parseNames()
    mock.verify()
})
```

This one fails because we gave it 2 items, but keep the expectation that will will call `parseName` 1 time:

```javascript
it('NamesParser should call parseName one time for 1 value', () => {
    const parser = new NamesParser(['jesse warden', 'brandy fortune'])
    const mock = sinon.mock(parser)
    mock.expects("parseName").once().throws()
    parser.parseNames()
    mock.verify()
})
```

Again, test one thing here, but look for the results over there. With Mocks via pre-programmed assertions, you've doing 4 nasty things:

1. mutating the object under test
2. creating and testing specifically for side effects
3. intentionally throwing an `Error`
4. re-mutate the object after the test

While 1 and 4 do not follow pure function rules, you get a pass since you're in a dynamic language, and that's one of the reasons we like dynamic languages; everything is fair game and it's how most mocking libraries are built. That said, your unit tests are not your actual code anymore; they're modified objects. Number 3, while intentional in unit tests, is not following pure function rules. You give a function inputs and test its outputs. An `Error` is not an output, it's a side effect. Again, you get a pass because technically it's the mock throwing the error, not your function/class.

... however, #2 is not ok at all.

## Conclusions

As you can see, there is zero need for spies/mocks with pure functions because:

1. no need to mutate the object before or after; it's a `function` and you use as is
2. no need to setup assertions on how something should be used, you're just calling 1 function and checking the outputs are expected based on the inputs
3. Side effects?

You'll assume no side effects, yes, HOWEVER, don't discount testing for them. Using unit tests to test for the LACK OF side effects is actually something unit tests are really good at. If you're not sure if code is 100% pure, unit tests will help you track them down. Just be aware these tests will rot over time, especially if you are testing private module methods. Feel free to delete later vs. maintain them.

Mocks aren't used in Functional Programming because there are no side effects to test for. The Object under test is always a `function`, so there is no `class` method or `Object` property to modify and watch. You're just testing the functions that take inputs and have expected outputs. Some of those inputs may be slow, complicated, or from hard to setup 3rd party code so pure function stubs may be used.
