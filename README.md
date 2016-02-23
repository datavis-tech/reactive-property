# reactive-property

This [tiny](https://github.com/curran/reactiveProperty/blob/master/index.js) library abstracts the getter-setter pattern described in [Towards Reusable Charts (by Mike Bostock, 2012)](https://bost.ocks.org/mike/chart/).

It also adds the ability to react to changes in state.

[![NPM](https://nodei.co/npm/reactive-property.png)](https://npmjs.org/package/reactive-property)

[![Build Status](https://travis-ci.org/curran/reactive-property.svg?branch=master)](https://travis-ci.org/curran/reactive-property)

## Usage

Install the library by running this command.

`npm install reactive-property`

Require it in your code like this.

```javascript
var ReactiveProperty = require("reactive-property");
```

If you're not using NPM, you can require the script in your HTML like this.

```html
<script src="//curran.github.io/reactive-property/reactive-property-v0.6.0.js"></script>
```

Or, you can use the minified version (1.5K).

```html
<script src="//curran.github.io/reactive-property/reactive-property-v0.6.0.min.js"></script>
```

Create your first property.

```javascript
var a = ReactiveProperty();
```

Set its value.

```javascript
a(5);
```

Get its value.

```javascript
a();
```

Listen for changes.

```javascript
a.on(function(value){
  console.log("The value of 'a' changed to " + value);
});
```

Cancel your subscription.

```javascript
var listener = a.on(function(){ console.log("'a' changed!"); });
a.off(listener);
a(5); // The listener is NOT called.
```

Set up method chaining by using a context object.

```javascript
var my = {};
my.x = ReactiveProperty(5, my);
my.y = ReactiveProperty(10, my);
my.x(50).y(100);
```

You can access the context object as `this` in listeners.

```javascript
my.x.on(function(value){
  console.log(this === my); // Prints "true"
});
```

For more detailed example code, have a look at the [tests](https://github.com/curran/reactiveProperty/blob/master/test.js)..

## Background

After many attempts at building "frameworks" for data visualization ([ModelJS](https://github.com/curran/model), [Chiasm](https://github.com/chiasm-project/chiasm)), I have learned that abstractions come at a cost. Much to my dismay, I found that when I wanted to apply Chiasm to a particular project, the abstractions had too much surface area and stood in the way of customization. I found myself starting again from raw D3 examples to get projects done, and noticed that as a project grows in complexity organically, the most common need is to *listen for changes in state*.

**This library is my attempt to create a "micro-framework" that eliminates the getter-setter boilerplate code and provides the ability to listen for changes in state.** It is intentionally minimal, and no other features are provided. This is to minimize the surface area of this library, and make it appealing for others to adopt as a utility. It is intended for use with D3-based projects, as it helps you generate APIs that follow the D3 convention of chainable getter-setters, but it can be used with other libraries too.

This library is "complete" and fully functional as-is. Aside from bugs or edge cases that come up, no new features will be added to this library. This library is designed to be the foundation of larger systems, and additional functionality should arise by composing this library with other code.

## A Note on Immutability

This library is essentially a state container. You will experience totally predictable behavior if you set property values to *immutable values*. For example, if you want a property to represent a list of things, it may be tempting to do this:

```javascript
var myList = ReactiveProperty(["a"]);
myList.on(function (value){ console.log("Updated"); });
myList().push("b"); // Listener does not get invoked.
```

However, in this case, the listener does not get invoked when you push the element onto the array. The same is true for objects.

```javascript
var myObject = ReactiveProperty({ x: 5 });
myObject.on(function (value){ console.log("Updated"); });
myObject().y = 10; // Listener does not get invoked.
```

In order to trigger the listener, you must invoke the setter, like this:

```javascript
var myList = ReactiveProperty(["a"]);
myList.on(function (value){ console.log("Updated"); });
myList(["a", "b"]); // Listener does get invoked.
```

However, let's say you want to use `push`, how could that work?

```javascript
var myList = ReactiveProperty(["a"]);
myList.on(function (value){ console.log("Updated"); });
myList(myList().push(b)); // Listener does get invoked.
```

This looks OK, but what is it really doing? The following code is equivalent.

```javascript
var myList = ReactiveProperty(["a"]);
myList.on(function (value){ console.log("Updated"); });
myList().push("b"); // Object mutated, listener not invoked.
myList(myList()); // Listener does get invoked.
```

In the case of objects:

```javascript
var myObject = ReactiveProperty({ x: 5 });
myObject.on(function (value){ console.log("Updated"); });
myObject().y = 10; // Object mutated, listener not invoked.
myObject(myObject()); // This triggers the listener, but is ugly.
```

The above code does work, but it's actually mutating the value, then passing it into the setter. This is not a good solution.

In situations like this, you're better off using immutable types such as those provided in [Immutable.js](https://facebook.github.io/immutable-js/) for complex value types.

Here's what using immutable types would look like for arrays (Lists):

```javascript
var myList = ReactiveProperty(Immutable.List(["a"]););
myList.on(function (value){ console.log("Updated"); });
myList(myList().push("b")); // Sets the new value, invokes the listener.
```

Here's what using immutable types would look like for arrays (Maps):

```javascript
var myMap = ReactiveProperty(Immutable.Map({ x: 5 }););
myMap.on(function (value){ console.log("Updated"); });
myMap(myMap().set("y", 10)); // Sets the new value, invokes the listener.
```

This is a good solution, and yields predictable behavior that is easy to reason about.

## Contributing

 * If you think this project is cool, please give it a star!
 * If you end up using this in an example on bl.ocks.org, please let me know by creating a GitHub issue, we can link to your example in this README.
 * Feel free to open GitHub issues if you have any questions, comments or suggestions.

I hope you enjoy and benefit from this project!
