# Warning

Learning Functional Programming will change your life, but not necessarily for the better. It is a different way of thinking about code, and will change the way you look at code forever after. There is no going back.

Like the time I learned Object Oriented Programming, or Design Patterns, or Model View Controller frameworks, you see the programming in a new way. You have a new hammer and everything becomes a nail. You know the "one true way" and you struggle to reconcile the new way with the ways of old.

... Except it's different this time. Once you learn FP, you'll struggle to explain it to other coders and friends who may be entrenched in Procedural or OOP. Your code will start to look alien to non-FP'ers. You'll look at code most people write and think to yourself "that's wrong, you can't do that". Unless you're around other FP'ers, or those wishing to learn FP, you may feel loneliness. Most FP'ers do not talk about this.

I feel it's worth it. Just be aware the above will happen and prepare yourself mentally. You'll make more friends if you invest in OOP, Java, or React/Angular/Vue. Following pure FP, you will make new friends and can bring along old ones, just be aware it is the minority in non-academic circles. If it makes you feel any better, it's [because of happenstance](https://www.youtube.com/watch?v=QyJZzq0v7Z4). 

## Why Even Bother Learning Functional Programming as a JavaScript Developer?

What if I told you you could write JavaScript that doesn't throw errors, requires no mocks for unit testing, and you never have to memorize a scoep or `this` rule again? You won't have to care about hoisting and shadowing. No `undefined is not a function`, no [Sinon spies](https://sinonjs.org/releases/v4.0.0/spies/), and never using `class` or `bind` again, just building functions that _always work_. Your Node code can be stateless, and work with concurrency "out of the box". You can instead focus on testing if your code is correct vs. if it mostly works and hopefully doesn't explode.

What's the catch?

1. `npm` libraries are not all FP.
2. Popular Front end Frameworks are not 100% FP
3. Node middlewares and frameworks are not 100% FP
4. FP code can have no errors and still not work right
5. Pragmatism wins against Purity because "I'm le tired"
6. 100% test coverage is easier to attain, but you'll still have bugs

In JavaScript, most of the code you use isn't yours and comes from the [Node Package Manager](http://npmjs.com/) called `npm`. It probably isn't written in an FP style. The library most likely uses `throw` intentionally, uses classes and inheritance, and other things that make FP code harder to write.

Front-end web development frameworks like [React](https://reactjs.org/) & [Angular](https://angular.io/) are not 100% functional. You'll have to not only write your own functional style code, but learn how to deal with non-functional code, in a functional way if you're forced to work in those frameworks.

Node middlwares were created before Promises, and use a callback style with many libraries built atop this side effect heavy concept. They are used extensively in the framework and plugin ecosystem in frameworks like [Express](https://expressjs.com/) and [Restify](http://restify.com/).

Those in software consulting are purists so among them you'll find FP an easier sell. Those in a software job are pragmatists. They'll use imperative, OOP, and FP where it helps, but aren't typically zealots. Going full FP is quite ivory tower and you'll encounter resistance.

While FP creates functions that never fail, without types you'll still miss cases. Making all functions total results in inflexible code and is a lot of work. This defeats the purpose of using a dynamic language. Since FP functions are pure, you do not need mocks, only stubs. This makes this easier to test, and your tests much smaller. This makes attaining 100% test coverage a much easier possibility. However, even if you do, you'll still have bugs. This is because types will cover the cases you and/or your language miss, or unit tests typically only test for working functions. They don't test for "does the app work" like end to end/functional tests do. You still need Unit Tests. You still need Functional Tests.

Beyond those, no catch.

## What if I work in a non-FP framework like Angular, React, Vue, etc?

The good news is that you can learn and utilize FP techniques in non-FP code bases working with non-FP developers. This helps you learn in a safe environment, implement new things slowly, yet still provide business value. Many FP concepts are already in those code bases such as React's render being a pure function, [Redux](https://redux.js.org/)/[ng-store](https://github.com/ngrx/store)/[Vuex](https://vuex.vuejs.org/) abstracting away side effects & helping enforce immutable data. Some of [RxJS](https://rxjs-dev.firebaseapp.com/) methods have a lot in common with basic list comprehensions.

## What Does "Real-World" Mean?

Languages like JavaScript, TypeScript, Python, Go, and Java are languages you can get a job using at the time of this writing. They're all used in web development, data science, and building REST API's. You can use them and work with non-functional programmers in the same code base and library ecosystem. While it's slowly changing, it currently is hard to get a job using any programming language, and functional languages in particular. Tech industry interviews are broken, hiring for what someone perceives you know with their bias vs hiring for helping someone learn. Companies hire for someone knowing a particular language or framework vs. ability to learn new ones. HR uses algorithms that exclude large swaths of qualified candidates with no one knowing, or knowing but unable to fix. Many managers are afraid to use non-standard languages because they don't think they can hire people to maintain the code base if you or your FP co-workers leave.

[Not everyone](http://www.youtube.com/watch?v=vpcKnqyNdSQ&t=21m28s) wants to learn FP.

Despite the tagline "more jobs than available candidates", it's hard enough to get a job in software, even if you have a job already. It's even harder when you learn a non-popular programming style and a non-popular language.

I believe life is short and priority #1 should be to have fun.

> We're not here for a long time, we're here for a good time.

However, It would be disingenuous to teach you something knowing it would hurt your career.

Therefore, this guide is meant to teach you concepts you can use to benefit your current work in "normal" programming languages as well as ensuring you still can get a job "using Java" if you wish. Part of the skill, and challenge, of using FP in the current climate is co-existing with non-functional programmers in non-functional programming languages. The good news is that JavaScript, Python, and other dynamic languages have all you need built into the language to start programming FP while co-existing with code that isn't FP. Even strongly typed class ones like Java, C#, and Go do as well.

## Real-World Functional Programming

This book will teach you all you need to know to start using Functional Programming in the code you write in your day to day job. We will cover all the basics, what to practice to get better, and how to compose entire programs using just functions. Lastly, we'll give you various strategies for easing it into existing codebases and teams. We'll cover it from both perspectives; back-end where you build API's and front end where you build UI's. This includes some changes around the various ways of testing.

While our examples are in dynamic, interpreted languages like [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [Python](https://www.python.org/), and [Lua](https://www.lua.org/), you can use any language that has functions with inputs, outputs, and higher order functions. We'll show examples from other languages that help corroborate existing concepts such as [Go](https://golang.org/) error handling and [Elixir](https://elixir-lang.org/) matching syntax.

## Assumed Knowledge

This book assumes you know the basics of programming. You know what procedural/imperative line by line code is like such as `bash` or `shell`, you're at least familiar with [Object Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming) like Java or C# (creating classes), and have written some unit tests at least once in your life. We also assume you know how functions, scope, and closures work in JavaScript, Python, or Lua, although we'll do a refresher on closures since it can be helpful to understand the nuances.

## Using This Book

You are welcome to skip around the sections. However, we encourage you to read the pure function section at least once. The most important concept, and implementation details of Functional Programming are based on pure functions. If you only read one thing in this book, that's the chapter to read.

## Learning The Rules

Functional Programming has rules. They're often mathematical rules. This book doesn't cover math, though, just the core parts that apply to programming. You'll love functional programming if you like structure. What first drew me to Object Oriented Programming was all the rules. I figured more rules means more structure, and more ways to ensure my code works and looks nice. Little did I know those rules sounded strong and defined when I started, but turned out very wishy washy and hard to define. That, and even in OOP I still had bugs despite trying my best using the rules.

FP is the opposite. It's based on math, is more testable than OOP and imperative, and clearly defined. Yet you can still only use parts in non-FP code. This means you can learn the rules while still working in your existing codebases and styles. This book is written in a relaxed style since we're not covering types which help reinforce the rules. I'd rather you learn the concepts, get comfortable playing with them, and not worry if you're doing it "100% mathmetically correct". Like OOP, design patterns, unit testing, or behavior driven design, you can do a little bit and still gain a lot of value.

Some of the rules seem simple. If you're coming from OOP, they can appear almost _too_ simple. That was my biggest pill to swallow. I had learned to loathe functions just floating around. "That's imperative, unorganized, un-testable code. It belongs in a proper class with its functionality abstracted in a folder somewhere". As you learn and grow, all the same problems of learning programming, learning OOP, design patterns, testing, etc will manifest AGAIN. You may panic if you don't know how to organize things. You may struggle on how to expose a public interface like you did in OOP for testing purposes. You may look at the FP code you've created and not like it immediately after. You might even go way too far down a path just to learn a particular technique with no easy way to undo it. You may not even grok why you're doing this. It will be hard. You'll need to take multiple breaks.

Those are all normal and part of learning. FP is a new way of thinking and writing code, and a lot of the amateur behaviors and feelings you may have done 5, 10, 20 years ago you suddenly start doing again. This can at first be quite damaging to the self-esteem. However, if you've been programming for awhile, you know that learning is all we programmers do. If you look at it like that, it can be a wonderful oppoturunity. Learning another OOP language, such as going from Java to C# is challenging, but fun because you have a strong base and they have a lot in common. Going from a typed OOP language such as Java to an untyped one like Python, or Java to Go can be more challenging because you no longer have OOP, but you still have types and familiar error handling. You really stretch yourself and grow here. After awhile, however, it stops getting super hard, and you don't feel like you're growing or stretching yourself. With enough practice and learning resources, learning a new language doesn't really change your core assumptions about life. They all have functions, some form of compile time or runtime types. It gets boring.

FP can really make you start over, from scratch, about how you think about programming. You only get these types of opportunities two or three times in your life. First, when you learn programming, and second, when you learn a new type of programming. Recognize the opportunity, and understand the longer you've been programming, the more of the chemistry and physical structure of your brain that will start to change once you understand and apply the concepts. That _can_ be painful and time consuming, but like [working out](https://jessewarden.com/2012/06/notes-on-completing-round-1-of-p90x.html), it [pays off](https://jessewarden.com/2014/01/fitness-progress-in-2013.html). A pure function only has 2 rules, but it can take 2 years for you to fully realize what those 2 rules "mean".

## What We're Not Going To Cover

To simplify things and enable you to use these concepts in dynamic languages, we're not going to cover anything with strong types, nor Category Theory. While you'll reap some of the benefits of Category Theory in what you'll learn here, we're not covering Functors or Monads for example.  If you wish to learn more about Category Theory in a pragmatic way, check out [Dr Boolean's Mostly Adequate Guide](https://drboolean.gitbooks.io/mostly-adequate-guide-old/content/). If you wish to learn more about strong types, check out language documentation that supports functional programming with strong typing such as [Elm](http://elm-lang.org/), [PureScript](http://www.purescript.org/). For JavaScript, while not purely functional, [TypeScript](https://www.typescriptlang.org/), or [Flow](https://flow.org/) are good options as well.

We're also not going to cover effect handling such as [Algebraic Effects](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/08/algeff-tr-2016-v2.pdf) which is what [React Hooks](https://reactjs.org/docs/hooks-intro.html) are based on. If you're interested, Daan Leijen goes over them in detail in [this video](https://www.youtube.com/watch?v=hrBq8R_kxI0) using his [Koka language](https://github.com/koka-lang/koka).

We're not covering any Lambda Calculus.

## What We ARE Going to Cover

We'll cover:

1. Pure Functions and Immutability
2. Basic Lenses
3. List Comprehensions
4. Curry and Partial Applications
5. Composing Functions
6. Algebraic Data Types
7. Optics 
8. Debugging
9. Testing
10. Working With Others

### Pure Functions and Immutability

The most important chapter in the book, and the only one you need to read, we'll cover pure functions. You'll learn the rules, and the how and why of embracing immutability.

### Basic Lenses

Getting and setting data in dynamic languages has widespread null pointers, both from your own data and dynamic data you get from various back-ends. We'll show you safe ways of getting and setting data, and give you your first taste of lenses.

### List Comprehensions

There are no loops in functional programming, only recursion. However, many dynamic, non-FP languages aren't made for recursion, and it can crash your code. So many developers, and language designers, have brought over ways of looping in FP languages called "list comprehensions", and made them feel like normal loops. We'll cover "The Big 3", and a few more.

### Curry and Partial Applications

Armed with pure functions, lenses, and list comprehensions, you're ready to start building FP programs by composing functions. However, it's quite hard without curried functions and partial applications, so we'll cover those here. We'll also do a refresher on closures since that's how they enable curried functions in dynamic languages. 

### Composing Functions

We'll cover how you utilize functions together, mainly in pipelines, to build more powerful functions, and entire applications.

### Algebraic Data Types

We'll cover Maybes, Results, and Validations. Using Maybes, you'll have a weapon against null pointer exceptions or "undefined is not a function". Using Results, you'll have synchronous version of `Promise`. We'll learn how Validators can be used for validating user input in a pure way, API input, and help you construct total functions. Using what you learned above, you'll learn how you can compose these together.

### Optics

We'll revisit lenses for more advanced uses called optics. We'll cover how to use these techniques for parsing and writing data in a pure way.

### Debugging

Debugging FP is a lot different than imperative. Just like when you look at an electron you then collapse the wave function, so too does debugging a pure function make it not pure. We'll take a pragmmatic approach and show you some techniques to help.

### Testing

Testing your FP code gets both easier and harder. Removing the need from mocks greatly simplifies things; you only need simpler stubs. However, that free time you gained must now be applied to code correctness. Some unit tests can help here, but you're better off writing functional tests. Before you can do that, however, you'll want one more pass on runtime types. Since making total functions is often a waste in dynamic languages, you're better off using property/fuzz tests to ensure your functions stay pure despite different inputs. We'll cover all 3.

### Working With Others

Software is about people. Programming can be a solo art, but you're often working with other programmers. We'll cover how to introduce FP slowly in your existing code bases and how to pitch it to others.

## Nomenclature

Coming from an art background and not a computer science one, I tend to abuse terms or use many interchangeably (i.e. imperative and procedural). Below are definitions of commonly used ones throughout the book. While they may make sense in context, they can possibly be confusing if not clear exactly what one means.

### arguments / parameters

Functions take in arguments and sometimes return values. The arguments are the named variables between the parenthesis:

```javascript
function gimmeDat(bass) {
    ...
}
```

In this case, the function `gimmeDat` takes 1 argument, called `bass`. I'll often call that "arguments" or "parameters" which both effectively mean the same thing as far as this book is concerned.

### shell / bash

When you open a terminal, such as a Command Prompt on Windows or a Terminal in Mac or Linux, you typically write "shell code" in a "bash window". When we refer to "shell" or "bash", we're talking about writing commands in that terminal window.

> Just run `npm install`

Means open a Terminal, `cd` to the directory of where your code is, and type `npm install` and press <kbd>Enter</kbd> to execute that command.

## Formatting Assumptions

Below are explanations around how certain code is formatted through this book.

### Code

When referring to code specific things like a function, we'll write the `function` like that. This implies it is code.

### Bash, Shell, and Terminal

When referring to shell/bash/terminal, we'll wrap commands with similar syntax like running `npm install` or `cd`'ing (change directory).

### Operation or NOOP

An operation that takes inputs and that may return an output is called a function. However, some languages distinguish between them. They'll say an operation is a function that takes an input but operates on the data and doesn't return anything. In that sense, `console.log` would be an operation whereas a function would be `Math.abs`.

However, there is something called a "Noop" or "No Opt" which is slang for "No operation". This is a function that takes an input, but doesn't return a value. In that sense, `console.log` would be a Noop. Completely backwards, I know.

Whatever you call them, we try to avoid using Noops in Functional Programming: functions that do not return values. Typically Noops have side effects which is what we try to avoid or push to the sides of our code.

## Code Formatting

When writing code, we'll either do it short form like `const yoDog = () => console.log('sup!')` or long form like:

```javascript
const yoDog = () => console.log('sup!')
```

### Strings

We use single `'` and double `"` quotes interchangeably and each one has the same meaning: it's a `String`. We only whip out the template strings when building larger strings through dynamic data:

```javascript
const you = "You are " // double
const amaze = 'awesome!' // single
const bigOleMessage = `${you}${amaze}` // template
```

### Logging

We'll vary between 3 forms of logging to show you the values of variables and return values of functions. Sometimes we'll be explicit via `console.log` and the value commented out to the right of the `console.log`:

```javascript
const MAX_TREBLE = 100
const maxTheTreble () => MAX_TREBLE
console.log(maxTheTreble) // 100
```

Other times we'll just use `log`:

```javascript
const log = console.log
const MAX_TREBLE = 100
const maxTheTreble () => MAX_TREBLE
log(maxTheTreble) // 100
```

Other times, we'll just write the commented result next to the function itself:

```javascript
const maxTheTreble () => MAX_TREBLE // 100
```

But often below it:

```javascript
const maxTheTreble () => MAX_TREBLE
// 100
```

### Repeating Code

In order to reduce how much code you have to look at and so we can focus on core ideas, we'll often imply "the code we already covered, but I'm not writing again" or "code is here, but we don't care about it for what we're currently talking about".

For example, in the above, we'll write:

```javascript
const MAX_TREBLE = 100
const maxTheTreble () => MAX_TREBLE
```

And then later, talking about the same code, but 1 addition to it, we'll replace the stuff we already saw with ellipsis (3 dots):

```javascript
...
console.log(maxTheTreble()) // 100
```

This includes function bodies. The below function, we don't care about the implementation, so we just put an ellipsis (3 dots like this ...) in there to imply "there is code in here, but it's not important to focus on right now": 

```javascript
const someComplicatedFunction = () => {
    ...
}
```

### Arguments No One Cares About vs. Catch All

Some functions will give arguments that we'll never use. [F# calls it the wildcard pattern](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/pattern-matching#wildcard-pattern); Elixir calls it [the underscore pattern](https://hexdocs.pm/elixir/master/naming-conventions.html). Some [linters](https://eslint.org/) in JavaScript don't allow you to define variables and parameters that aren't used, whereas some Type systems like TypeScript don't allow you to define callbacks that don't follow the type signature thus requiring you define the variable to satisfy the type signature even though you're not going to use it.

For us, we just follow the `Elixir` and `Elm` way of doing things using an underscore `_`:

```javascript
const validateAlotOfData = data =>
    validate(data)
    .matchWith({
        Success: _ => coolDoOtherThings()
        , Failure: error => reportError(error)
    })
```

Note in the above, we don't care about the details of a successful validation. If it validated, that's good enough for us, no need to care about the value so we just use `_` to imply it's there.

For [Underscore](https://underscorejs.org/) or [Lodash](https://lodash.com/) fans, this can be confusing and imply you're passing the Lodash object as a parameter. We're not, we are simply saying there is an argument here, but we don't care about it and have no intention to use it.

In `Elixir` and `Elm`, it can have double meanings such as "I don't care" or "everything else, catch all, the default". For example, here is an Elixir case statement interpreting some command-line input:  

```elixir
case input do
    "sup" ->
        "sup yo!"
    "dude" ->
        "duuuude...."
    "humor me" ->
        "Two guys walk into bar, the 3rd one ducks."
    _ ->
        "Unknown input."
```

The `_` in this case operates just like a `default` would in a JavaScript `switch` statement:

```javascript
switch(input) {
    case "sup":
        return "sup yo!"
    case "dude":
        return "duuuude...."
    case "humor me":
        return "Two guys walk into bar, the 3rd one ducks."
    default:
        return "Unknown input."
}
```

### Argument Parentheses

Arrow functions in JavaScript have their arguments work like function declarations and function expressions, but have an additional feature for single arguments. A single argument function declaration looks like:

```javascript
function formatName(person) {
    return person.lastName + ', ' + person.firstName
}
```

A single argument anonymous function expression:

```javascript
formatName = function(person) {
    return person.lastName + ', ' + person.firstName
}
```

However, there are 2 ways we can do the same with Arrow functions. You can either use the parens:

```javascript
formatName = person => {
    return person.lastName + ', ' + person.firstName
}
```

Or omit them:

```javascript
formatName = person => {
    return person.lastName + ', ' + person.firstName
}
```

It works the same even if you utilize the Arrow function's ability to not use squiggly braces nor the `return` keyword:

```javascript
formatName = person =>
    person.lastName + ', ' + person.firstName
```

This book uses the syntax above heavily to shorten how much you have to read. It also has the subtle effect of writing imperative code painful on purpose. As soon as a function "needs to do more than 1 thing" you suddenly have to add the squiggle braces and the `return` keyword back.

### Function Alignment

For small functions, we'll write them like this, `const yo = () => 'sup'` inline in the sentence. However, you'll sometimes see those 1 line functions on 2 lines:

```javascript
const yo = () =>
    'sup'
```

vs. how it was shown inline:

```javascript
const yo = () => 'sup'
```

We try to follow the [Elm styling](https://elm-lang.org/docs/style-guide) around functions where you put the function definition on the first line, then the function body on the second. This includes manually curried functions like:

```javascript
const ping = request => url =>
    request.get(url)
```

This ensures you don't confuse the arguments with the function body:

```javascript
const ping = request => url => request.get(url)
```

While the above is legal, it's unclear where the last function's argument is, which is important for curried functions, and where the function body begins.
