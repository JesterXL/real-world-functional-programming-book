# The Specialist

Given how pure functions work, many of languages existing tools are off limits. They differ from language to language, such as how Lua handles Object scope compared to JavaScript for example, but what they all have in common is violating pure function and immutability rules. Thus, they are off limits if you wish to remain pure.

How pure you wish to be is up to you and your team. Pragmatism and deadlines can overrule the list below.

We'll cover each in turn, and offer suggestions on how you can you use some of them safely if possible.

## Function Declarations & Function Expressions

A [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) and [function expression](https://developer.mozilla.org/en-US/docs/web/JavaScript/Reference/Operators/function) both have a bunch of legacy functionality that can break purity rules.

### The this keyword

**Synopsis**: This is a built-in mutation. Stay far away.

The `this` keyword is the cornerstone of how JavaScript supports encapsulating Objects as well as providing support for Object Oriented programming through classes. It also is one of the most common cause of bugs, and responsible for a large amount of text on the internet explaining how scope and `this` works. The keyword `this` can change based on how the function is invoked.

```javascript
// function declaration
function Cow(name) {
    this.name = name
}
// function expression
Cow.prototype.getName = function() { console.log(this.name) }

a = new Cow('a')
console.log(a.name) // a
console.log(a.getName()) // a
b = Cow() // throws Error
c = new (Cow.bind())
console.log(c.getName()) // throws Error
```

There a bunch of different versions of these, depending upon if you use `Object.create` or the `new` keyword vs. not, the `class` keyword, attaching to the prototype vs. emulating static vs. using the `static` keyword, using various Babel plugins to fix, etc. On and on. React 16.8 with the introduction of [Hooks](https://reactjs.org/docs/hooks-intro.html) has moved on, so should you. You no longer have to memorize all the rules, nuances, and compiler/transpiler tricks and use `bind` all over the place. It's freeing.

### arguments

**Synopsis**: Dangerous in closures, but typically only used in edge cases, so as long as you avoid closures, you'll be ok. We recommend you stick to functions that take a specific number of arguments. The `arguments` keyword is only available with function declarations and expressions so we recommend you avoid.

Pure functions can work with variadic functions; functions that take an arbitrary number of arguments. This can be hard to get right so ensure extra unit tests here. The `arguments` keyword, unlike `this`, CAN be depended upon, but can subtly change in the values it has once you start bringing closures.

```javascript
function add() {
    let sum = 0
    for(let i = 0; i<arguments.length; i++) {
        sum += arguments[i]
    }
    return sum
}
add() // 0
add(1, 2) // 3
add(1, 2, 3, 4) // 10
```

### new.target

**Synopsis**: Implies you're ok with `this` and throwing exceptions. Don't use.

### super

**Synopsis**: Like `this`, avoid.

The `super` keyword is for inheritance in Object Oriented Programming. Like `this` it is rife with breaking at various times. In dynamic languages, part of the power is affecting, at runtime, class/Object polymorphism. This power, however, can ensure pure functions have completely different outputs or errors without the function's inputs changing, thus changing the outputs, or having unforeseen side effects from super-class implementations. Like `this`, avoid.

For front-end frameworks which utilize classes to encapsulate Graphical User Interface (GUI) state (i.e. pixels), it is unavoidable. There is a long history of using Object Oriented Programming for UI's. [React](https://reactjs.org/) extends a Component class but encourages you to use Composition over Inheritance. [Angular](https://angular.io) does the same using class decorators but thankfully often employs interfaces and compiler smarts. [Pixi.js](http://www.pixijs.com/) uses a Sprite class to abstract away Canvas pixels.

UI development in general commonly has a lot of side-effects, so do your best to keep most of your work in pure functions.

## Default Arguments

**Synopsis**: Dangerous in closures like `arguments`, and breaks function currying. Should be avoided, unless single argument only for by val types (i.e. `String`, `Number`, etc) which provide pseudo immutability. Use single argument functions carefully.

**Solution**: Favor partial applications over default arguments.

Like variadic functions, functions which have an arbitrary amount of arguments, default arguments have the same challenges. You can create pure functions using them, but unfortunately they break function currying. Most function currying is based around a specific number of arguments, called [Arity](../part4/arity.md), for a function, and creates confusing behavior when you get a function's result back when you were expecting a partial application instead. It is better to favor explicit arguments and then make a partial application for those developers who don't know what to pass or just want to pass less arguments.

As you'll learn later, functions with default arguments are harder to compose because you'll get unintended arguments. When you're explicit with partial applications, it's more clear what argument goes where and the functions can be wired together more easily and predictably.

## Classes

**Synopsis** The `class` keyword should be avoided for the same reasons as using `this` and `super`. Classes are also a lot more difficult to compose.

The whole concept of storing variables as member and static variables inside a class, internal mutable state, causes a lot of side effects. It also ensures you won't get the same output with the same input. Class methods often have no input as they'll handle the inputs by referencing internal data on `this`. They typically don't have outputs either because they are modifying or updating state internally on `this`. As classes start using Inheritance or Composition, they'll be creating even more mutable state internally as they grow in size. Finally, JavaScript's implementation is not immutable, and both `this`, and the class itself, can be modified at runtime leading to various unintended null pointers. These errors or different outputs are not pure.

Like default arguments, classes are a lot harder to compose with.

See Dealing with OOP for strategies on using as safely as possible as at the time of this writing, encountering OOP in code bases you work on is unavoidable.

## throw

**Synopsis**: Do not use `throw`. Instead, return the `Error` in an Object or an Algebraic Data Type that describes what we wrong, similar to Lua's `pcall` or Lua and Go's ability to return multiple return values.

Errors are a challenging side effect. Not only do they prevent return values from even working, but occasionally, they can create situations where data, or the application itself, is in an unknown state vs crashing outright. This breaks the same output rule as well as the side effects rule.

Throwing Errors is supposed to enable developers to read the stack trace to glean where the application broke. Not all stack traces are created equal, nor are they easy to quickly deduce what went wrong. JavaScript is notorious for having source maps that do not map to the source giving red herrings on top of badly written error messages which are red herrings. In imperative style code, you can "find the line where things went wrong". In debugging functional code, you're interested in "why did the function return an error instead of a success". In composed functions and programs, you're interested in "where in this pipeline of functions did my data become wrong". You use imperative style logs, composed helper functions, or even breakpoints in a step debugger for those situations, not stack traces. We never want to intentionally break or crash an application. Instead, we want to clearly explain why a function returned an Error instead of our data.

The exception is in Erlang/[Elixir](https://elixir-lang.org/) or [Akka](https://akka.io/) in Scala/Java where "let it crash" is the norm. You're more interested in application uptime than purity in those cases. For JavaScript, the equivalent is using [pm2](http://pm2.keymetrics.io/) or [Docker](https://www.docker.com/) on [ECS](https://aws.amazon.com/ecs/) and any uncaught [sync](https://nodejs.org/api/process.html#process_event_uncaughtexception) or [async](https://nodejs.org/api/process.html#process_event_unhandledrejection) error means your application is in an unknown state, possibly impure, so you just nuke the entire process/container and get a new one. Since your application is supposedly stateless and uses immutable data, there is no worry about "losing" information as something like [Redis](https://redis.io/) or your Database handles being the single source of truth and state.

Serverless is the same way. While it might be tempting to `throw` since the function will only run for a few milliseconds/seconds anyway on disposable infrastructure, errors should be what they mean: your code is broken, you or your team needs to fix it. See [Part 6 on Algebraic Data Types](../part6) for better return values for errors.
