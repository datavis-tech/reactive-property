var assert = require("assert");

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
  var listeners;
  function reactiveProperty(newValue){
    if(!arguments.length){
      return value;
    } else {
      value = newValue;

      // TODO test
      //if(listeners){
      //  listeners.forEach(function (listener){
      //    listener(value);
      //  });
      //}
    }
  };
  reactiveProperty.on = function (listener){
    (listeners = listeners || []).push(listener);
    listener(value);
  };
  //TODO test this
  //reactiveProperty.off = function (callback){
  //};
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

    if(!dependency.id){
      dependency.id = node();
    }

    if(dependency.on){
      dependency.on(function(){
        nodeChanged(dependency.id);
      });
    }

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


describe("ReactiveProperty", function() {
  it("should work", function () {
    var a = ReactiveProperty(5);
    assert.equal(a(), 5);

    a(6);
    assert.equal(a(), 6);

    var b = ReactiveProperty(10);

    var c = ReactiveFunction(a, b, function (a, b){
      assert.equal(a, 6);
      assert.equal(b, 10);
      return a + b;
    });

    digest();
    assert.equal(c(), 16);

    var d = ReactiveFunction(a, c, function (a, c){
      assert.equal(a, 6);
      assert.equal(c, 16);
      return a + c;
    });

    digest();
    assert.equal(d(), 22);

    //a(1);
    //digest();
    //assert.equal(c(), 11);
    //assert.equal(d(), 4);
    //console.log(d());
    //
    //
    //console.log(d());
    //
  });
});
