# reactive-property 

This [tiny](https://github.com/curran/reactiveProperty/blob/master/index.js) library abstracts the getter-setter pattern described in [Towards Reusable Charts (by Mike Bostock, 2012)](https://bost.ocks.org/mike/chart/).

It also adds the ability to react to changes in state.

[![Build Status](https://travis-ci.org/curran/reactive-property.svg?branch=master)](https://travis-ci.org/curran/reactive-property)

## Usage

Install the library by running this command.

`npm install reactive-property`

Require it in your code like this.

```javascript
var ReactiveProperty = require("reactive-property");
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

```javasript
my.x.on(function(value){
  console.log(this === my); // Prints "true"
});
```

For more detailed example code, have a look at the [tests](https://github.com/curran/reactiveProperty/blob/master/test.js)..

## Background

After many attempts at building "frameworks" for data visualization ([ModelJS](https://github.com/curran/model), [Chiasm](https://github.com/chiasm-project/chiasm)), I have learned that abstractions come at a cost. Much to my dismay, I found that when I wanted to apply Chiasm to a particular project, the abstractions had too much surface area and stood in the way of customization. I found myself starting again from raw D3 examples to get projects done, and noticed that as a project grows in complexity organically, the most common need is to *listen for changes in state*.

**This library is my attempt to create a "micro-framework" that eliminates the getter-setter boilerplate code and provides the ability to listen for changes in state.** It is intentionally minimal, and *no other features* are provided. This is to minimize the surface area of this library, and make it appealing for others to adopt as a utility in D3-based projects. This library is "complete" and fully functional as-is. Aside from bugs or edge cases that come up, no new features will be added to this library. This library is designed to be the foundation of larger systems, and additional functionality should arise by composing this library with other code.

I hope you enjoy and benefit from this project! Feel free to open GitHub issues if you have any questions, comments or suggestions.
