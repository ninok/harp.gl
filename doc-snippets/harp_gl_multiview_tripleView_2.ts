const xyzDataSourceParams = {
    baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
    apiFormat: APIFormat.XYZOMV,
    styleSetName: "tilezen",
    maxZoomLevel: 17,
    authenticationCode: accessToken
};
const dataSources = {
    omvDataSource1: new OmvDataSource(xyzDataSourceParams),
    omvDataSource2: new OmvDataSource(xyzDataSourceParams),
    omvDataSource3: new OmvDataSource(xyzDataSourceParams)
};

mapViews.view1.mapView.addDataSource(dataSources.omvDataSource1);
mapViews.view2.mapView.addDataSource(dataSources.omvDataSource2);
mapViews.view3.mapView.addDataSource(dataSources.omvDataSource3);
