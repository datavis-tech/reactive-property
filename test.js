var assert = require("assert");
describe("ReactiveProperty", function() {
  describe("#indexOf()", function () {
    it("should return -1 when the value is not present", function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

var Graph = require("./graph.js");
var debounce = require("./debounce.js");

var graph = new Graph();

var node = (function (){
  var idCounter = 0;
  return function (){
    return idCounter++;
  }
}());

var changedNodes = {};
var evaluate = {};

function digest(){
  var sourceNodes = Object.keys(changedNodes).map(parseInt);
  graph.topologicalSort(sourceNodes).forEach(function (id){
    evaluate[id]();
  });
  changedNodes = {};
}

var queueDigest = debounce(digest);

function nodeChanged(id){
  changedNodes[id] = true;
  queueDigest();
}

function ReactiveProperty(value){
  function reactiveProperty(newValue){
    if(!arguments.length){
      return value;
    } else {
      value = newValue;
      nodeChanged(reactiveProperty.id);
    }
  };
  reactiveProperty.id = node();
  return reactiveProperty;
}

function get(reactiveProperty){
  return reactiveProperty();
}

// ReactiveFunction(dependencies... , callback)
function ReactiveFunction(){

  var dependencies = Array.apply(null, arguments);
  var callback = dependencies.pop();

  var value;
  var reactiveFunction = function (){ return value; };
  reactiveFunction.id = node();

  dependencies.forEach(function (dependency){
    graph.addEdge(dependency.id, reactiveFunction.id);
  });

  evaluate[reactiveFunction.id] = function (){
    value = callback.apply(null, dependencies.map(get));
  };

  return reactiveFunction;
}


// TODO add as unit tests
//graph.addEdge(1, 2);
//graph.addEdge(2, 3);
//graph.addEdge(3, 4);
//graph.addEdge(4, 7);
//
//graph.addEdge(1, 6);
//graph.addEdge(6, 7);
//
//console.log(graph.topologicalSort([1]));


var a = ReactiveProperty(5);
console.log(a());
a(6);
console.log(a());

var b = ReactiveProperty(10);

var c = ReactiveFunction(a, b, function (a, b){
  return a + b;
});

var d = ReactiveFunction(a, c, function (a, c){
  return a + c;
});

digest();

console.log(c());
console.log(d());

a(0);
digest();

console.log(d());
