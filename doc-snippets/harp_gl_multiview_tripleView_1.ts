const mapViews = {
    view1: initMapView(
        "mapCanvas",
        0,
        0,
        "./resources/berlin_tilezen_base.json",
        "./decoder.bundle.js"
    ),
    view2: initMapView(
        "mapCanvas2",
        1,
        0,
        "./resources/berlin_tilezen_night_reduced.json",
        "./decoder.bundle.js"
    ),
    view3: initMapView(
        "mapCanvas3",
        2,
        0,
        "./resources/berlin_tilezen_day_reduced.json",
        "./decoder.bundle.js"
    )
};
