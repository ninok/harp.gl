class StaticGeoJsonDataSource extends GeoJsonDataSource {
    shouldRender(zoomLevel: number, tileKey: TileKey) {
        return tileKey.mortonCode() === 1;
    }

    getTile(tileKey: TileKey) {
        if (tileKey.mortonCode() !== 1) {
            return undefined;
        }
        return super.getTile(tileKey);
    }
}

class StaticDataProvider implements DataProvider {
    ready(): boolean {
        return true;
    }
    // tslint:disable-next-line:no-empty
    async connect(): Promise<void> {}

    async getTile(): Promise<{}> {
        return geojson;
    }
}

const staticDataProvider = new StaticDataProvider();

const geoJsonDataSource = new StaticGeoJsonDataSource({
    dataProvider: staticDataProvider,
    name: "geojson"
});

mapView.addDataSource(geoJsonDataSource).then(() => {
    setStyleSet();
    askName();
    mapView.canvas.addEventListener("click", displayAnswer);
});
