// UMD boilerplate (from Rollup)
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
  typeof define === "function" && define.amd ? define(factory) :
  (global.ReactiveProperty = factory());
}(this, function () { "use strict";

  // This function generates a getter-setter with change listeners.
  function ReactiveProperty(value){

    var listeners;

    function property(newValue){
      if(arguments.length > 0){
        value = newValue;
        if(listeners){
          for(var i = 0; i < listeners.length; i++){
            listeners[i](value);
          }
        }
      } else {
        return value;
      }
    }

    property.on = function (listener){
      if(typeof listener !== "function"){
        throw new Error("ReactiveProperty.on(listener) only accepts functions, not values.");
      }
      if(arguments.length > 1 || arguments.length === 0){
        throw new Error("ReactiveProperty.on(listener) accepts one argument, the listener function.");
      }
      if(!listeners){
        listeners = [];
      }
      listeners.push(listener)
      if(typeof(value) !== "undefined" && value !== null){
        listener(value);
      }
      return listener;
    };

    property.off = function (listener){
      if(listeners){
        listeners = listeners.filter(function (listener){
          listener !== listener;
        });
      }
    };

    return property;
  }

  return ReactiveProperty;

}));
