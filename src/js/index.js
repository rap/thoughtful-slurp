var callback = function(){
  // Handler when the DOM is fully loaded
};


// no-jquery document.ready alternative
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
