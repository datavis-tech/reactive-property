// This function generates a getter-setter with change listeners.
function ReactiveProperty(value){

  var listeners = [];

  function property(newValue){
    if(arguments.length > 0){
      value = newValue;
      for(var i = 0; i < listeners.length; i++){
        listeners[i](newValue);
      }
    } else {
      return value;
    }
  }

  property.on = function (){
  }

  return property;
}

module.exports = ReactiveProperty;
