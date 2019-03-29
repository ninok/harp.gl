/*
 * Copyright (C) 2017-2019 HERE Global B.V. and its affiliate(s). All rights reserved.
 *
 * This software and other materials contain proprietary information controlled by HERE and are
 * protected by applicable copyright legislation. Any use and utilization of this software and other
 * materials and disclosure to any third parties is conditional upon having a separate agreement
 * with HERE for the access, use, utilization or disclosure of this software. In the absence of such
 * agreement, the use of the software is not allowed.
 */

import { GeoCoordinates } from "@here/harp-geoutils";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";
import { CopyrightElementHandler, MapView } from "@here/harp-mapview";
import { APIFormat, OmvDataSource } from "@here/harp-omv-datasource";
import { accessToken } from "../config";

/**
 *
 */
export namespace CustomFeaturesExample {
    const map = createBaseMap();

    const polygonPath = [];
    const polygon = map.createPolygon(polygonPath);
    map.addFeature(polygon);

    function createBaseMap(): MapView {
        document.body.innerHTML += `
            <style>
                #mapCanvas {
                top: 0;
                }
            </style>
        `;
        const canvas = document.getElementById("mapCanvas") as HTMLCanvasElement;
        const mapView = new MapView({ canvas, theme: "resources/olp_tilezen_night_reduced.json" });
        mapView.camera.position.set(2000000, 3500000, 6000000); // Europe.
        mapView.geoCenter = new GeoCoordinates(16, -4, 0);

        const controls = new MapControls(mapView);
        const ui = new MapControlsUI(controls);
        canvas.parentElement!.appendChild(ui.domElement);

        const baseMap = new OmvDataSource({
            baseUrl: "https://xyz.api.here.com/tiles/osmbase/512/all",
            apiFormat: APIFormat.XYZMVT,
            styleSetName: "here_olp",
            maxZoomLevel: 17,
            authenticationCode: accessToken
        });
        mapView.addDataSource(baseMap);

        CopyrightElementHandler.install("copyrightNotice")
            .attach(mapView)
            .setDefaults([
                {
                    id: "openstreetmap.org",
                    label: "OpenStreetMap contributors",
                    link: "https://www.openstreetmap.org/copyright"
                }
            ]);

        return mapView;
    }
}
