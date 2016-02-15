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

module.exports = debounce;
