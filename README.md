# reactive-property 

This [tiny](https://github.com/curran/reactiveProperty/blob/master/index.js) library abstracts the getter-setter pattern described in [Towards Reusable Charts (by Mike Bostock, 2012)](https://bost.ocks.org/mike/chart/).

It also adds the ability to react to changes in state.

[![Build Status](https://travis-ci.org/curran/reactive-property.svg?branch=master)](https://travis-ci.org/curran/reactive-property)

## Quick Start

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
```

Set up method chaining for setters using a context object.

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

## Example Code

Here's some example code from the [tests](https://github.com/curran/reactiveProperty/blob/master/test.js) that demonstrates the functionality of this library.

```javascript
var ReactiveProperty = require("reactive-property");
var assert = require("assert");

describe("Getter-setters", function() {

  it("Should construct a property with a default value and get the value.", function () {
    var a = ReactiveProperty(5);
    assert.equal(a(), 5);
  });

  it("Should set and get and the value.", function () {
    var a = ReactiveProperty();
    a(10);
    assert.equal(a(), 10);
  });

  it("Should set the value, overriding the default value.", function () {
    var a = ReactiveProperty(5);
    a(10);
    assert.equal(a(), 10);
  });

});
```

In addition to setting and getting values, you can also listen for changes using the `on` function. 

```javascript
it("Should react to changes.", function (done) {
  var a = ReactiveProperty();
  a.on(function (){
    assert.equal(a(), 10);
    done();
  }); 
  a(10);
});

it("Should react to the default value.", function (done) {
  var a = ReactiveProperty(5);
  a.on(function (){
    assert.equal(a(), 5);
    done();
  }); 
});

it("Should not react to no value.", function () {
  var a = ReactiveProperty();
  var numInvocations = 0;
  a.on(function (){ numInvocations++; }); 
  assert.equal(numInvocations, 0);
});

it("Should react synchronously.", function () {
  var a = ReactiveProperty();
  var numInvocations = 0;
  a.on(function (){ numInvocations++; }); 
  assert.equal(numInvocations, 0);
  a(10);
  assert.equal(numInvocations, 1);
  a(15);
  assert.equal(numInvocations, 2);
});

it("Should pass the value to the listener as an argument.", function (done) {
  var a = ReactiveProperty();
  a.on(function (value){
    assert.equal(value, 10);
    done();
  }); 
  a(10);
});
```

Here's how you can unregister a listener.

```javascript
it("Should stop reacting to changes.", function () {
  var a = ReactiveProperty();
  var numInvocations = 0;
  var listener = a.on(function (){ numInvocations++; }); 
  a(10);
  assert.equal(numInvocations, 1);
  a.off(listener);
  a(15);
  assert.equal(numInvocations, 1);
});
```

You can also assign a context object to properties. This gets returned from setters to enable method chaining, and also is passed to listeners as `this`.

```javascript
it("Should accept a context object and return it from setters (method chaining).", function (){

  var context = {};
  context.a = ReactiveProperty(5, context);
  context.b = ReactiveProperty(10, context);

  assert.equal(context.a(), 5);
  assert.equal(context.b(), 10);

  context
    .a(50)
    .b(100);

  assert.equal(context.a(), 50);
  assert.equal(context.b(), 100);

});

it("Should pass the context object as 'this' in listeners.", function (done){

  var context = {};
  context.a = ReactiveProperty(5, context);
  context.b = ReactiveProperty(10, context);

  context.a.on(function (value){
    assert.equal(this, context);
    done();
  }); 
});
```

## Background

After many attempts at building "frameworks" for data visualization ([ModelJS](https://github.com/curran/model), [Chiasm](https://github.com/chiasm-project/chiasm)), I have learned that abstractions come at a cost proportional to their surface area. Much to my dismay, I found that when I wanted to apply Chiasm to a particular project, the abstractions stood in the way of customization and I found myself starting again from raw D3 examples to get projects done. After a project grows in complexity, the most common need is to *listen for changes in state*.

This library is my attempt to create a "micro-framework" that fits will with interactive data visualizations, particularly using D3, and provides the ability to listen for changes in state. It is intentionally minimal, and *no other features* are provided. This is to minimize the surface area of this library, and make it appealing for others to adopt as a utility in D3-based projects.

This library is "complete" and fully functional as-is. Aside from bugs or edge cases that come up, no new features will be added to this library. This library is designed to be the foundation of larger systems, and additional functionality should arise by composing this library with other code.

I hope you enjoy and benefit from this project! Feel free to open GitHub issues if you have any questions, comments or suggestions.
