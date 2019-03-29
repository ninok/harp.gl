/*
 * Copyright (C) 2017-2019 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import {
    DecodedTile,
    isDashedLineTechnique,
    isExtrudedLineTechnique,
    isExtrudedPolygonTechnique,
    isFillTechnique,
    isLineMarkerTechnique,
    isLineTechnique,
    isPoiTechnique,
    isSegmentsTechnique,
    isSolidLineTechnique,
    isTextTechnique,
    Technique
} from "@here/harp-datasource-protocol";
import { PerformanceTimer } from "@here/harp-utils";

import { PerformanceStatistics } from "./Statistics";
import { Tile } from "./Tile";
import { TileGeometryCreator } from "./TileGeometryCreator";

export interface TileGeometryLoader {
    isFinished: boolean;
    tile: Tile;
    basicGeometryLoaded: boolean;
    allGeometryLoaded: boolean;
    update(): void;
    dispose(): void;
}

export class SimpleTileGeometryLoader implements TileGeometryLoader {
    private m_decodedTile?: DecodedTile;
    private m_isFinished: boolean = false;

    constructor(private m_tile: Tile) {}

    get tile(): Tile {
        return this.m_tile;
    }

    get basicGeometryLoaded(): boolean {
        return this.m_isFinished;
    }

    get allGeometryLoaded(): boolean {
        return this.m_isFinished;
    }

    get isFinished(): boolean {
        return this.m_isFinished;
    }

    setDecodedTile(decodedTile: DecodedTile) {
        this.m_decodedTile = this.m_tile.decodedTile;
    }

    update(): void {
        if (this.m_decodedTile === undefined && this.m_tile.decodedTile !== undefined) {
            this.setDecodedTile(this.m_tile.decodedTile);
            this.prepareForRender();
            this.finish();
        }
    }

    dispose(): void {
        this.m_decodedTile = undefined;
    }

    private finish() {
        this.m_tile.removeDecodedTile();
        this.m_isFinished = true;
    }

    /**
     * Called by [[VisibleTileSet]] to mark that [[Tile]] is visible and it should prepare geometry.
     */
    private prepareForRender() {
        // If the tile is not ready for display, or if it has become invisible while being loaded,
        // for example by moving the camera, the tile is not finished and its geometry is not
        // created. This is an optimization for fast camera movements and zooms.
        const tile = this.tile;
        const decodedTile = this.m_decodedTile;
        this.m_decodedTile = undefined;
        if (decodedTile === undefined || tile.disposed || !tile.isVisible) {
            return;
        }
        setTimeout(() => {
            const stats = PerformanceStatistics.instance;
            // If the tile has become invisible while being loaded, for example by moving the
            // camera, the tile is not finished and its geometry is not created. This is an
            // optimization for fast camera movements and zooms.
            if (!tile.isVisible) {
                // Dispose the tile from the visible set, so it can be reloaded properly next time
                // it is needed.
                tile.mapView.visibleTileSet.disposeTile(tile);
                if (stats.enabled) {
                    stats.currentFrame.addMessage(
                        `Decoded tile: ${tile.dataSource.name} # lvl=${tile.tileKey.level} col=${
                            tile.tileKey.column
                        } row=${tile.tileKey.row} DISCARDED - invisible`
                    );
                }
                return;
            }
            let now = 0;
            if (stats.enabled) {
                now = PerformanceTimer.now();
            }

            const geometryCreator = new TileGeometryCreator();
            geometryCreator.createAllGeometries(tile, decodedTile);

            if (stats.enabled) {
                const geometryCreationTime = PerformanceTimer.now() - now;
                const currentFrame = stats.currentFrame;
                currentFrame.addValue("geometry.geometryCreationTime", geometryCreationTime);
                currentFrame.addValue("geometryCount.numGeometries", decodedTile.geometries.length);
                currentFrame.addValue("geometryCount.numTechniques", decodedTile.techniques.length);
                currentFrame.addValue(
                    "geometryCount.numPoiGeometries",
                    decodedTile.poiGeometries !== undefined ? decodedTile.poiGeometries.length : 0
                );
                currentFrame.addValue(
                    "geometryCount.numTextGeometries",
                    decodedTile.textGeometries !== undefined ? decodedTile.textGeometries.length : 0
                );
                currentFrame.addValue(
                    "geometryCount.numTextPathGeometries",
                    decodedTile.textPathGeometries !== undefined
                        ? decodedTile.textPathGeometries.length
                        : 0
                );
                currentFrame.addMessage(
                    `Decoded tile: ${tile.dataSource.name} # lvl=${tile.tileKey.level} col=${
                        tile.tileKey.column
                    } row=${tile.tileKey.row}`
                );
            }
            this.finish();
            tile.dataSource.requestUpdate();
        }, 0);
    }
}

export enum TileGeometryKind {
    Background,
    Ground = 1,
    Areas = 2,
    Lines = 3,
    Roads = 4,
    Buildings = 5,
    Labels = 6,
    Pois = 7,
    Details = 8
}

export type PhaseList = TileGeometryKind[];

/**
 *
 *
 */
export class PhasedTileGeometryLoader implements TileGeometryLoader {
    private m_decodedTile?: DecodedTile;
    private m_isFinished: boolean = false;
    private m_geometryKindsLoaded: Set<TileGeometryKind> = new Set();
    private m_loadPhaseDefinitions: PhaseList[];
    private m_currentPhaseIndex = 0;

    constructor(
        private m_tile: Tile,
        loadPhaseDefinitions: PhaseList[],
        private m_basicGeometryKinds: Set<TileGeometryKind>
    ) {
        this.m_loadPhaseDefinitions = loadPhaseDefinitions;
    }

    get currentPhase(): number {
        return this.m_currentPhaseIndex;
    }

    nextPhase(): number | undefined {
        if (this.m_currentPhaseIndex < this.m_loadPhaseDefinitions.length) {
            this.m_currentPhaseIndex++;
        }

        return this.m_currentPhaseIndex < this.m_loadPhaseDefinitions.length
            ? this.m_currentPhaseIndex
            : undefined;
    }

    get numberOfPhases(): number {
        return this.m_loadPhaseDefinitions.length;
    }

    get loadedKinds(): Set<TileGeometryKind> {
        return this.m_geometryKindsLoaded;
    }

    get basicGeometryLoaded(): boolean {
        for (const phase of this.m_basicGeometryKinds) {
            if (!this.m_geometryKindsLoaded.has(phase)) {
                return false;
            }
        }
        return true;
    }

    get allGeometryLoaded(): boolean {
        return this.currentPhase >= this.m_loadPhaseDefinitions.length;
    }

    get tile(): Tile {
        return this.m_tile;
    }

    setDecodedTile(decodedTile: DecodedTile) {
        this.m_decodedTile = this.m_tile.decodedTile;
        this.m_currentPhaseIndex = 0;
        this.m_geometryKindsLoaded.clear();
    }

    updateToPhase(toPhase: number): boolean {
        let didUpdate = false;
        while (this.currentPhase < toPhase) {
            didUpdate = this.update();
            if (!didUpdate) {
                break;
            }
        }
        return didUpdate;
    }

    update(): boolean {
        if (this.m_decodedTile === undefined && this.m_tile.decodedTile !== undefined) {
            this.setDecodedTile(this.m_tile.decodedTile);
        }

        if (!this.tile.dataSource.cacheable) {
            this.m_currentPhaseIndex = this.m_loadPhaseDefinitions.length;
            return false;
        }

        const currentPhase = this.currentPhase;
        if (this.m_decodedTile === undefined || currentPhase >= this.numberOfPhases) {
            return false;
        }

        const currentPhaseDefinition = this.m_loadPhaseDefinitions[currentPhase];

        const stats = PerformanceStatistics.instance;
        let now = 0;
        if (stats.enabled) {
            now = PerformanceTimer.now();
        }

        for (const kind of currentPhaseDefinition) {
            this.createKind(kind);
        }
        if (stats.enabled) {
            stats.currentFrame.addValue(
                "geometry.geometryCreationTime",
                PerformanceTimer.now() - now
            );
        }

        if (this.nextPhase() === undefined) {
            // All done, update the stats
            if (stats.enabled) {
                const currentFrame = stats.currentFrame;
                const decodedTile = this.m_decodedTile;
                const tile = this.m_tile;

                currentFrame.addValue("geometryCount.numGeometries", decodedTile.geometries.length);
                currentFrame.addValue("geometryCount.numTechniques", decodedTile.techniques.length);
                currentFrame.addValue(
                    "geometryCount.numPoiGeometries",
                    decodedTile.poiGeometries !== undefined ? decodedTile.poiGeometries.length : 0
                );
                currentFrame.addValue(
                    "geometryCount.numTextGeometries",
                    decodedTile.textGeometries !== undefined ? decodedTile.textGeometries.length : 0
                );
                currentFrame.addValue(
                    "geometryCount.numTextPathGeometries",
                    decodedTile.textPathGeometries !== undefined
                        ? decodedTile.textPathGeometries.length
                        : 0
                );
                currentFrame.addMessage(
                    `Decoded tile: ${tile.dataSource.name} # lvl=${tile.tileKey.level} col=${
                        tile.tileKey.column
                    } row=${tile.tileKey.row}`
                );
            }

            this.finish();
        }
        return true;
    }

    getTextElementPriorities(): number[] | undefined {
        if (this.m_decodedTile === undefined) {
            return undefined;
        }

        const priorities: Set<number> = new Set();
        for (const technique of this.m_decodedTile.techniques) {
            if (technique.name !== "text") {
                continue;
            }
            priorities.add(technique.priority !== undefined ? technique.priority : 0);
        }
        const prioritiesArray = Array.from(priorities);
        return prioritiesArray.sort((a: number, b: number) => {
            return b - a;
        });
    }

    get isFinished(): boolean {
        return this.m_isFinished;
    }

    dispose(): void {
        this.m_decodedTile = undefined;
    }

    protected createKind(kind: TileGeometryKind): void {
        if (this.m_geometryKindsLoaded.has(kind)) {
            return;
        }
        this.m_geometryKindsLoaded.add(kind);

        const tile = this.tile;
        const decodedTile = this.m_decodedTile;
        const geometryCreator = new TileGeometryCreator();

        if (kind === TileGeometryKind.Background) {
            // this.tile.forceHasGeometry(true);
            // geometryCreator.createBackground(this.tile);
        } else if (decodedTile !== undefined) {
            if (!tile.hasGeometry) {
                // tile.forceHasGeometry(true);
                geometryCreator.createBackground(tile);
            }

            let filter: ((technique: Technique) => boolean) | undefined;

            if (kind === TileGeometryKind.Areas) {
                filter = (technique: Technique): boolean => {
                    return isFillTechnique(technique);
                };
            } else if (kind === TileGeometryKind.Lines) {
                filter = (technique: Technique): boolean => {
                    return (
                        isLineTechnique(technique) ||
                        isDashedLineTechnique(technique) ||
                        isSolidLineTechnique(technique) ||
                        isSegmentsTechnique(technique) ||
                        isExtrudedLineTechnique(technique)
                    );
                };
            } else if (kind === TileGeometryKind.Buildings) {
                filter = (technique: Technique): boolean => {
                    return isExtrudedPolygonTechnique(technique);
                };
            } else if (kind === TileGeometryKind.Labels) {
                const textFilter = (technique: Technique): boolean => {
                    return (
                        isPoiTechnique(technique) ||
                        isLineMarkerTechnique(technique) ||
                        isTextTechnique(technique)
                    );
                };

                // const textPriorities = this.getTextElementPriorities();

                geometryCreator.createTextElements(tile, decodedTile, textFilter);
            } else if (kind === TileGeometryKind.Pois) {
                //
                geometryCreator.preparePois(tile, decodedTile);
            }

            if (filter !== undefined) {
                geometryCreator.createObjects(tile, decodedTile, filter);
            }
        }
    }

    private finish() {
        this.m_decodedTile = undefined;
        this.m_tile.removeDecodedTile();
        this.m_isFinished = true;
    }
}
