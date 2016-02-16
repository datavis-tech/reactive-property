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

var ReactiveNode = (function (){
  var idCounter = 0;
  return function (){
    return idCounter++;
  }
}());

var changedNodes = {};
var evaluateNode = {};

function digest(){
  var sourceNodes = Object.keys(changedNodes).map(parseInt);
  graph.topologicalSort(sourceNodes).forEach(function (id){
    var fn = evaluateNode[id];
    if(fn) fn();
  });
}

var queueDigest = debounce(digest);

function nodeChanged(id){
  changedNodes[id] = true;
  queueDigest();
}


function ReactiveProperty(value){
  var id = ReactiveNode();
  var reactiveProperty = function(newValue){
    if(!arguments.length){
      return value;
    } else {
      value = newValue;
      nodeChanged(id);
    }
  };
  reactiveProperty.id = id;
  return reactiveProperty;
}

// ReactiveFunction(dependencies... , callback)
function ReactiveFunction(){

  // Parse arguments.
  var dependencies = [];
  for(var i = 0; i < arguments.length - 1; i++){
    dependencies.push(arguments[i]);
  }
  var callback = arguments[arguments.length - 1];

  var value;

  var id = ReactiveNode();

  var reactiveFunction = function (){
    return value;
  };

  dependencies.forEach(function (d){
    graph.addEdge(d.id, id);
  });

  evaluateNode[id] = function (){
    var args = dependencies.map(function (d){
      return d();
    });
    value = callback.apply(null, args);
  };

  reactiveFunction.id = id;

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
