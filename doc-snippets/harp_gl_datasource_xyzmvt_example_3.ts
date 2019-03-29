// resize the mapView to maximum
map.resize(window.innerWidth, window.innerHeight);

// react on resize events
window.addEventListener("resize", () => {
    map.resize(window.innerWidth, window.innerHeight);
});
