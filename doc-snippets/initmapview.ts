const mapView = new MapView({
    canvas: document.getElementById("mapCanvas") as HTMLCanvasElement,
    theme: "resources/berlin_tilezen_night_reduced.json"
});
CopyrightElementHandler.install("copyrightNotice")
    .attach(mapView)
    .setDefaults([
        {
            id: "here.com",
            label: "HERE",
            link: "https://legal.here.com/terms",
            year: 2019
        }
    ]);
mapView.camera.position.set(1900000, 3350000, 2500000); // Europe.
mapView.geoCenter = new GeoCoordinates(16, -4, 0);
mapView.resize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
    mapView.resize(window.innerWidth, window.innerHeight);
});

const baseMap = new OmvDataSource({
    baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
    apiFormat: APIFormat.XYZOMV,
    styleSetName: "tilezen",
    maxZoomLevel: 17,
    authenticationCode: accessToken
});
mapView.addDataSource(baseMap);
