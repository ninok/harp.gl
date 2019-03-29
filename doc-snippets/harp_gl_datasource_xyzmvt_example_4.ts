const omvDataSource = new OmvDataSource({
    baseUrl: "https://xyz.api.here.com/tiles/osmbase/256/all",
    apiFormat: APIFormat.XYZMVT,
    styleSetName: "tilezen",
    maxZoomLevel: 17,
    authenticationCode: accessToken
});
