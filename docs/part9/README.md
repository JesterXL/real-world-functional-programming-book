# Testing

There are some problems that are solved by unit testing in Functional Programming, such as not needing mocks and requiring only stubs for dependencies.

Other problems remain, though.

Stubbing only enough to get the test to pass means you've got the minimally required implementation of the dependency. This requires some form of integration testing to ensure you've implemented your stub correctly. Also, as library versions change, public API's may change, so what you had that was correct is now broken in the new version. Finally, are you testing the module and public API or implementation details?

We'll cover why you don't need mocks, why your stubs still aren't good enough, and a refresher on TDD, property tests, and integration tests with Functional Programming since it often has an Object Oriented Programming slant.
