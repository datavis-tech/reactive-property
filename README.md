# ReactiveProperty
A simple library that generates getter-setters.

This abstracts the getter-setter pattern described in [Towards Reusable Charts - Mike Bostock (2012)](https://bost.ocks.org/mike/chart/);

Here are the tests that demonstrate the functionality of this library:

```javascript

var assert = require("assert");
var ReactiveProperty = require("reactive-property");

describe("ReactiveProperty", function() {

  it("Should construct a property.", function () {
    var a = ReactiveProperty();
    assert.equal(typeof(a), "function");
    assert.equal(typeof(a()), "undefined");
  });

  it("Should construct a property with a default value and get the value.", function () {
    var a = ReactiveProperty(5);
    assert.equal(a(), 5);
  });

  it("Should set and the value.", function () {
    var a = ReactiveProperty();
    a(10);
    assert.equal(a(), 10);
  });

  it("Should set and the value, overriding the default value.", function () {
    var a = ReactiveProperty(5);
    a(10);
    assert.equal(a(), 10);
  });

});
```
