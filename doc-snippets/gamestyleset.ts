function setStyleSet(status?: IStatus) {
    const styleSet: StyleSet = [baseRegionsStyle, outlineStyle];
    if (status !== undefined) {
        activeRegionStyle.when = `type == 'polygon' && properties.name == '${status.name}'`;
        activeRegionStyle.attr!.color = status.correct ? "#009900" : "#ff4422";
        styleSet.push(activeRegionStyle);
    }
    geoJsonDataSource.setStyleSet(styleSet);
    mapView.update();
}
