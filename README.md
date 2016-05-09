# reactive-property

A small library for getter-setter functions that react to changes. [![NPM](https://nodei.co/npm/reactive-property.png?mini=true)](https://npmjs.org/package/reactive-property) [![Build Status](https://travis-ci.org/datavis-tech/reactive-property.svg?branch=master)](https://travis-ci.org/curran/reactive-property)

The pattern for creating reusable data visualizations described in [Towards Reusable Charts](https://bost.ocks.org/mike/chart/) is great. However, the boilerplate code for getter-setter functions is a bit cumbersome. *This library creates chainable getter-setter functions so you don't have to.* For more information, see ["Introducing reactive-property" on Medium](https://medium.com/@currankelleher/introducing-reactive-property-4b41a8bdcc8e).

Here's a code example from [Towards Reusable Charts](https://bost.ocks.org/mike/chart/) showing the general pattern with *width* and *height* as example chainable getter-setters.

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

Pros:

 * You don't need to write the getter-setter boilerplate.

Cons:

 * You'll have one more dependency.
 * You'll need to access property via the getter (`my.width()` instead of simply `width`).

## Installing

If you are using [NPM](https://www.npmjs.com), install the library by running this command.

`npm install reactive-property`

Require it in your code like this.

```javascript
var ReactiveProperty = require("reactive-property");
```

You can also require the script in your HTML like this.

```html
<script src="//datavis-tech.github.io/reactive-property/reactive-property-v0.9.0.js"></script>
```

Or use the minified version.

```html
<script src="//datavis-tech.github.io/reactive-property/reactive-property-v0.9.0.min.js"></script>
```

[Try reactive-property in your browser.](https://tonicdev.com/573098b1f32f57120089aef5/573098b1f32f57120089aef6)

## API Reference

* [Creating Properties](#creating-properties)
* [Accessing Properties](#accessing-properties)
* [Method Chaining](#method-chaining)
* [Listening for Changes](#listening-for-changes)

### Creating Properties

<a name="reactive-property-constructor" href="#reactive-property-constructor">#</a> <b>ReactiveProperty</b>([<i>value</i>])

Create a property by invoking `ReactiveProperty` as a constructor function.

```javascript
var reactiveProperty = ReactiveProperty();
```

If *value* is specified, it is set as the initial value of the property. This can be any type (string, number, boolean, object, array, function, null, undefined).

```javascript
var a = ReactiveProperty(3); // The default value is 3.
```

### Accessing Properties 

<a name="getter-setter" href="#getter-setter">#</a> <i>reactiveProperty</i>([<i>value</i>])

If *value* is specified, sets the value of the property (this is the "setter" aspect). The context object is returned to support [method chaining](#method-chaining).

```javascript
a(5);
```

If *value* is not specified, gets the value of the property (this is the "getter" aspect).

```javascript
a(); // Returns 5
```

### Method Chaining

Set up chainable setters by using a context object.

```javascript
var my = {
  x: ReactiveProperty(5),
  y: ReactiveProperty(10)
};
my.x(50).y(100);
```

You can also set up properties this way.

```javascript
var my = {};
my.x = ReactiveProperty(5);
my.y = ReactiveProperty(10);
my.x(50).y(100);
```

### Listening for Changes

<a name="on" href="#on">#</a> <i>reactiveProperty</i>.<b>on</b>(<i>listener(value, oldValue)</i>)

Listens for changes in the property value. Returns *listener*.

The *listener* callback function will be invoked synchronously when the property value is set. If the property has a default value that is not `undefined`, then *listener* is invoked immediately. The special value `null` is considered a defined value and is passed into listeners, whereas setting a property value to `undefined` does not cause the listener to be invoked.

The *listener* callback is invoked with the current property value as *value* and the previous value as the second argument *oldValue* (which may be `undefined` if the value was not previously set).

```javascript
a.on(function(value, oldValue){
  console.log("The value of 'a' changed from " + oldValue + " to " + value);
});
```

<a name="off" href="#off">#</a> <i>reactiveProperty</i>.<b>off</b>(<i>listener</i>)

Removes the given *listener* function that was previously added with [on](#on).

```javascript
function listener(){
  console.log("'a' changed!");
}
a.on(listener);
a.off(listener);
a(5); // The listener is NOT called.
```

For convenenience, the listener function is returned from the call to `on`, so the following patterh also works.

```javascript
var listener = a.on(function (){
  console.log("'a' changed!");
});
a.off(listener);
a(5); // The listener is NOT called.
```

<a name="destroy" href="#destroy">#</a> <i>reactiveProperty</i>.<b>destroy</b>()

Removes all listeners previously added with [on](#on). This is for the case that you know you won't be using a property anymore and want to be sure to avoid memory leaks.

```
a.on(function (){ console.log("'a' changed!"); });
a.on(function (){ console.log("'a' really changed!"); });
a.destroy(); // Removes all listeners.
a(5); // No listeners are called.
```

That covers the entire API. For more detailed example code, have a look at the [tests](https://github.com/datavis-tech/reactive-property/blob/master/test.js).

## Addendum

This library draws ideas from [KnockoutJS Observables](http://knockoutjs.com/documentation/observables.html) and [RxJS Observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md).

I hope you enjoy and benefit from this project!

If you appreciate this Open Source work, please consider [supporting me on Patreon](https://www.patreon.com/user?u=2916242&ty=h).

You can also hire me as a consultant, please reach out with inquiries to curran@datavis.tech.
