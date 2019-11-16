(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{227:function(e,t,a){"use strict";a.r(t);var s=a(0),n=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"list-comprehensions"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#list-comprehensions"}},[e._v("#")]),e._v(" List Comprehensions")]),e._v(" "),a("p",[e._v("A list comprehension is a function that takes in an Array, and outputs a different Array. Whereas predicates are pure functions that return "),a("code",[e._v("true")]),e._v(" or "),a("code",[e._v("false")]),e._v(", list comprehensions are very similar, with the goal to help reduce the amount of code required to write loops such as the "),a("code",[e._v("for")]),e._v(" loop. The term popularized in Python, so if you're in JavaScript, you'd say \"Array Comprehensions\".")]),e._v(" "),a("p",[e._v("Pure loops with less code.")]),e._v(" "),a("p",[e._v("Many people sell list comprehensions coming from the Ruby or Python background as a way to do loops with less code. That misses the fundamental goal is to ensure purity. You can create pure functions using regular "),a("code",[e._v("for")]),e._v(" and "),a("code",[e._v("while")]),e._v(" loops, just like you can use the "),a("code",[e._v("var")]),e._v(" and "),a("code",[e._v("let")]),e._v(' keywords, yet still ensure the function is pure. However, they are quite imperative, and you can make mistakes easier. It also has "mutation mindset" such as mutating a list index or keeping track of a current value, which is ok but isn\'t how pure functions work.')]),e._v(" "),a("p",[e._v("In true functional programming, there are no loops, only recursion. We don't care about that, though, because we'll just use the functions that take care of those details for us.")]),e._v(" "),a("h2",{attrs:{id:"the-big-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#the-big-3"}},[e._v("#")]),e._v(" The Big 3")]),e._v(" "),a("p",[e._v("In weight lifting, there is the concept of "),a("a",{attrs:{href:"https://rippedbody.com/the-big-3-routine/",target:"_blank",rel:"noopener noreferrer"}},[e._v("The Big 3"),a("OutboundLink")],1),e._v(". The Squat, Bench Press, and Deadlift. They are the core exercises, with ample sleep and protein, to become strong.")]),e._v(" "),a("p",[e._v("List comprehensions are no different. The Big 3 for them is "),a("code",[e._v("map")]),e._v(", "),a("code",[e._v("filter")]),e._v(", and "),a("code",[e._v("reduce")]),e._v(". Here's a famous picture that helps visualize in pseudo code how they work using emoji 😂:")]),e._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("map")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("🐮"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🥔"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🐔"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🌽"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" cook"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("===")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("🍔"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍟"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍗"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍿"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("filter")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("🍔"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍟"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍗"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍿"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" isVegetarian"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("===")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("🍟"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍿"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n\n"),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("reduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("🍔"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍟"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍗"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" 🍿"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" eat"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("===")]),e._v(" 💩\n")])])]),a("p",[e._v("We'll cover them as well as using 3 additional functions they are used to build, "),a("code",[e._v("every")]),e._v(", "),a("code",[e._v("some")]),e._v(", and "),a("code",[e._v("zip")]),e._v(". Using these with predicates and other pure functions, you'll start to learn the basics of composing, and start to glimpse at how pure functions work well together in a more predictable fashion.")]),e._v(" "),a("p",[e._v("Finally, you'll gain a re-appreciation for an old friend, the "),a("code",[e._v("Array")]),e._v(", and how powerful she is.")]),e._v(" "),a("h2",{attrs:{id:"note-on-browser-node-support"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#note-on-browser-node-support"}},[e._v("#")]),e._v(" Note on Browser / Node Support")]),e._v(" "),a("p",[e._v("Many array comprehensions are being added to the core "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",target:"_blank",rel:"noopener noreferrer"}},[e._v("JavaScript Array class"),a("OutboundLink")],1),e._v(". That said, many will mutate the Array instead of returning a new Array. Even "),a("a",{attrs:{href:"https://lodash.com/docs/4.17.10",target:"_blank",rel:"noopener noreferrer"}},[e._v("Lodash"),a("OutboundLink")],1),e._v(" will occasionally do this. That said, for things like "),a("code",[e._v("map")]),e._v(", "),a("code",[e._v("filter")]),e._v(", etc. we'll be using Lodash instead of the built-in versions merely because the Lodash functions are safe and immutable, and Lodash is an extremely battle tested library. Additionally, the syntax for Lodash and Ramda is based on pure functions taking inputs whereas most Array methods are based on class methods which are subject to being impure because of them being defined on the mutable "),a("code",[e._v("Array.prototype")]),e._v(". Remember the "),a("router-link",{attrs:{to:"/part3/part1/trouble_with_dots.html"}},[e._v("Trouble With Dots")]),e._v(". Modifying class prototypes has fallen out of fashion and is now a moderate security vulnerability. Most modern browsers including Node have good parity on ensuring "),a("code",[e._v("map")]),e._v(" works the same in all browsers and engines. Thus you are welcome to use the native ones if you're so inclined.")],1),e._v(" "),a("p",[e._v("For example, the "),a("a",{attrs:{href:"https://lodash.com/docs/4.17.11#map",target:"_blank",rel:"noopener noreferrer"}},[e._v("map in Lodash"),a("OutboundLink")],1),e._v(" only provides your function with the item in the Array. The native "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map",target:"_blank",rel:"noopener noreferrer"}},[e._v("Array map"),a("OutboundLink")],1),e._v(" however provides the item, the current index, and a reference to the original Array that is being iterated over. That index is very useful in some cases. Just be careful when you go "),a("code",[e._v("theArray.map")]),e._v(" that "),a("code",[e._v("theArray")]),e._v(" is actually "),a("code",[e._v("undefined")]),e._v(" (see the "),a("router-link",{attrs:{to:"/part2/trouble_with_array_access.html"}},[e._v("Trouble With Array Access")]),e._v(").")],1)])}),[],!1,null,null,null);t.default=n.exports}}]);