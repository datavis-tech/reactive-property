# ReactiveProperty 

This [tiny](https://github.com/curran/reactiveProperty/blob/master/index.js) library abstracts the getter-setter pattern described in [Towards Reusable Charts (by Mike Bostock, 2012)](https://bost.ocks.org/mike/chart/).

It also adds the ability to react to changes in state.

[![Build Status](https://travis-ci.org/curran/reactiveProperty.svg?branch=master)](https://travis-ci.org/curran/reactiveProperty)

## Quick Start

Install the library by running the command

`npm install reactive-property`

Require it in your code like this:

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
a.on(function(){
  console.log("The value of 'a' changed!");
});
```

Cancel your subscription.

```javascript
var listener = a.on(function(){
  console.log("The value of 'a' changed!");
});
a.off(listener);
```

## Example Code

Here's some example code from the tests that demonstrates the functionality of this library.

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

I hope you enjoy this library! Feel free to open GitHub issues if you have any questions, comments or suggestions.
