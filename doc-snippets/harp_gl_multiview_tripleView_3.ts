export const syncMapViews = (srcView: ViewControlPair, destView: ViewControlPair) => {
    const ypr = srcView.mapControls.yawPitchRoll;
    destView.mapControls.setRotation(ypr.yaw, ypr.pitch);
    destView.mapView.worldCenter.copy(srcView.mapView.worldCenter);
    destView.mapControls.cameraHeight = srcView.mapControls.cameraHeight;
    //destView.mapView.camera.aspect = numberOfSyncXViews;
    destView.mapView.camera.updateProjectionMatrix();

    // force update on changed MapView
    destView.mapView.update();
};

const views = [mapViews.view1, mapViews.view2, mapViews.view3];

// sync camera of each view to other views changes.
views.forEach((v: ViewControlPair, index: number) => {
    const otherViews = views.slice();
    otherViews.splice(index, 1);
    // tslint:disable-next-line:no-unused-variable
    otherViews.forEach((otherView: ViewControlPair, indexTemp: number) => {
        v.mapControls.addEventListener(
            "update",
            (): void => {
                syncMapViews(views[index], otherViews[indexTemp]);
            }
        );
    });
});
