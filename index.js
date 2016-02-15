// A graph data structure with depth-first search.
function Graph(){
  
  // The adjacency list of the graph.
  // Keys are node ids.
  // Values are adjacent node id arrays.
  var edges = {};

  // Gets or creates the adjacent node list for node u.
  function adjacent(u){
    return edges[u] || (edges[u] = []);
  }

  function addEdge(u, v){
    adjacent(u).push(v);
  }

  // TODO test this function
  //function removeEdge(u, v){
  //  if(edges[u]) {
  //    edges[u] = edges[u]
  //  }
  //  adjacent(u).push(v);
  //}

  // Depth First Search algorithm, inspired by
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
  function depthFirstSearch(sourceNodes){

    var visited = {};
    var nodes = [];

    sourceNodes.forEach(function DFSVisit(node){
      if(!visited[node]){
        visited[node] = true;
        adjacent(node).forEach(DFSVisit);
        nodes.push(node);
      }
    });

    return nodes;
  }

  // The topological sort algorithm yields a list of visited nodes
  // such that for each visited edge (u, v), u comes before v in the list.
  // Amazingly, this comes from just reversing the result from depth first search.
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
  function topologicalSort(sourceNodes){
    return depthFirstSearch(sourceNodes).reverse();
  }
  
  return {
    adjacent: adjacent,
    addEdge: addEdge,
    //removeEdge: removeEdge,
    depthFirstSearch: depthFirstSearch,
    topologicalSort: topologicalSort
  };
}


// Simplistic requestAnimationFrame polyfill.
var nextFrame = (typeof requestAnimationFrame === "undefined") ? setTimeout : requestAnimationFrame;

// Returns a debounced version of the given function
// that will execute on the next animation frame.
// Similar to http://underscorejs.org/#debounce
//
// The reason for using the next animation frame is that since
// the display is only really updated every animation frame,
// the user will not see any updates that happen more frequently than
// each animation frame. So, the logic here is to queue up changes until
// the next animation frame rolls around, then digest all the changes at once.
//
// For example, if mouse move events fire three times during the time gap between two
// animation frames, only a single digest will be triggered, and that will use the
// most recent values of the three mouse move events (throwing away the first two).
// This is what we want, because if a digest occurred synchronously on each mouse event,
// there would be more digests than necessary, as the user will only see the state of things
// at the next animation frame.
function debounce(callback){
  var queued = false;
  return function () {
    if(!queued){
      queued = true;
      nextFrame(function () {
        queued = false;
        callback();
      }, 0);
    }
  };
}

var graph = new Graph();
var nodeIdCounter = 0;
var changedNodes = {};
var nodes = {};

function digest(){
  var sourceNodes = Object.keys(changedNodes).map(parseInt);
  var ids = graph.topologicalSort(sourceNodes);
  ids.forEach(function (id){
    nodes[id].evaluate();
  });
}

var queueDigest = debounce(digest);

function nodeChanged(node){
  changedNodes[node.id] = true;
  queueDigest();
}

function ReactiveNode(evaluate){
  var node = {
    id: nodeIdCounter++,
    evaluate: evaluate || function (){}
  };
  nodes[node.id] = node;
  return node;
}

function ReactiveProperty(value){
  var node = ReactiveNode();
  var reactiveProperty = function(newValue){
    if(!arguments.length){
      return value;
    } else {
      value = newValue;
      nodeChanged(node);
    }
  };
  reactiveProperty.node = node;
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

  var node = ReactiveNode(function (){
    var args = dependencies.map(function (d){
      return d();
    });
    value = callback.apply(null, args);
  });

  dependencies.forEach(function (d){
    graph.addEdge(d.node.id, node.id);
  });

  var reactiveFunction = function (){
    return value;
  };

  reactiveFunction.node = node;

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
