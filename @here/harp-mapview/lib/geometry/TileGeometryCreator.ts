/*
 * Copyright (C) 2017-2019 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import {
    BaseTechniqueParams,
    BufferAttribute,
    DecodedTile,
    ExtrudedPolygonTechnique,
    FillTechnique,
    Geometry,
    GeometryKind,
    GeometryKindSet,
    getArrayConstructor,
    getPropertyValue,
    isCirclesTechnique,
    isExtrudedLineTechnique,
    isExtrudedPolygonTechnique,
    isFillTechnique,
    isInterpolatedProperty,
    isLineMarkerTechnique,
    isLineTechnique,
    isPoiTechnique,
    isSegmentsTechnique,
    isSolidLineTechnique,
    isSquaresTechnique,
    isTerrainTechnique,
    isTextTechnique,
    MakeTechniqueAttrs,
    needsVertexNormals,
    SolidLineTechnique,
    StandardExtrudedLineTechnique,
    Technique,
    TerrainTechnique,
    TextPathGeometry
} from "@here/harp-datasource-protocol";
// tslint:disable:max-line-length
import { SphericalGeometrySubdivisionModifier } from "@here/harp-geometry/lib/SphericalGeometrySubdivisionModifier";
import { EarthConstants, GeoCoordinates, ProjectionType } from "@here/harp-geoutils";
import {
    EdgeMaterial,
    EdgeMaterialParameters,
    FadingFeature,
    LineCapsDefinitions,
    MapMeshBasicMaterial,
    MapMeshStandardMaterial,
    SolidLineMaterial
} from "@here/harp-materials";
import { ContextualArabicConverter } from "@here/harp-text-canvas";
import { chainCallbacks, LoggerManager } from "@here/harp-utils";
import * as THREE from "three";

import { AnimatedExtrusionTileHandler } from "../AnimatedExtrusionHandler";
import { ColorCache } from "../ColorCache";
import { createMaterial, getBufferAttribute, getObjectConstructor } from "../DecodedTileHelpers";
import {
    createDepthPrePassMesh,
    isRenderDepthPrePassEnabled,
    setDepthPrePassStencil
} from "../DepthPrePass";
import { DisplacementMap, TileDisplacementMap } from "../DisplacementMap";
import { FALLBACK_RENDER_ORDER_OFFSET } from "../MapView";
import { MapViewPoints } from "../MapViewPoints";
import { PathBlockingElement } from "../PathBlockingElement";
import { TextElement } from "../text/TextElement";
import { DEFAULT_TEXT_DISTANCE_SCALE } from "../text/TextElementsRenderer";
import { Tile, TileFeatureData } from "../Tile";
import { TileGeometryLoader } from "./TileGeometryLoader";

const logger = LoggerManager.instance.create("TileGeometryCreator");

/**
 * The SORT_WEIGHT_PATH_LENGTH constants control how the priority of the labels are computed based
 * on the length of the label strings.
 *
 * Consequently, the [[Technique]]s priority is slightly modified while generating
 * [[TextElement]]s from the [[DecodedTile]], to get a more meaningful priority and stable results.
 */

/**
 * Gives [[TextElement]]s with longer paths a higher priority.
 */
const SORT_WEIGHT_PATH_LENGTH = 0.1;

/**
 * Parameters that control fading.
 */
export interface FadingParameters {
    fadeNear?: number;
    fadeFar?: number;
}

/**
 * Parameters that control fading for extruded buildings with fading edges.
 */
export interface PolygonFadingParameters extends FadingParameters {
    color?: string | number;
    colorMix?: number;
    lineFadeNear?: number;
    lineFadeFar?: number;
}

/**
 * Support class to create geometry for a [[Tile]] from a [[DecodedTile]].
 */
export class TileGeometryCreator {
    private static m_instance: TileGeometryCreator;
    // These are used for clipping the geometry so that the overlapping geometry is removed.
    private clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
        new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
        new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    ];

    /**
     * The `instance` of the `TileGeometryCreator`.
     *
     * @returns TileGeometryCreator
     */
    static get instance(): TileGeometryCreator {
        return this.m_instance || (this.m_instance = new TileGeometryCreator());
    }

    /**
     *  Creates an instance of TileGeometryCreator. Access is allowed only through `instance`.
     */
    private constructor() {
        //
    }

    /**
     * Apply `enabledKinds` and `disabledKinds` to all techniques in the `decodedTile`. If a
     * technique is identified as disabled, its property `enabled` is set to `false`.
     *
     * @param decodedTile The decodedTile containing the actual tile map data.
     * @param enabledKinds Optional [[GeometryKindSet]] used to specify which object kinds should be
     *      created.
     * @param disabledKinds Optional [[GeometryKindSet]] used to filter objects that should not be
     *      created.
     */
    initDecodedTile(
        decodedTile: DecodedTile,
        enabledKinds?: GeometryKindSet | undefined,
        disabledKinds?: GeometryKindSet | undefined
    ) {
        for (const technique of decodedTile.techniques) {
            // Already processed
            if (technique.enabled !== undefined) {
                continue;
            }

            // Turn technique.kind from the style, which may be a string or an array of strings,
            // into a GeometryKindSet.
            if (technique.kind !== undefined) {
                if (Array.isArray(technique.kind)) {
                    technique.kind = new GeometryKindSet(technique.kind);
                } else if (typeof technique.kind !== "string") {
                    logger.warn("Technique has unknown type of kind:", technique);
                    technique.kind = undefined;
                }
            }

            // No info about kind, no way to filter it.
            if (
                technique.kind === undefined ||
                (technique.kind instanceof Set && (technique.kind as GeometryKindSet).size === 0)
            ) {
                technique.enabled = true;
                continue;
            }

            technique.enabled =
                !(disabledKinds !== undefined && disabledKinds.hasOrIntersects(technique.kind)) ||
                (enabledKinds !== undefined && enabledKinds.hasOrIntersects(technique.kind));
        }
        for (const srcGeometry of decodedTile.geometries) {
            for (const group of srcGeometry.groups) {
                group.createdOffsets = [];
            }
        }
    }

    /**
     * Called after the `Tile` has been decoded. It is required to call `initDecodedTile` before
     * calling this method.
     *
     * @see [[TileGeometryCreator#initDecodedTile]]
     *
     * @param tile The [[Tile]] to process.
     * @param decodedTile The decodedTile containing the actual tile map data.
     */
    createAllGeometries(tile: Tile, decodedTile: DecodedTile) {
        const filter = (technique: Technique): boolean => {
            return technique.enabled !== false;
        };

        if (decodedTile.maxGeometryHeight !== undefined) {
            tile.maxGeometryHeight = decodedTile.maxGeometryHeight;
        }
        this.createObjects(tile, decodedTile, filter);

        this.preparePois(tile, decodedTile);

        // TextElements do not get their geometry created by Tile, but are managed on a
        // higher level.
        const textFilter = (technique: Technique): boolean => {
            if (
                !isPoiTechnique(technique) &&
                !isLineMarkerTechnique(technique) &&
                !isTextTechnique(technique)
            ) {
                return false;
            }
            return filter(technique);
        };
        this.createTextElements(tile, decodedTile, textFilter);

        this.createLabelRejectionElements(tile, decodedTile);

        // HARP-7899, disable ground plane for globe
        if (tile.dataSource.addGroundPlane && tile.projection.type === ProjectionType.Planar) {
            // The ground plane is required for when we change the zoom back and we fall back to the
            // parent, in that case we reduce the renderOrder of the parent tile and this ground
            // place ensures that parent doesn't come through. This value must be above the
            // renderOrder of all objects in the fallback tile, otherwise there won't be a proper
            // covering of the parent tile by the children, hence dividing by 2. To put a bit more
            // concretely, we assume all objects are rendered with a renderOrder between 0 and
            // FALLBACK_RENDER_ORDER_OFFSET / 2, i.e. 10000. The ground plane is put at -10000, and
            // the fallback tiles have their renderOrder set between -20000 and -10000
            TileGeometryCreator.instance.addGroundPlane(tile, -FALLBACK_RENDER_ORDER_OFFSET / 2);
        }
    }

    createLabelRejectionElements(tile: Tile, decodedTile: DecodedTile) {
        if (decodedTile.pathGeometries === undefined) {
            return;
        }
        for (const path of decodedTile.pathGeometries) {
            tile.addBlockingElement(new PathBlockingElement(path.path));
        }
    }

    /**
     * Apply enabled and disabled kinds as a filter.
     *
     * @param {DecodedTile} decodedTile
     * @param {(GeometryKindSet | undefined)} enabledKinds
     * @param {(GeometryKindSet | undefined)} disabledKinds
     */
    processTechniques(
        decodedTile: DecodedTile,
        enabledKinds: GeometryKindSet | undefined,
        disabledKinds: GeometryKindSet | undefined
    ): void {
        if (decodedTile === undefined) {
            return;
        }

        for (const technique of decodedTile.techniques) {
            // Make sure that all technique have their geometryKind set, either from the Theme or
            // their default value.
            if (technique.kind === undefined) {
                TileGeometryLoader.setDefaultGeometryKind(technique);
            }
        }

        // Speedup and simplify following code: Test all techniques if they intersect with
        // enabledKinds and disabledKinds, in which case they are flagged. The disabledKinds can be
        // ignored hereafter.
        this.initDecodedTile(decodedTile, enabledKinds, disabledKinds);
    }

    /**
     * Adds a THREE object to the root of the tile. Sets the owning tiles datasource.name and the
     * tileKey in the `userData` property of the object, such that the tile it belongs to can be
     * identified during picking.
     *
     * @param tile The [[Tile]] to add the object to.
     * @param object The object to add to the root of the tile.
     * @param geometryKind The kind of object. Can be used for filtering.
     */
    registerTileObject(
        tile: Tile,
        object: THREE.Object3D,
        geometryKind: GeometryKind | GeometryKindSet | undefined
    ) {
        if (object.userData === undefined) {
            object.userData = {};
        }
        const userData = object.userData;
        userData.tileKey = tile.tileKey;
        userData.dataSource = tile.dataSource.name;

        userData.kind =
            geometryKind instanceof Set
                ? Array.from((geometryKind as GeometryKindSet).values())
                : Array.isArray(geometryKind)
                ? geometryKind
                : [geometryKind];

        // Force a visibility check of all objects.
        tile.resetVisibilityCounter();
    }

    /**
     * Splits the text paths that contain sharp corners.
     *
     * @param tile The [[Tile]] to process paths on.
     * @param textPathGeometries The original path geometries that may have defects.
     * @param textFilter: Optional filter. Should return true for any text technique that is
     *      applicable.
     */
    prepareTextPaths(
        textPathGeometries: TextPathGeometry[],
        decodedTile: DecodedTile,
        textFilter?: (technique: Technique) => boolean
    ): TextPathGeometry[] {
        const processedPaths = new Array<TextPathGeometry>();
        const newPaths = textPathGeometries.slice();

        while (newPaths.length > 0) {
            const textPath = newPaths.pop();

            if (textPath === undefined) {
                break;
            }

            const technique = decodedTile.techniques[textPath.technique];
            if (
                !isTextTechnique(technique) ||
                (textFilter !== undefined && !textFilter(technique))
            ) {
                continue;
            }

            processedPaths.push(textPath);
        }
        return processedPaths;
    }

    /**
     * Creates [[TextElement]] objects from the decoded tile and list of materials specified. The
     * priorities of the [[TextElement]]s are updated to simplify label placement.
     *
     * @param tile The [[Tile]] to create the testElements on.
     * @param decodedTile The [[DecodedTile]].
     * @param textFilter: Optional filter. Should return true for any text technique that is
     *      applicable.
     */
    createTextElements(
        tile: Tile,
        decodedTile: DecodedTile,
        textFilter?: (technique: Technique) => boolean
    ) {
        const mapView = tile.mapView;
        const textElementsRenderer = mapView.textElementsRenderer;
        const displayZoomLevel = Math.floor(mapView.zoomLevel);
        const worldOffsetX = tile.computeWorldOffsetX();

        if (decodedTile.textPathGeometries !== undefined) {
            const textPathGeometries = this.prepareTextPaths(
                decodedTile.textPathGeometries,
                decodedTile,
                textFilter
            );

            // Compute maximum street length (squared). Longer streets should be labelled first,
            // they have a higher chance of being placed in case the number of text elements is
            // limited.
            let maxPathLengthSqr = 0;
            for (const textPath of textPathGeometries) {
                const technique = decodedTile.techniques[textPath.technique];
                if (technique.enabled === false || !isTextTechnique(technique)) {
                    continue;
                }
                if (textPath.pathLengthSqr > maxPathLengthSqr) {
                    maxPathLengthSqr = textPath.pathLengthSqr;
                }
            }

            for (const textPath of textPathGeometries) {
                const technique = decodedTile.techniques[textPath.technique];

                if (
                    technique.enabled === false ||
                    !isTextTechnique(technique) ||
                    (textFilter !== undefined && !textFilter(technique))
                ) {
                    continue;
                }

                const path: THREE.Vector3[] = [];
                for (let i = 0; i < textPath.path.length; i += 3) {
                    path.push(
                        new THREE.Vector3(
                            textPath.path[i] + worldOffsetX,
                            textPath.path[i + 1],
                            textPath.path[i + 2]
                        )
                    );
                }

                // Make sorting stable and make pathLengthSqr a differentiator for placement.
                const priority =
                    (technique.priority !== undefined
                        ? getPropertyValue(technique.priority, displayZoomLevel)
                        : 0) +
                    (maxPathLengthSqr > 0
                        ? (SORT_WEIGHT_PATH_LENGTH * textPath.pathLengthSqr) / maxPathLengthSqr
                        : 0);
                const fadeNear =
                    technique.fadeNear !== undefined
                        ? getPropertyValue(technique.fadeNear, displayZoomLevel)
                        : technique.fadeNear;
                const fadeFar =
                    technique.fadeFar !== undefined
                        ? getPropertyValue(technique.fadeFar, displayZoomLevel)
                        : technique.fadeFar;
                const textElement = new TextElement(
                    ContextualArabicConverter.instance.convert(textPath.text),
                    path,
                    textElementsRenderer.styleCache.getRenderStyle(tile, technique),
                    textElementsRenderer.styleCache.getLayoutStyle(tile, technique),
                    priority,
                    technique.xOffset !== undefined ? technique.xOffset : 0.0,
                    technique.yOffset !== undefined ? technique.yOffset : 0.0,
                    textPath.featureId,
                    technique.style,
                    fadeNear,
                    fadeFar
                );
                textElement.minZoomLevel =
                    technique.minZoomLevel !== undefined
                        ? technique.minZoomLevel
                        : mapView.minZoomLevel;
                textElement.maxZoomLevel =
                    technique.maxZoomLevel !== undefined
                        ? technique.maxZoomLevel
                        : mapView.maxZoomLevel;
                textElement.distanceScale =
                    technique.distanceScale !== undefined
                        ? technique.distanceScale
                        : DEFAULT_TEXT_DISTANCE_SCALE;
                textElement.mayOverlap = technique.mayOverlap === true;
                textElement.reserveSpace = technique.reserveSpace !== false;
                textElement.kind = technique.kind;
                // Get the userData for text element picking.
                textElement.userData = textPath.objInfos;

                tile.addTextElement(textElement);
            }
        }

        if (decodedTile.textGeometries !== undefined) {
            for (const text of decodedTile.textGeometries) {
                if (text.technique === undefined || text.stringCatalog === undefined) {
                    continue;
                }

                const technique = decodedTile.techniques[text.technique];

                if (
                    technique.enabled === false ||
                    !isTextTechnique(technique) ||
                    (textFilter !== undefined && !textFilter(technique))
                ) {
                    continue;
                }

                const positions = new THREE.BufferAttribute(
                    new Float32Array(text.positions.buffer),
                    text.positions.itemCount
                );

                const numPositions = positions.count;
                if (numPositions < 1) {
                    continue;
                }

                const priority =
                    technique.priority !== undefined
                        ? getPropertyValue(technique.priority, displayZoomLevel)
                        : 0;
                const fadeNear =
                    technique.fadeNear !== undefined
                        ? getPropertyValue(technique.fadeNear, displayZoomLevel)
                        : technique.fadeNear;
                const fadeFar =
                    technique.fadeFar !== undefined
                        ? getPropertyValue(technique.fadeFar, displayZoomLevel)
                        : technique.fadeFar;

                for (let i = 0; i < numPositions; ++i) {
                    const x = positions.getX(i) + worldOffsetX;
                    const y = positions.getY(i);
                    const z = positions.getZ(i);
                    const label = text.stringCatalog[text.texts[i]];
                    if (label === undefined) {
                        // skip missing labels
                        continue;
                    }

                    const textElement = new TextElement(
                        ContextualArabicConverter.instance.convert(label!),
                        new THREE.Vector3(x, y, z),
                        textElementsRenderer.styleCache.getRenderStyle(tile, technique),
                        textElementsRenderer.styleCache.getLayoutStyle(tile, technique),
                        priority,
                        technique.xOffset || 0.0,
                        technique.yOffset || 0.0,
                        text.featureId,
                        technique.style
                    );

                    textElement.minZoomLevel =
                        technique.minZoomLevel !== undefined
                            ? technique.minZoomLevel
                            : mapView.minZoomLevel;
                    textElement.maxZoomLevel =
                        technique.maxZoomLevel !== undefined
                            ? technique.maxZoomLevel
                            : mapView.maxZoomLevel;
                    textElement.mayOverlap = technique.mayOverlap === true;
                    textElement.reserveSpace = technique.reserveSpace !== false;
                    textElement.kind = technique.kind;

                    textElement.fadeNear = fadeNear;
                    textElement.fadeFar = fadeFar;

                    if (text.objInfos !== undefined) {
                        // Get the userData for text element picking.
                        textElement.userData = text.objInfos[i];
                    }

                    tile.addTextElement(textElement);
                }
            }
        }
    }

    /**
     * Creates `Tile` objects from the decoded tile and list of materials specified.
     *
     * @param tile The [[Tile]] to create the geometry on.
     * @param decodedTile The [[DecodedTile]].
     * @param techniqueFilter: Optional filter. Should return true for any technique that is
     *      applicable.
     */
    createObjects(
        tile: Tile,
        decodedTile: DecodedTile,
        techniqueFilter?: (technique: Technique) => boolean
    ) {
        const materials: THREE.Material[] = [];
        const mapView = tile.mapView;
        const dataSource = tile.dataSource;
        const displayZoomLevel = Math.floor(mapView.zoomLevel);
        const objects = tile.objects;
        const viewRanges = mapView.viewRanges;

        for (const srcGeometry of decodedTile.geometries) {
            const groups = srcGeometry.groups;
            const groupCount = groups.length;

            for (let groupIndex = 0; groupIndex < groupCount; ) {
                const group = groups[groupIndex++];
                const start = group.start;
                const techniqueIndex = group.technique;
                const technique = decodedTile.techniques[techniqueIndex];

                if (
                    group.createdOffsets!.indexOf(tile.offset) !== -1 ||
                    technique.enabled === false ||
                    (techniqueFilter !== undefined && !techniqueFilter(technique))
                ) {
                    continue;
                }

                let count = group.count;
                group.createdOffsets!.push(tile.offset);

                // compress consecutive groups
                for (
                    ;
                    groupIndex < groupCount && groups[groupIndex].technique === techniqueIndex;
                    ++groupIndex
                ) {
                    if (start + count !== groups[groupIndex].start) {
                        break;
                    }

                    count += groups[groupIndex].count;

                    // Mark this group as created, so it does not get processed again.
                    groups[groupIndex].createdOffsets!.push(tile.offset);
                }

                const ObjectCtor = getObjectConstructor(technique);

                if (ObjectCtor === undefined) {
                    continue;
                }

                let material: THREE.Material | undefined = materials[techniqueIndex];

                if (material === undefined) {
                    const onMaterialUpdated = (texture: THREE.Texture) => {
                        dataSource.requestUpdate();
                        if (texture !== undefined) {
                            tile.addOwnedTexture(texture);
                        }
                    };
                    material = createMaterial(
                        {
                            technique,
                            level: displayZoomLevel,
                            fog: mapView.scene.fog !== null
                        },
                        onMaterialUpdated
                    );
                    if (material === undefined) {
                        continue;
                    }
                    materials[techniqueIndex] = material;
                }

                // Modify the standard textured shader to support height-based coloring.
                if (isTerrainTechnique(technique)) {
                    this.setupTerrainMaterial(technique, material, tile.mapView.clearColor);
                }

                const bufferGeometry = new THREE.BufferGeometry();

                srcGeometry.vertexAttributes.forEach((vertexAttribute: BufferAttribute) => {
                    const buffer = getBufferAttribute(vertexAttribute);
                    bufferGeometry.setAttribute(vertexAttribute.name, buffer);
                });

                if (srcGeometry.interleavedVertexAttributes !== undefined) {
                    srcGeometry.interleavedVertexAttributes.forEach(
                        (attr: {
                            type: any;
                            buffer: any;
                            stride: any;
                            attributes: {
                                forEach: (
                                    arg0: (interleavedAttr: {
                                        itemSize: any;
                                        offset: any;
                                        name: any;
                                    }) => void
                                ) => void;
                            };
                        }) => {
                            const ArrayCtor = getArrayConstructor(attr.type);
                            const buffer = new THREE.InterleavedBuffer(
                                new ArrayCtor(attr.buffer),
                                attr.stride
                            );
                            attr.attributes.forEach(
                                (interleavedAttr: { itemSize: any; offset: any; name: any }) => {
                                    const attribute = new THREE.InterleavedBufferAttribute(
                                        buffer,
                                        interleavedAttr.itemSize,
                                        interleavedAttr.offset,
                                        false
                                    );
                                    bufferGeometry.setAttribute(interleavedAttr.name, attribute);
                                }
                            );
                        }
                    );
                }

                if (srcGeometry.index) {
                    bufferGeometry.setIndex(getBufferAttribute(srcGeometry.index));
                }

                if (!bufferGeometry.getAttribute("normal") && needsVertexNormals(technique)) {
                    bufferGeometry.computeVertexNormals();
                }

                bufferGeometry.addGroup(start, count);

                if (isSolidLineTechnique(technique)) {
                    const lineMaterial = material as THREE.RawShaderMaterial;
                    lineMaterial.uniforms.opacity.value = material.opacity;

                    if (
                        technique.clipping !== false &&
                        tile.projection.type === ProjectionType.Planar
                    ) {
                        const tileSize = lineMaterial.uniforms.tileSize;
                        const size = new THREE.Vector3();
                        tile.boundingBox.getSize(size);
                        tileSize.value.x = size.x;
                        tileSize.value.y = size.y;
                        lineMaterial.defines.TILE_CLIP = 1;
                    }

                    if (bufferGeometry.getAttribute("color")) {
                        lineMaterial.defines.USE_COLOR = 1;
                    }

                    if (
                        technique.caps !== undefined &&
                        LineCapsDefinitions.hasOwnProperty(technique.caps)
                    ) {
                        lineMaterial.defines[LineCapsDefinitions[technique.caps]] = 1;
                    }
                }

                // Add the solid line outlines as a separate object.
                const hasSolidLinesOutlines: boolean =
                    isSolidLineTechnique(technique) && technique.secondaryWidth !== undefined;

                const object = new ObjectCtor(bufferGeometry, material);
                object.renderOrder = technique.renderOrder!;

                if (group.renderOrderOffset !== undefined) {
                    object.renderOrder += group.renderOrderOffset;
                }

                if (srcGeometry.uuid !== undefined) {
                    object.userData.geometryId = srcGeometry.uuid;
                }

                if (
                    isFillTechnique(technique) &&
                    mapView.projection.type === ProjectionType.Planar
                ) {
                    object.onBeforeRender = chainCallbacks(
                        object.onBeforeRender,
                        (_renderer, _scene, _camera, _geometry, _material) => {
                            if (_material.clippingPlanes === null) {
                                _material.clippingPlanes = this.clippingPlanes;
                                // TODO: Add clipping for Spherical projection.
                            }
                            const worldOffsetX =
                                mapView.projection.worldExtent(0, 0).max.x * tile.offset;
                            // This prevents aliasing issues in the pixel shader, there are artifacts
                            // at low zoom levels, so we increase the factor by 10 to 1%.
                            const expandFactor = mapView.zoomLevel <= 2 ? 1.01 : 1.001;
                            const planes = _material.clippingPlanes;
                            const rightConstant =
                                tile.center.x -
                                mapView.worldCenter.x +
                                tile.boundingBox.extents.x * expandFactor +
                                worldOffsetX;

                            planes[0].constant = rightConstant;

                            const leftConstant =
                                tile.center.x -
                                mapView.worldCenter.x -
                                tile.boundingBox.extents.x * expandFactor +
                                worldOffsetX;
                            planes[1].constant = -leftConstant;

                            const topConstant =
                                tile.center.y -
                                mapView.worldCenter.y +
                                tile.boundingBox.extents.y * expandFactor;
                            planes[2].constant = topConstant;

                            const bottomConstant =
                                tile.center.y -
                                mapView.worldCenter.y -
                                tile.boundingBox.extents.y * expandFactor;
                            planes[3].constant = -bottomConstant;
                        }
                    );
                }

                if (
                    (isCirclesTechnique(technique) || isSquaresTechnique(technique)) &&
                    technique.enablePicking !== undefined
                ) {
                    // tslint:disable-next-line:max-line-length
                    (object as MapViewPoints).enableRayTesting = technique.enablePicking!;
                }

                if (
                    isLineTechnique(technique) ||
                    (isSegmentsTechnique(technique) &&
                        technique.color !== undefined &&
                        isInterpolatedProperty(technique.color))
                ) {
                    const fadingParams = this.getFadingParams(displayZoomLevel, technique);
                    FadingFeature.addRenderHelper(
                        object,
                        viewRanges,
                        fadingParams.fadeNear,
                        fadingParams.fadeFar,
                        false,
                        false,
                        (renderer, mat) => {
                            const lineMaterial = mat as THREE.LineBasicMaterial;
                            lineMaterial.color.set(
                                getPropertyValue(technique.color, mapView.zoomLevel)
                            );
                        }
                    );
                }

                // Lines renderOrder fix: Render them as transparent objects, but make sure they end
                // up in the opaque rendering queue (by disabling transparency onAfterRender, and
                // enabling it onBeforeRender).
                if (isSolidLineTechnique(technique)) {
                    const fadingParams = this.getFadingParams(displayZoomLevel, technique);
                    FadingFeature.addRenderHelper(
                        object,
                        viewRanges,
                        fadingParams.fadeNear,
                        fadingParams.fadeFar,
                        true,
                        false,
                        (renderer, mat) => {
                            const lineMaterial = mat as SolidLineMaterial;
                            const unitFactor =
                                technique.metricUnit === "Pixel" ? mapView.pixelToWorld : 1.0;

                            if (technique.color !== undefined) {
                                lineMaterial.color.set(
                                    getPropertyValue(technique.color, mapView.zoomLevel)
                                );
                            }

                            lineMaterial.lineWidth =
                                getPropertyValue(
                                    technique.lineWidth,
                                    mapView.zoomLevel,
                                    mapView.pixelToWorld
                                ) *
                                unitFactor *
                                0.5;

                            if (technique.outlineWidth !== undefined) {
                                lineMaterial.outlineWidth =
                                    getPropertyValue(
                                        technique.outlineWidth,
                                        mapView.zoomLevel,
                                        mapView.pixelToWorld
                                    ) * unitFactor;
                            }

                            if (technique.dashSize !== undefined) {
                                lineMaterial.dashSize =
                                    getPropertyValue(
                                        technique.dashSize,
                                        mapView.zoomLevel,
                                        mapView.pixelToWorld
                                    ) *
                                    unitFactor *
                                    0.5;
                            }

                            if (technique.gapSize !== undefined) {
                                lineMaterial.gapSize =
                                    getPropertyValue(
                                        technique.gapSize,
                                        mapView.zoomLevel,
                                        mapView.pixelToWorld
                                    ) *
                                    unitFactor *
                                    0.5;
                            }
                        }
                    );
                }

                if (isExtrudedLineTechnique(technique)) {
                    // extruded lines are normal meshes, and need transparency only when fading or
                    // dynamic properties is defined.
                    if (
                        technique.fadeFar !== undefined ||
                        isInterpolatedProperty(technique.color)
                    ) {
                        const fadingParams = this.getFadingParams(
                            displayZoomLevel,
                            technique as StandardExtrudedLineTechnique
                        );

                        FadingFeature.addRenderHelper(
                            object,
                            viewRanges,
                            fadingParams.fadeNear,
                            fadingParams.fadeFar,
                            true,
                            true,
                            technique.color !== undefined && isInterpolatedProperty(technique.color)
                                ? (renderer, mat) => {
                                      const extrudedMaterial = mat as
                                          | MapMeshStandardMaterial
                                          | MapMeshBasicMaterial;

                                      extrudedMaterial.color.set(
                                          getPropertyValue(technique.color!, mapView.zoomLevel)
                                      );
                                  }
                                : undefined
                        );
                    }
                }

                this.addFeatureData(srcGeometry, technique, object);
                this.addGeometryObjInfos(tile, srcGeometry, technique, object);

                if (isExtrudedPolygonTechnique(technique) || isFillTechnique(technique)) {
                    // filled polygons are normal meshes, and need transparency only when fading or
                    // dynamic properties is defined.
                    const hasDynamicColor =
                        (technique.color !== undefined &&
                            isInterpolatedProperty(technique.color)) ||
                        (isExtrudedPolygonTechnique(technique) &&
                            isInterpolatedProperty(technique.emissive));
                    if (technique.fadeFar !== undefined || hasDynamicColor) {
                        const fadingParams = this.getFadingParams(displayZoomLevel, technique);
                        FadingFeature.addRenderHelper(
                            object,
                            viewRanges,
                            fadingParams.fadeNear,
                            fadingParams.fadeFar,
                            true,
                            true,
                            hasDynamicColor
                                ? (renderer, mat) => {
                                      const polygonMaterial = mat as
                                          | MapMeshBasicMaterial
                                          | MapMeshStandardMaterial;

                                      polygonMaterial.color.set(
                                          getPropertyValue(technique.color!, mapView.zoomLevel)
                                      );

                                      if (
                                          isExtrudedPolygonTechnique(technique) &&
                                          technique.emissive !== undefined
                                      ) {
                                          const standardMat = mat as MapMeshStandardMaterial;

                                          standardMat.emissive.set(
                                              getPropertyValue(
                                                  technique.emissive,
                                                  mapView.zoomLevel
                                              )
                                          );
                                      }
                                  }
                                : undefined
                        );
                    }
                }

                const extrudedObjects: Array<{
                    object: THREE.Object3D;
                    /**
                     * If set to `true`, an [[ExtrusionFeature]] that injects extrusion shader
                     * chunk will be applied to the material. Otherwise, extrusion should
                     * be added in the material's shader manually.
                     */
                    materialFeature: boolean;
                }> = [];

                const animatedExtrusionHandler = mapView.animatedExtrusionHandler;

                let extrusionAnimationEnabled: boolean | undefined = false;

                if (
                    isExtrudedPolygonTechnique(technique) &&
                    animatedExtrusionHandler !== undefined
                ) {
                    let animateExtrusionValue = getPropertyValue(
                        technique.animateExtrusion,
                        displayZoomLevel
                    );
                    if (animateExtrusionValue !== undefined) {
                        animateExtrusionValue =
                            typeof animateExtrusionValue === "boolean"
                                ? animateExtrusionValue
                                : typeof animateExtrusionValue === "number"
                                ? animateExtrusionValue !== 0
                                : false;
                    }
                    extrusionAnimationEnabled =
                        animateExtrusionValue !== undefined &&
                        animatedExtrusionHandler.forceEnabled === false
                            ? animateExtrusionValue
                            : animatedExtrusionHandler.enabled;
                }

                const renderDepthPrePass =
                    isExtrudedPolygonTechnique(technique) && isRenderDepthPrePassEnabled(technique);

                if (renderDepthPrePass) {
                    const depthPassMesh = createDepthPrePassMesh(object as THREE.Mesh);
                    // Set geometry kind for depth pass mesh so that it gets the displacement map
                    // for elevation overlay.
                    this.registerTileObject(tile, depthPassMesh, technique.kind);
                    objects.push(depthPassMesh);

                    if (extrusionAnimationEnabled) {
                        extrudedObjects.push({
                            object: depthPassMesh,
                            materialFeature: true
                        });
                    }

                    setDepthPrePassStencil(depthPassMesh, object as THREE.Mesh);
                }

                this.registerTileObject(tile, object, technique.kind);
                objects.push(object);

                // Add the extruded building edges as a separate geometry.
                if (isExtrudedPolygonTechnique(technique) && srcGeometry.edgeIndex !== undefined) {
                    const edgeGeometry = new THREE.BufferGeometry();
                    edgeGeometry.setAttribute("position", bufferGeometry.getAttribute("position"));

                    const colorAttribute = bufferGeometry.getAttribute("color");
                    if (colorAttribute !== undefined) {
                        edgeGeometry.setAttribute("color", colorAttribute);
                    }

                    const extrusionAttribute = bufferGeometry.getAttribute("extrusionAxis");
                    if (extrusionAttribute !== undefined) {
                        edgeGeometry.setAttribute("extrusionAxis", extrusionAttribute);
                    }

                    const normalAttribute = bufferGeometry.getAttribute("normal");
                    if (normalAttribute !== undefined) {
                        edgeGeometry.setAttribute("normal", normalAttribute);
                    }

                    const uvAttribute = bufferGeometry.getAttribute("uv");
                    if (uvAttribute !== undefined) {
                        edgeGeometry.setAttribute("uv", uvAttribute);
                    }

                    edgeGeometry.setIndex(
                        getBufferAttribute(srcGeometry.edgeIndex! as BufferAttribute)
                    );

                    // Read the uniforms from the technique values (and apply the default values).
                    const extrudedPolygonTechnique = technique as ExtrudedPolygonTechnique;

                    const fadingParams = this.getPolygonFadingParams(
                        displayZoomLevel,
                        extrudedPolygonTechnique
                    );

                    // Configure the edge material based on the theme values.
                    const materialParams: EdgeMaterialParameters = {
                        color: fadingParams.color,
                        colorMix: fadingParams.colorMix,
                        fadeNear: fadingParams.lineFadeNear,
                        fadeFar: fadingParams.lineFadeFar
                    };
                    const edgeMaterial = new EdgeMaterial(materialParams);
                    const edgeObj = new THREE.LineSegments(edgeGeometry, edgeMaterial);

                    // Set the correct render order.
                    edgeObj.renderOrder = object.renderOrder + 0.1;

                    FadingFeature.addRenderHelper(
                        edgeObj,
                        viewRanges,
                        fadingParams.lineFadeNear,
                        fadingParams.lineFadeFar,
                        false,
                        false,
                        extrudedPolygonTechnique.lineColor !== undefined &&
                            isInterpolatedProperty(extrudedPolygonTechnique.lineColor)
                            ? (renderer, mat) => {
                                  edgeMaterial.color.set(
                                      getPropertyValue(
                                          extrudedPolygonTechnique.lineColor!,
                                          mapView.zoomLevel
                                      )
                                  );
                              }
                            : undefined
                    );

                    if (extrusionAnimationEnabled) {
                        extrudedObjects.push({
                            object: edgeObj,
                            materialFeature: false
                        });
                    }

                    this.registerTileObject(tile, edgeObj, technique.kind);
                    objects.push(edgeObj);
                }

                // animate the extrusion of buildings
                if (isExtrudedPolygonTechnique(technique) && extrusionAnimationEnabled) {
                    extrudedObjects.push({
                        object,
                        materialFeature: true
                    });

                    const extrusionAnimationDuration =
                        technique.animateExtrusionDuration !== undefined &&
                        animatedExtrusionHandler.forceEnabled === false
                            ? technique.animateExtrusionDuration
                            : animatedExtrusionHandler.duration;

                    tile.animatedExtrusionTileHandler = new AnimatedExtrusionTileHandler(
                        tile,
                        extrudedObjects,
                        extrusionAnimationDuration
                    );
                    mapView.animatedExtrusionHandler.add(tile.animatedExtrusionTileHandler);
                }

                // Add the fill area edges as a separate geometry.

                if (isFillTechnique(technique) && srcGeometry.edgeIndex !== undefined) {
                    const outlineGeometry = new THREE.BufferGeometry();
                    outlineGeometry.setAttribute(
                        "position",
                        bufferGeometry.getAttribute("position")
                    );
                    outlineGeometry.setIndex(getBufferAttribute(srcGeometry.edgeIndex!));

                    const fillTechnique = technique as FillTechnique;

                    const fadingParams = this.getPolygonFadingParams(
                        displayZoomLevel,
                        fillTechnique
                    );

                    // Configure the edge material based on the theme values.
                    const materialParams: EdgeMaterialParameters = {
                        color: fadingParams.color,
                        colorMix: fadingParams.colorMix,
                        fadeNear: fadingParams.lineFadeNear,
                        fadeFar: fadingParams.lineFadeFar
                    };
                    const outlineMaterial = new EdgeMaterial(materialParams);
                    const outlineObj = new THREE.LineSegments(outlineGeometry, outlineMaterial);
                    outlineObj.renderOrder = object.renderOrder + 0.1;

                    FadingFeature.addRenderHelper(
                        outlineObj,
                        viewRanges,
                        fadingParams.lineFadeNear,
                        fadingParams.lineFadeFar,
                        true,
                        false,
                        fillTechnique.lineColor !== undefined &&
                            isInterpolatedProperty(fillTechnique.lineColor)
                            ? (renderer, mat) => {
                                  const edgeMaterial = mat as EdgeMaterial;
                                  edgeMaterial.color.set(
                                      getPropertyValue(fillTechnique.lineColor!, mapView.zoomLevel)
                                  );
                              }
                            : undefined
                    );

                    this.registerTileObject(tile, outlineObj, technique.kind);
                    objects.push(outlineObj);
                }

                // Add the fill area edges as a separate geometry.
                if (hasSolidLinesOutlines) {
                    const outlineTechnique = technique as SolidLineTechnique;
                    const outlineMaterial = material.clone() as SolidLineMaterial;
                    const outlineColor = ColorCache.instance.getColor(
                        outlineTechnique.secondaryColor !== undefined
                            ? getPropertyValue(outlineTechnique.secondaryColor!, displayZoomLevel)
                            : 0x000000
                    );
                    outlineMaterial.uniforms.diffuse.value = outlineColor;
                    if (outlineTechnique.secondaryCaps !== undefined) {
                        outlineMaterial.caps = outlineTechnique.secondaryCaps;
                    }
                    const outlineObj = new ObjectCtor(bufferGeometry, outlineMaterial);

                    outlineObj.renderOrder =
                        outlineTechnique.secondaryRenderOrder !== undefined
                            ? outlineTechnique.secondaryRenderOrder
                            : technique.renderOrder - 0.0000001;

                    if (group.renderOrderOffset !== undefined) {
                        outlineObj.renderOrder += group.renderOrderOffset;
                    }

                    const fadingParams = this.getFadingParams(displayZoomLevel, technique);
                    FadingFeature.addRenderHelper(
                        outlineObj,
                        viewRanges,
                        fadingParams.fadeNear,
                        fadingParams.fadeFar,
                        true,
                        false,
                        (renderer, mat) => {
                            const lineMaterial = mat as SolidLineMaterial;

                            const unitFactor =
                                outlineTechnique.metricUnit === "Pixel"
                                    ? mapView.pixelToWorld
                                    : 1.0;

                            if (outlineTechnique.secondaryColor !== undefined) {
                                lineMaterial.color.set(
                                    getPropertyValue(
                                        outlineTechnique.secondaryColor,
                                        mapView.zoomLevel
                                    )
                                );
                            }

                            if (outlineTechnique.secondaryWidth !== undefined) {
                                const techniqueLineWidth = getPropertyValue(
                                    outlineTechnique.lineWidth!,
                                    mapView.zoomLevel,
                                    mapView.pixelToWorld
                                );
                                const techniqueSecondaryWidth = getPropertyValue(
                                    outlineTechnique.secondaryWidth!,
                                    mapView.zoomLevel,
                                    mapView.pixelToWorld
                                );
                                const techniqueOpacity = getPropertyValue(
                                    outlineTechnique.opacity,
                                    mapView.zoomLevel
                                );
                                // hide outline when it's equal or smaller then line to avoid subpixel contour
                                const lineWidth =
                                    techniqueSecondaryWidth <= techniqueLineWidth &&
                                    (techniqueOpacity === undefined || techniqueOpacity === 1)
                                        ? 0
                                        : techniqueSecondaryWidth;
                                lineMaterial.lineWidth = lineWidth * unitFactor * 0.5;
                            }
                        }
                    );

                    this.registerTileObject(tile, outlineObj, technique.kind);
                    objects.push(outlineObj);
                }
            }
        }
    }

    /**
     * Prepare the [[Tile]]s pois. Uses the [[PoiManager]] in [[MapView]].
     */
    preparePois(tile: Tile, decodedTile: DecodedTile) {
        if (decodedTile.poiGeometries !== undefined) {
            tile.mapView.poiManager.addPois(tile, decodedTile);
        }
    }

    /**
     * Creates and add a background plane for the tile.
     */
    addGroundPlane(tile: Tile, renderOrder: number) {
        const mapView = tile.mapView;
        const dataSource = tile.dataSource;
        const projection = tile.projection;

        const color = mapView.clearColor;
        const tmpV = new THREE.Vector3();

        if (tile.projection.type === ProjectionType.Spherical) {
            const { east, west, north, south } = tile.geoBox;
            const sourceProjection = dataSource.getTilingScheme().projection;
            const g = new THREE.BufferGeometry();
            const posAttr = new THREE.BufferAttribute(
                new Float32Array([
                    ...sourceProjection
                        .projectPoint(new GeoCoordinates(south, west), tmpV)
                        .toArray(),
                    ...sourceProjection
                        .projectPoint(new GeoCoordinates(south, east), tmpV)
                        .toArray(),
                    ...sourceProjection
                        .projectPoint(new GeoCoordinates(north, west), tmpV)
                        .toArray(),
                    ...sourceProjection
                        .projectPoint(new GeoCoordinates(north, east), tmpV)
                        .toArray()
                ]),
                3
            );
            g.setAttribute("position", posAttr);
            g.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 1, 2, 2, 1, 3]), 1));
            const modifier = new SphericalGeometrySubdivisionModifier(
                THREE.Math.degToRad(10),
                sourceProjection
            );
            modifier.modify(g);

            for (let i = 0; i < posAttr.array.length; i += 3) {
                tmpV.set(posAttr.array[i], posAttr.array[i + 1], posAttr.array[i + 2]);
                projection.reprojectPoint(sourceProjection, tmpV, tmpV);
                tmpV.sub(tile.center);
                (posAttr.array as Float32Array)[i] = tmpV.x;
                (posAttr.array as Float32Array)[i + 1] = tmpV.y;
                (posAttr.array as Float32Array)[i + 2] = tmpV.z;
            }
            posAttr.needsUpdate = true;

            const material = new MapMeshBasicMaterial({
                color,
                visible: true,
                depthWrite: true
            });
            const mesh = new THREE.Mesh(g, material);
            mesh.renderOrder = renderOrder;
            this.registerTileObject(tile, mesh, GeometryKind.Background);
            tile.objects.push(mesh);
        } else {
            // Add a ground plane to the tile.
            tile.boundingBox.getSize(tmpV);
            const groundPlane = this.createPlane(
                tmpV.x,
                tmpV.y,
                tile.center,
                color,
                true,
                renderOrder
            );

            this.registerTileObject(tile, groundPlane, GeometryKind.Background);
            tile.objects.push(groundPlane);
        }
    }

    private setupTerrainMaterial(
        technique: TerrainTechnique,
        material: THREE.Material,
        terrainColor: number
    ) {
        if (technique.displacementMap === undefined) {
            // Render terrain using the given color.
            const stdMaterial = material as MapMeshStandardMaterial;
            stdMaterial.color.set(terrainColor);
            return;
        }

        // Render terrain using height-based colors.
        (material as any).onBeforeCompile = (shader: THREE.Shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_pars_fragment>",
                `#include <map_pars_fragment>
    uniform sampler2D displacementMap;
    uniform float displacementScale;
    uniform float displacementBias;`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `#ifdef USE_MAP
    float minElevation = ${EarthConstants.MIN_ELEVATION.toFixed(1)};
    float maxElevation = ${EarthConstants.MAX_ELEVATION.toFixed(1)};
    float elevationRange = maxElevation - minElevation;

    float disp = texture2D( displacementMap, vUv ).x * displacementScale + displacementBias;
    vec4 texelColor = texture2D( map, vec2((disp - minElevation) / elevationRange, 0.0) );
    texelColor = mapTexelToLinear( texelColor );
    diffuseColor *= texelColor;
#endif`
            );
            // We remove the displacement map from manipulating the vertices, it is
            // however still required for the pixel shader, so it can't be directly
            // removed.
            shader.vertexShader = shader.vertexShader.replace(
                "#include <displacementmap_vertex>",
                ""
            );
        };
        (material as MapMeshStandardMaterial).displacementMap!.needsUpdate = true;
    }

    /**
     * Create a simple flat plane for a [[Tile]].
     *
     * @param {number} width Width of plane.
     * @param {number} height Height of plane.
     * @param {THREE.Vector3} planeCenter Center of plane.
     * @param {number} colorHex Color of the plane mesh.
     * @param {boolean} isVisible `True` to make the mesh visible.
     * @returns {THREE.Mesh} The created plane.
     */
    private createPlane(
        width: number,
        height: number,
        planeCenter: THREE.Vector3,
        colorHex: number,
        isVisible: boolean,
        renderOrder: number
    ): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(width, height, 1);
        // TODO cache the material HARP-4207
        const material = new MapMeshBasicMaterial({
            color: colorHex,
            visible: isVisible,
            depthWrite: false
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(planeCenter);
        // Render before everything else
        plane.renderOrder = renderOrder;
        return plane;
    }

    /**
     * Pass the feature data on to the object, so it can be used in picking
     * `MapView.intersectMapObjects()`. Do not pass the feature data if the technique is a
     * solid-line, because the line picking functionality for the lines is not object based, but
     * tile based.
     *
     * @param srcGeometry The original [[Geometry]].
     * @param technique The corresponding [[Technique]].
     * @param object The object to pass info to.
     */
    private addFeatureData(srcGeometry: Geometry, technique: Technique, object: THREE.Object3D) {
        if (
            ((srcGeometry.featureIds !== undefined && srcGeometry.featureIds.length > 0) ||
                isCirclesTechnique(technique) ||
                isSquaresTechnique(technique)) &&
            !isSolidLineTechnique(technique)
        ) {
            const featureData: TileFeatureData = {
                geometryType: srcGeometry.type,
                ids: srcGeometry.featureIds,
                starts: srcGeometry.featureStarts
            };
            object.userData.feature = featureData;

            if (srcGeometry.objInfos !== undefined) {
                object.userData.feature.objInfos = srcGeometry.objInfos;
            }
        }
    }

    private addGeometryObjInfos(
        tile: Tile,
        srcGeometry: Geometry,
        technique: Technique,
        object: THREE.Object3D
    ) {
        if (srcGeometry.objInfos === undefined || Object.keys(object.userData).length > 0) {
            return;
        }

        if (isTerrainTechnique(technique)) {
            const displacementMap = (srcGeometry.objInfos as DisplacementMap[])[0];
            const tileDisplacementMap: TileDisplacementMap = {
                tileKey: tile.tileKey,
                texture: new THREE.DataTexture(
                    displacementMap.buffer,
                    displacementMap.xCountVertices,
                    displacementMap.yCountVertices,
                    THREE.LuminanceFormat,
                    THREE.FloatType
                ),
                displacementMap
            };
            object.userData = tileDisplacementMap;
        } else {
            object.userData = srcGeometry.objInfos;
        }
    }

    /**
     * Gets the fading parameters for several kinds of objects.
     */
    private getFadingParams(
        displayZoomLevel: number,
        technique: MakeTechniqueAttrs<BaseTechniqueParams>
    ): FadingParameters {
        const fadeNear =
            technique.fadeNear !== undefined
                ? getPropertyValue(technique.fadeNear, displayZoomLevel)
                : FadingFeature.DEFAULT_FADE_NEAR;
        const fadeFar =
            technique.fadeFar !== undefined
                ? getPropertyValue(technique.fadeFar, displayZoomLevel)
                : FadingFeature.DEFAULT_FADE_FAR;
        return {
            fadeNear,
            fadeFar
        };
    }

    /**
     * Gets the fading parameters for several kinds of objects.
     */
    private getPolygonFadingParams(
        displayZoomLevel: number,
        technique: FillTechnique | ExtrudedPolygonTechnique
    ): PolygonFadingParameters {
        let color: string | number | undefined;
        let colorMix = EdgeMaterial.DEFAULT_COLOR_MIX;

        if (technique.lineColor !== undefined) {
            color = getPropertyValue(technique.lineColor, displayZoomLevel);
            if (isExtrudedPolygonTechnique(technique)) {
                const extrudedPolygonTechnique = technique as ExtrudedPolygonTechnique;
                colorMix =
                    extrudedPolygonTechnique.lineColorMix !== undefined
                        ? extrudedPolygonTechnique.lineColorMix
                        : EdgeMaterial.DEFAULT_COLOR_MIX;
            }
        }

        const fadeNear =
            technique.fadeNear !== undefined
                ? getPropertyValue(technique.fadeNear, displayZoomLevel)
                : FadingFeature.DEFAULT_FADE_NEAR;
        const fadeFar =
            technique.fadeFar !== undefined
                ? getPropertyValue(technique.fadeFar, displayZoomLevel)
                : FadingFeature.DEFAULT_FADE_FAR;

        const lineFadeNear =
            technique.lineFadeNear !== undefined
                ? getPropertyValue(technique.lineFadeNear, displayZoomLevel)
                : fadeNear;
        const lineFadeFar =
            technique.lineFadeFar !== undefined
                ? getPropertyValue(technique.lineFadeFar, displayZoomLevel)
                : fadeFar;

        if (color === undefined) {
            color = EdgeMaterial.DEFAULT_COLOR;
        }

        return {
            color,
            colorMix,
            fadeNear,
            fadeFar,
            lineFadeNear,
            lineFadeFar
        };
    }
}
