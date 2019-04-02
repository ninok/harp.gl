/*
 * Copyright (C) 2017-2019 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import { Style } from "@here/harp-datasource-protocol";
import * as THREE from "three";

export type PointCoords = number[];
export type PolygonPath = PointCoords[];
export type LinePath = PointCoords[];
export type FeaturePath = PolygonPath | LinePath;

export interface IFeature {
    coordinates: FeaturePath | PointCoords;
    type?: "Polygon" | "MultiPolygon" | "LineString" | "MultiLineString" | "Point" | "MultiPoint";
    color: string;
    uuid: string;
}

/**
 * Available options to style a line.
 */
export interface ILineRenderingOptions {
    color?: string;
    lineWidth?: number;
    metricUnit?: string;
}

/**
 * Available options to style a polygon.
 */
export interface IPolygonRenderingOptions {
    color?: string;
}

/**
 * Available options to style a point.
 */
export interface IPointRenderingOptions {
    color?: string;
    size?: number;
}

type IRenderingOptions = IPointRenderingOptions | ILineRenderingOptions | IPolygonRenderingOptions;

abstract class Feature implements IFeature {
    uuid: string = THREE.Math.generateUUID();
    color: string;
    constructor(
        public coordinates: FeaturePath | PointCoords,
        renderingOptions: IRenderingOptions
    ) {
        this.color =
            renderingOptions.color !== undefined
                ? renderingOptions.color
                : "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
}

const DEFAULT_LINE_RENDERING_OPTIONS = {
    lineWidth: 5,
    metricUnit: "Pixel"
};

export class LineFeature extends Feature {
    type: string = "LineString";
    constructor(
        public coordinates: LinePath,
        renderingOptions: ILineRenderingOptions = DEFAULT_LINE_RENDERING_OPTIONS
    ) {
        super(coordinates, renderingOptions);
        // manage rendering options
    }
}

const DEFAULT_POLYGON_RENDERING_OPTIONS = {};

export class PolygonFeature extends Feature {
    type: string = "Polygon";
    constructor(
        public coordinates: PolygonPath,
        renderingOptions: IPolygonRenderingOptions = DEFAULT_POLYGON_RENDERING_OPTIONS
    ) {
        super(coordinates, renderingOptions);
        // manage rendering options
    }
}

const DEFAULT_POINT_RENDERING_OPTIONS = {};

export class PointFeature extends Feature {
    type: string = "Point";
    constructor(
        public coordinates: PointCoords,
        renderingOptions: IPointRenderingOptions = DEFAULT_POINT_RENDERING_OPTIONS
    ) {
        super(coordinates, renderingOptions);
        // manage rendering options
    }
}
