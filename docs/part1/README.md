# Pure Functions

This is the **most important section** of the entire book. If you're in a hurry or have a short attention span, only [read this part](input_output_side_effects.md). wait

Pure Functions are functions that given the same input, they'll give the same output, and have no side effects. A function that takes some arguments will always return the same value and not be affected by variables outside the function, nor will it change variables outside of it. They are the core foundation of all Functional Programming. They are the reason unit tests in FP don't need to use mocks. You don't need to look elsewhere to see what the function did. Instead, you just look at the return value of the function.

They are also surprisingly flexible in their application despite their definition clearly stating that "1 plus 1 equals 2". Many programmers, even those who use FP languages and espouse the benefits, can be lax in how "pure" their code truly is, myself included. Making things too pure is where you'll often see criticism of FP. Ensuring your code is as pure as possible can still lead to software that doesn't work.

Making your code knowingly less pure is **fine**. This will build trust currency with the Pragmatists. At first, you won't have a choice because you won't know any better. Later once you're skilled, you'll recognize the pain and time it'll take to follow the rules and make the right call that it's not worth it. Calling this technical debt in code review doesn't always fly, though, as sometimes the library author or team has their own level of purity they're willing to accept. Sometimes libraries and techniques simply don't exist. Or, they are not ready to use yet, such as Hooks in React version 16.8, but your team is using version <16.7. Your team must use `classes` which have side effects instead of `functions`.

The level of purity you should do is like doing Yoga. You should feel the stretch, but it shouldn't hurt. In the beginning though, everything hurts, heh! That's ok. Your brain is a muscle, too, it can grow stronger through consistent practice.

## What We'll Cover

We'll first cover the 2 rules of same input, same output and the no side effects. In dynamic languages, these rules can be more easily and stealthily broken.

Once you learn function purity and immutability, you'll realize that you're only allowed to use constants instead of variables. We'll cover how you can use them safely.

We'll take an error quest and explore ways in which errors uniquely break function purity. A lot of programming is based around exceptions happening and inspecting the stack trace to debug. That's not how Functional Programming works. We'll show you why, how to avoid them, and what to do instead. 

JavaScript, Python, and Lua allow Procedural, Object-Oriented, and Functional Programming styles. That's why they're so widely used; everyone can play. However, there are a lot of constructs that aren't allowed. We'll cover what isn't allowed, and strategies for using them if you must as well as caveats for unit testing around them. You're going to work with non-FP programmers, writing non-FP code, using non-FP libraries, so this is a survival guide. Be ready to explain "Why I don't use the `this` keyword in my JavaScript code".

Finally, we'll show you how to practice writing pure functions so that you get better at creating, and recognizing, levels of purity. I started my Functional Programming learning journey by writing predicates for a security library. It helps you understand the core parts of your language, see how they can affect purity, yet they are super simple functions so you don't overload your brain as you learn the secrets of the immutable universe.

Another way to practice FP is to write unit tests for those predicates. If you have experience writing unit tests for non-FP code, this might be the most rewarding part for you. Writing unit tests for predicates really helps you learn how FP can make your life easier, how it can reduce your test code, and how it makes your tests easier to maintain.
