# reactive-property [![Build Status](https://travis-ci.org/curran/reactive-property.svg?branch=master)](https://travis-ci.org/curran/reactive-property)

A small library for getter-setter functions that react to changes.

[![NPM](https://nodei.co/npm/reactive-property.png)](https://npmjs.org/package/reactive-property)

The pattern for creating reusable data visualizations described in [Towards Reusable Charts](https://bost.ocks.org/mike/chart/) is great. However, the boilerplate code for getter-setter functions is a bit cumbersome. This library creates chainable getter-setter functions so you don't have to. For more information, see ["Introducing reactive-property" on Medium](https://medium.com/@currankelleher/introducing-reactive-property-4b41a8bdcc8e).

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

Pros:

 * You don't need to write the getter-setter boilerplate.

Cons:

 * You'll have one more dependency.
 * You'll need to access the property via the getter (`my.width()` instead of simply `width`).

## Installation

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

## Usage

Create a property.

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

Set up method chaining by using a context object.

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

Listen for changes. The callback function will be invoked synchronously when the property value is set. The callback will be passed the current value as the first argument and the previous value as the second argument (may be `undefined` if the value was not previously set).

```javascript
a.on(function(value, oldValue){
  console.log("The value of 'a' changed from " + oldValue + " to " + value);
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

In case you know you won't be using a property anymore and want to be sure to avoid memory leaks, you can remove all listeners with the `destroy()` function like this.

```
a.destroy();
```

That covers the entire API. For more detailed example code, have a look at the [tests](https://github.com/datavis-tech/reactive-property/blob/master/test.js).

A reactive property is similar to [KnockoutJS Observables](http://knockoutjs.com/documentation/observables.html) and [RxJS Observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md).

I hope you enjoy and benefit from this project!

If you appreciate this Open Source work, please consider [supporting me on Patreon](https://www.patreon.com/user?u=2916242&ty=h) or [tip me with ChangeTip](http://curran.tip.me/).

You can also hire me as a consultant, please reach out with inquiries at curran@datavis.tech.
