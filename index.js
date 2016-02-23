// UMD boilerplate (from Rollup)
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
  typeof define === "function" && define.amd ? define(factory) : (global.ReactiveProperty = factory());
}(this, function () { "use strict";

  // Error messages for exceptions thrown.
  var errors = {
    tooManyArgsConstructor: "ReactiveProperty(value, [context]) accepts up to two arguments, the initial value and (optionally) the context object.",
    tooManyArgsSetter: "reactiveProperty(newValue) accepts only a single argument, the new value.",
    onNonFunction: "ReactiveProperty.on(listener) only accepts functions, not values.",
    onArgs: "ReactiveProperty.on(listener) accepts exactly one argument, the listener function."
  };

  // This function generates a getter-setter with change listeners.
  return function ReactiveProperty(value, context){
    var listeners;
    
    if(arguments.length > 2) {
      throw Error(errors.tooManyArgsConstructor);
    }

    function property(newValue){
      
      if(arguments.length > 1) {
        throw Error(errors.tooManyArgsSetter);
      }
      
      if(arguments.length === 1){
        value = newValue;
        
        if(listeners){
          for(var i = 0; i < listeners.length; i++){
            listeners[i].call(context, value);
          }
        }
        
        return context;
      }
      
      return value;
    }

    property.on = function (listener){

      if(typeof listener !== "function"){
        throw Error(errors.onNonFunction);
      }

      if(arguments.length > 1 || arguments.length === 0){
        throw Error(errors.onArgs);
      }

      if(!listeners){
        listeners = [];
      }

      listeners.push(listener);

      if(typeof(value) !== "undefined" && value !== null){
        listener.call(context, value);
      }

      return listener;
    };

    property.off = function (listenerToRemove){
      if(listeners){
        listeners = listeners.filter(function (listener){
          return listener !== listenerToRemove;
        });
      }
    };

    return property;
  }
}));
