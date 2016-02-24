// UMD boilerplate (from Rollup)
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
  typeof define === "function" && define.amd ? define(factory) : (global.ReactiveProperty = factory());
}(this, function () { "use strict";

  // Error messages for exceptions thrown.
  var errors = {
    tooManyArgsConstructor: "ReactiveProperty(value) accepts only a single argument, the initial value.",
    tooManyArgsSetter: "reactiveProperty(newValue) accepts only a single argument, the new value.",
    onNonFunction: "ReactiveProperty.on(listener) only accepts functions, not values.",
    onArgs: "ReactiveProperty.on(listener) accepts exactly one argument, the listener function."
  };

  // This function generates a getter-setter with change listeners.
  return function ReactiveProperty(value){

    // An array of registered listener functions.
    var listeners;
    
    // Check for too many arguments.
    if(arguments.length > 2) {
      throw Error(errors.tooManyArgsConstructor);
    }

    // This is the reactive property function that gets returned.
    function reactiveProperty(newValue){
    
      // Check for too many arguments.
      if(arguments.length > 1) {
        throw Error(errors.tooManyArgsSetter);
      }
      
      // This implements the setter part of the setter-getter.
      if(arguments.length === 1){

        // Track the new value internally.
        value = newValue;

        // Notify registered listeners.
        if(listeners){
          for(var i = 0; i < listeners.length; i++){
            listeners[i](value);
          }
        }

        // Support method chaining by returning 'this'.
        return this;
      }

      // This implements the getter part of the setter-getter.
      return value;
    }

    // Registers a new listener to receive updates.
    reactiveProperty.on = function (listener){

      // Check for invalid types.
      if(typeof listener !== "function"){
        throw Error(errors.onNonFunction);
      }

      // Check for wrong number of arguments.
      if(arguments.length > 1 || arguments.length === 0){
        throw Error(errors.onArgs);
      }

      // If no listeners have been added yet, initialize the array.
      if(!listeners){
        listeners = [];
      }

      // Register the listener.
      listeners.push(listener);

      // If there is an initial value, invoke the listener immediately.
      if(typeof(value) !== "undefined" && value !== null){
        listener(value);
      }

      // For convenience, the listener is returned.
      return listener;
    };

    // Unregisters the given listener function.
    reactiveProperty.off = function (listenerToRemove){
      if(listeners){
        listeners = listeners.filter(function (listener){
          return listener !== listenerToRemove;
        });
      }
    };

    return reactiveProperty;
  }
}));
