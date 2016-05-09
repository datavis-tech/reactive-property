# reactive-property [![Build Status](https://travis-ci.org/curran/reactive-property.svg?branch=master)](https://travis-ci.org/curran/reactive-property)

[![NPM](https://nodei.co/npm/reactive-property.png)](https://npmjs.org/package/reactive-property)

A small library for getter-setter functions that react to changes.

The pattern for creating reusable data visualizations described in [Towards Reusable Charts](https://bost.ocks.org/mike/chart/) is great. However, the boilerplate code for getter-setter functions is a bit cumbersome. This library creates chainable getter-setter functions so you don't have to. For more information, see ["Introducing reactive-property" on Mediun](https://medium.com/@currankelleher/introducing-reactive-property-4b41a8bdcc8e).

Here's a code example from [Towards Reusable Charts](https://bost.ocks.org/mike/chart/) showing the general pattern.

```javascript
function chart() {
  var width = 720, // default width
      height = 80; // default height

  function my() {
    // generate chart here, using `width` and `height`
  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };

  return my;
}
```

Here's what the above code can look like when using reactive-property:

```javascript
function chart() {

  function my() {
    // generate chart here, using `my.width()` and `my.height()`
  }

  my.width = ReactiveProperty(720);
  my.height = ReactiveProperty(80);

  return my;
}
```

## Installation

Install the library by running this command.

`npm install reactive-property`

Require it in your code like this.

```javascript
var ReactiveProperty = require("reactive-property");
```

If you're not using NPM, you can require the script in your HTML like this.

```html
<script src="//curran.github.io/reactive-property/reactive-property-v0.7.0.js"></script>
```

Or, you can use the minified version (1.5K).

```html
<script src="//curran.github.io/reactive-property/reactive-property-v0.7.0.min.js"></script>
```

## Usage

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
function listener(){
  console.log("'a' changed!");
}
a.on(listener);
a.off(listener);
a(5); // The listener is NOT called.
```

For convenenience, the listener function is returned from the call to `on`, so the following would also work.

```javascript
var listener = a.on(function (){
  console.log("'a' changed!");
});
a.off(listener);
a(5); // The listener is NOT called.
```

Set up method chaining by using a context object.

```javascript
var my = {
  x: ReactiveProperty(5),
  y: ReactiveProperty(10)
};
my.x(50).y(100);
```

That covers the entire API. For more detailed example code, have a look at the [tests](https://github.com/curran/reactiveProperty/blob/master/test.js).


## Background

Related works:

 * [Towards Reusable Charts (by Mike Bostock, 2012)](https://bost.ocks.org/mike/chart/)
 * [KnockoutJS Observables](http://knockoutjs.com/documentation/observables.html)
 * [RxJS Observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

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

The above solution does work, but it's actually mutating the value, then passing it into the setter. This is not ideal. In situations like this, you're better off using immutable types such as those provided in [Immutable.js](https://facebook.github.io/immutable-js/) for complex value types. Here's what that would look like for arrays (Lists):

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
