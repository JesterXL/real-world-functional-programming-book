(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{219:function(e,t,a){"use strict";a.r(t);var n=a(0),s=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"using-vs-enforcing-immutability"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#using-vs-enforcing-immutability"}},[e._v("#")]),e._v(" Using vs Enforcing Immutability")]),e._v(" "),a("p",[e._v("In "),a("router-link",{attrs:{to:"/part1/var_and_let.html"}},[e._v("The Case for var and let")]),e._v(", we showed Array destructuring as a way to support immutability instead of relaying on "),a("code",[e._v("const")]),e._v(" to ensure you cannot modify an Array. There is a subtle, but important, attitude there not be missed. We want to encourage a normal way of returning immutable data instead of enforcing immutable data.")],1),e._v(" "),a("p",[e._v("Enforcing immutable data would be using things like "),a("code",[e._v("Object.freeze")]),e._v(", the "),a("a",{attrs:{href:"https://facebook.github.io/immutable-js/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Immutable.js"),a("OutboundLink")],1),e._v(" library, or heavy handed clone methods. "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",target:"_blank",rel:"noopener noreferrer"}},[e._v("Object destructuring"),a("OutboundLink")],1),e._v(" only does shallow copying. If you wish to make a deep copy, you have to do insane syntax:")]),e._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[e._v("clone1")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[e._v("person"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" newStreetName")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=>")]),e._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n        "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("...")]),e._v("person"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        address"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n            "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("...")]),e._v("person"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("address"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n            streetName"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" newStreetName\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n        phoneNumbers"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("...")]),e._v("person"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("phoneNumbers"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),a("p",[e._v("Or get a more reliable clone that inadvertently burns the "),a("code",[e._v("Object.prototype")]),e._v("'s enhancements away:")]),e._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[e._v("clone2")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token parameter"}},[e._v("object")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=>")]),e._v("\n    "),a("span",{pre:!0,attrs:{class:"token constant"}},[e._v("JSON")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("parse")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token constant"}},[e._v("JSON")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("stringify")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("object"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),a("p",[e._v("This is not what Functional Programming is about. It's about using and composing pure functions, not ensuring someone cannot mutate data. If you use pure functions and compose them, you end up not mutating data, and thus there is no reason to enforce it. In the "),a("code",[e._v("clone1")]),e._v(" example above, if we remove the phoneNumbers copying, yes, we'll have a reference to the \"old\" phoneNumbers array. Who cares? Our code only reads it and never sets nor mutates it so don't have to worry.")]),e._v(" "),a("p",[e._v("... however, in the real world, you will be working with non-FP programmers, writing non-FP code, using non-FP libraries. Sometimes knowing how to suss out the mutation, prevent it, or benefit from performance techniques are helpful to support immutability. When dealing with concurrency, you may have other instances of your application mutating data, which is why languages like "),a("a",{attrs:{href:"https://www.erlang.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Erlang"),a("OutboundLink")],1),e._v(" ensure you physically can't mutate data to keep you safe in those concurrent environments.")]),e._v(" "),a("p",[e._v("For atomics like "),a("code",[e._v("String")]),e._v(", "),a("code",[e._v("Boolean")]),e._v(", and "),a("code",[e._v("Number")]),e._v(", they are copied by value, and are easy to clone; by making a new variable/constant or function return value, they give you a new clone.")]),e._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("let")]),e._v(" name1 "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v('"Jesse"')]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("name1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// Jesse")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("let")]),e._v(" name2 "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" name1\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("name2"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// Jesse")]),e._v("\nname2 "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v('"Cow"')]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("name2"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// Cow")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("name1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// Jesse")]),e._v("\n")])])]),a("p",[e._v("For Arrays and Objects, however, favor "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",target:"_blank",rel:"noopener noreferrer"}},[e._v("Destructuring Assignment in JavaScript"),a("OutboundLink")],1),e._v(". Python and Lua are more complicated.")]),e._v(" "),a("h1",{attrs:{id:"object-freeze"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#object-freeze"}},[e._v("#")]),e._v(" Object.freeze")]),e._v(" "),a("p",[e._v("Frameworks like "),a("a",{attrs:{href:"https://redux.js.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Redux"),a("OutboundLink")],1),e._v(" ensure there is only 1 variable in your application. You'll hear developers say it helps avoid prop drilling, or it allows sibling components in the tree to communicate, and those are both true. As an FP'er, you know it's most important feature is to support immutability. You never mutate the data yourself, instead asking the "),a("code",[e._v("store")]),e._v(" to hide the access, and provide functions that allow the data to be changed internally using pure functions.")]),e._v(" "),a("p",[e._v("If you're dealing with a legacy system, or with code not written in using pure functions, using "),a("code",[e._v("Object.freeze")]),e._v(" can help probe where the mutation is occurring in a heavy handed way by triggering an exception wherever the mutation exists. Functional Programming is about returning values, not causing side effects, and throwing errors is just that: intentional side effects.")]),e._v(" "),a("p",[e._v("However, it can be a powerful tool to help find the impurity, fix it, and move forward.")]),e._v(" "),a("p",[e._v("First, ensure your code is in strict mode, typically writing "),a("code",[e._v('"use strict"')]),e._v(" at the top of the file(s). Second, wrap your data in "),a("code",[e._v("Object.freeze")]),e._v(":")]),e._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[e._v("Object"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("freeze")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("myObjectOrArray"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),a("p",[e._v("Anytime code attempts to modify it, it'll throw a "),a("code",[e._v("TypeError")]),e._v(", and you should be able to glean where the offending non-FP code is from the stack trace.")]),e._v(" "),a("p",[e._v("The bad news is, if you leave this code in your program, you're intentionally leaving a side effect (code that can throw an error) in your code. Once you've found the offending mutation, you should remove it if you wish to be pure. Better yet, use this a way to practice Test Driven Development/Red Green Refactor and making code more pure at the same time.")]),e._v(" "),a("p",[e._v("The good news is, if you don't, as long as you don't have any mutation, it'll work just fine with Object destructuring.")]),e._v(" "),a("h1",{attrs:{id:"immutable-js"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#immutable-js"}},[e._v("#")]),e._v(" Immutable.js")]),e._v(" "),a("p",[e._v("The "),a("a",{attrs:{href:"https://facebook.github.io/immutable-js/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Immutable.js"),a("OutboundLink")],1),e._v(" library allows you to use common data types, but in an immutable way. For example, "),a("code",[e._v("Array")]),e._v(" and "),a("code",[e._v("Object")]),e._v(" in JavaScript can easily be used in immutable ways by using Object/Array "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",target:"_blank",rel:"noopener noreferrer"}},[e._v("Destructuring Assignment"),a("OutboundLink")],1),e._v(", but things like "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",target:"_blank",rel:"noopener noreferrer"}},[e._v("Map"),a("OutboundLink")],1),e._v(" and "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",target:"_blank",rel:"noopener noreferrer"}},[e._v("Set"),a("OutboundLink")],1),e._v(" cannot. Also, only some methods of "),a("code",[e._v("Array")]),e._v(" are immutable. Immutable gives you all these data types with methods that are pure, and the data is immutable. They've also added many performance enhancements beyond just memoize (caching) that you may benefit from.")]),e._v(" "),a("p",[e._v("To be clear, you do not need Immutable to write pure functions with immutable data in JavaScript. However, their API is nice, having extra data types is helpful, and gleaning some of the performance benefits is massive icing. For some, having the enforced immutability gives them confidence in their code.")])])}),[],!1,null,null,null);t.default=s.exports}}]);