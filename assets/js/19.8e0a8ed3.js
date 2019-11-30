(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{220:function(t,s,a){"use strict";a.r(s);var n=a(0),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"et-tu-const"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#et-tu-const"}},[t._v("#")]),t._v(" Et tu const?")]),t._v(" "),a("p",[t._v("If a function mutates data that is passed into it, it will affect the outside world, failing to follow the 2nd pure function rule of no side effects. The world, variables and data defined outside of the function, should not change after a function is run. Does that mean "),a("code",[t._v("var")]),t._v(", "),a("code",[t._v("let")]),t._v(", and possibly even "),a("code",[t._v("const")]),t._v(" are off limits?")]),t._v(" "),a("p",[t._v("They are not off limits. Just use them inside a pure function.")]),t._v(" "),a("h2",{attrs:{id:"playing-thinking-in-procedural"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#playing-thinking-in-procedural"}},[t._v("#")]),t._v(" Playing & Thinking in Procedural")]),t._v(" "),a("p",[t._v("A lot of time in programming, we're writing procedural code and storing those results in local variables. Local variables are variables only used for the life of the function, and are intentionally put there to be used by a closure. This could be for a variety of reasons.")]),t._v(" "),a("ul",[a("li",[t._v("playing with ideas")]),t._v(" "),a("li",[t._v("teaching")]),t._v(" "),a("li",[t._v("working on a complicated algorithm and want instant feedback")]),t._v(" "),a("li",[t._v("want to easily debug or log each line or to inspect variables")]),t._v(" "),a("li",[t._v('easier for you to think and build code this way vs. "ALL PURE FUNCTIONS"')]),t._v(" "),a("li",[t._v("the above with Test Driven Development / Red Green Refactor")])]),t._v(" "),a("p",[t._v("For example, here is parsing URL parameters manually instead of using a library:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" log "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("log\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" url "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/api/search?name=jesse"')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" query "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("split")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'?'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '/api/search', 'name=jesse' ]")]),t._v("\nquery "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// name=jesse")]),t._v("\nquery "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("split")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'='")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" key "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" value "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\nquery "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("key"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" value"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// { name: 'jesse' }")]),t._v("\n")])])]),a("p",[t._v("It's convenient to create temporary "),a("code",[t._v("let")]),t._v(" and "),a("code",[t._v("const")]),t._v(" variables in a procedural way to play with ideas. You can log each line to see exactly what is happening to learn or find mistakes. This is the raw leggos and clay of dynamic languages and should be encouraged.")]),t._v(" "),a("h2",{attrs:{id:"pure-lets"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pure-lets"}},[t._v("#")]),t._v(" Pure lets")]),t._v(" "),a("p",[a("strong",[t._v("Solution")]),t._v(": Follow the pure function rule and you're fine.")]),t._v(" "),a("p",[t._v('This behavior and style of writing is still encouraged. Many of us coming from Imperative backgrounds thinking in terms of "how" something should work vs. "what" should happen. If this mode of thinking is easier for you, then go for it! You can still write this way and keep things pure if you just follow the 2 rules. Let\'s take the above and make it mostly pure.')]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" log "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("log\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" url "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/api/search?name=jesse"')]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("parseQuery")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("url")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" query "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("split")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'?'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '/api/search', 'name=jesse' ]")]),t._v("\n    query "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// name=jesse")]),t._v("\n    query "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("split")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'='")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" key "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" value "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    query "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("key"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" value"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("query"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// { name: 'jesse' }")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" query\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("parseQuery")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// { name: 'jesse' }")]),t._v("\n")])])]),a("p",[t._v("Copy pasta coding 🍝! Notice that we just copy and pasted the code inside a function. It follows the same input, same output rule. The outside world part we need, the "),a("code",[t._v("url")]),t._v(", is passed into the arguments. The "),a("code",[t._v("query")]),t._v(", although it's a "),a("code",[t._v("let")]),t._v(" variable, it only exists for the life of the function and doesn't affect the outside world. Same for the "),a("code",[t._v("key")]),t._v(" and "),a("code",[t._v("value")]),t._v(" are constants, but they too only exist inside the function.")]),t._v(" "),a("p",[t._v("The "),a("code",[t._v("log")]),t._v(" technically breaks the being affected by the outside world, and affecting the world after its run. He's a noop, though, a function that returns no value so we assume it \"does no operation\". You'll start to develop a 6th sense when you see noops, they probably indicate side effects happen after you call the function. We also use the "),a("code",[t._v("log")]),t._v(" as a closure variable. For showing how function purity works, the "),a("code",[t._v("log")]),t._v(" is harmless for now. Editor: FIXME. See "),a("router-link",{attrs:{to:"/part9/log_purity.html"}},[t._v("Part 9: Logging & Purity")]),t._v(" to see a counterpoint to this.")],1),t._v(" "),a("h2",{attrs:{id:"const-ain-t-so-constant"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#const-ain-t-so-constant"}},[t._v("#")]),t._v(" const Ain't So Constant")]),t._v(" "),a("p",[t._v("The "),a("code",[t._v("const")]),t._v(", or constant, is not a panacea to immutability. While we can define complex objects like Arrays and Objects using "),a("code",[t._v("const")]),t._v(":")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" friends "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🐄'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🐕'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),a("p",[t._v("If we then try to re-assign it, anywhere:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[t._v("friends "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🦆'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\nTypeError"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Assignment to constant variable"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n")])])]),a("p",[t._v("We get an error. However, there are other ways around this:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🦆 '")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '🐄', '🐕', '🦆' ]")]),t._v("\n")])])]),a("h2",{attrs:{id:"pure-const"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pure-const"}},[t._v("#")]),t._v(" Pure const")]),t._v(" "),a("p",[a("strong",[t._v("Solution")]),t._v(": Use immutable return values, assign those to "),a("code",[t._v("const")]),t._v(".")]),t._v(" "),a("p",[t._v("Complex objects like "),a("code",[t._v("Object")]),t._v(" and "),a("code",[t._v("Array")]),t._v(", or even modules and class instances will have methods that can hide mutation; changing a variable's value. Practice immutability by creating new objects, deep clones, or using "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",target:"_blank",rel:"noopener noreferrer"}},[t._v("Destructuring assignment"),a("OutboundLink")],1),t._v(" shown in "),a("router-link",{attrs:{to:"/part1/part1/input_output_side_effects.html"}},[t._v("Same Input, Same Output, No Side Effects")]),t._v(" inside of pure functions.")],1),t._v(" "),a("p",[t._v("Our example above can be changed to pure by using Array destructuring:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("addFriends")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" newFriend")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" newFriend"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("Now, we can add all kinds of friends, multiple times, and it's a pure function, and doesn't really care if "),a("code",[t._v("const")]),t._v(" works like one would assume a constant should work or not:")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" friends "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🐄'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🐕'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" newFriends "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addFriends")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🦆'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '🐄', '🐕' ]")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("newFriends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '🐄', '🐕', '🦆' ]")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" newFriendsAgain "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addFriends")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'🦆'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("friends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '🐄', '🐕' ]")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("newFriends"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '🐄', '🐕', '🦆' ]")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("newFriendsAgain"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// [ '🐄', '🐕', '🦆' ]")]),t._v("\n")])])]),a("h2",{attrs:{id:"conclusions"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#conclusions"}},[t._v("#")]),t._v(" Conclusions")]),t._v(" "),a("p",[t._v("Using "),a("code",[t._v("let")]),t._v(" and "),a("code",[t._v("const")]),t._v(" is fine as long as your function follows the pure function rules of same input, same output, no side effects. Using closure variables and functions, however, is dangerous. As you saw above, "),a("code",[t._v("console.log")]),t._v(" is ok because he's a "),a("code",[t._v("noop")]),t._v(", but most aren't. For closure variables, most are by ref, if they don't come in by your function arguments and affect the output, your function will break the rules and not be pure. Making copies won't work because sometimes closures won't be there causing a null pointer error. As long as you contain the mutations within the life of your function, it's pure, and using "),a("code",[t._v("var")]),t._v(", "),a("code",[t._v("let")]),t._v(", and "),a("code",[t._v("const")]),t._v(" is fine.")])])}),[],!1,null,null,null);s.default=e.exports}}]);