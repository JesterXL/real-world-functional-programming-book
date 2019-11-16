# Getting and Setting Data

A lot of functional programming revolves around functions. Getting and setting data is a crucial part in programming. It's also how you easily violate pure function rules by mutating data or creating null pointer exceptions.

Herein we'll cover the normal ways of getting & setting data, and why that isn't pure. We'll then cover the various safe and terse ways we can get data purely. Finally, we'll cover some basic getting and setting of data using lenses, prisms, and traversals via [Ramda](https://ramdajs.com/docs/) and [Focused](https://github.com/yelouafi/focused).

## I Use Types, Thus Lenses Are An Anti-Pattern

If you use types, you may think lenses are pointless. Why would you get null pointers if everything is typed correctly? I encourage you to learn about lenses for 3 reasons anyway (beyond their advanced usages like in [Haskell](http://hackage.haskell.org/package/lens) which are beyond the scope of this book).

## Limitations on Types

I've you've used a type language for awhile, you know you can still get runtime exceptions around null pointers. Sadly, there are limits of various type systems such as getting items in an `Array` or ensuring a `Number` is within a particular range. When parsing data from unknown sources, types can break down so some typed languages will create super strict parser like [Elm's parser](https://github.com/elm/parser) or [Elm's JSON decoders](https://package.elm-lang.org/packages/elm/json/latest/Json-Decode). This ensures no untyped data can get in and is why lenses aren't used in Elm. Typed languages have some ways of ensuring these problems can't happen, but some languages still have limits of "prove I won't get runtime exceptions, ever!". Languages like [Elm](https://elm-lang.org/) and [Purr](https://github.com/origamitower/purr) can make this claim.

Many of us love types, the value they provide, and are willing to put in the work. Some of us, however, feel more comfortable playing with ideas without types first and using types once our ideas are solidified. Lenses can help fill that gap until you're ready for stricter types.

## You Don't Always Control Your Data

Parsers won't save you when you don't know the exact structure of the data. For example, when doing audit logging with Kafka. You'll take events from various places which are JSON messages. These are from thousands of different applications created over the years which may/may not the exact JSON format you're expecting with all fields there, intact, with reasonable values and expected types. Then you have to process thousands of these a second, schema or not. The same challenge exists with data science around data you don't know and have to clean.

Lenses have the advantage of being able to deal with unknown data safely, in an immutable way.

## When You DO Know Your Data

If you do know your data and it's deeply nested (i.e. have to use 2 or more dots), lenses can really help you write less code that is easier to test. As you'll learn in [Part 8 - Optics](../part8/README.md), you can use lenses to compose with other functions to make functions that work with complex data a lot easier to deal with.
