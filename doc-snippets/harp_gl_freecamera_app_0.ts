const app = new FreeCameraApp({
    decoderUrl: "./decoder.bundle.js",
    canvas,
    theme: "./resources/berlin_tilezen_base.json",
    geoCenter
});

app.start();
