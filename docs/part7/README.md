# Optics

Optics are a way to build pure functions, called lens functions, that allow you to look at and modify large Objects in an immutable, sometimes total way. In [Part 2](../part2/README.md) we covered basic lenses such as `get` and `set` in Lodash, Ramda's lenses via `lensPath` and `view`, including Ramda's main Traversal called `over`.

In this chapter we'll introduce you to advanced ways of writing lenses such as Isomorphisms, incorporating total functions into Prisms, and show you how you can combine lenses via composing them into advanced Traversals which are loops that use lenses.