// set an isometric view of the map
map.camera.position.set(0, 0, 1600);
// center the camera on Manhattan, New York City
map.geoCenter = new GeoCoordinates(40.7, -74.010241978);

// instantiate the default map controls, allowing the user to pan around freely.
const mapControls = new MapControls(map);
mapControls.setRotation(0.9, 23.928);
