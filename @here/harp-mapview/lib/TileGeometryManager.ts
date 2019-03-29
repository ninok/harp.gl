/*
 * Copyright (C) 2017-2019 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import { LoggerManager } from "@here/harp-utils/lib/Logger";

import { MapView } from "./MapView";
import { Tile } from "./Tile";
import {
    PhasedTileGeometryLoader,
    PhaseList,
    SimpleTileGeometryLoader,
    TileGeometryKind,
    TileGeometryLoader
} from "./TileGeometryLoader";

const logger = LoggerManager.instance.create("TileGeometryManager");

interface TileGeometryState {
    tile: Tile;
    geometryLoader: TileGeometryLoader;
}

export interface TileGeometryManager {
    initTile(tiles: Tile): void;

    updateTiles(tiles: Tile[]): void;

    clear(): void;
}

export class SimpleTileGeometryManager implements TileGeometryManager {
    constructor(private m_mapView: MapView) {}

    initTile(tile: Tile): void {
        tile.tileGeometryLoader = new SimpleTileGeometryLoader(tile);
    }

    updateTiles(tiles: Tile[]): void {
        for (const tile of tiles) {
            const geometryLoader = tile.tileGeometryLoader as TileGeometryLoader;
            if (geometryLoader !== undefined) {
                geometryLoader.update();
            }
        }
    }

    clear(): void {
        //
    }
}

const DefaultPhases: PhaseList[] = [
    [TileGeometryKind.Background, TileGeometryKind.Ground, TileGeometryKind.Areas],
    [TileGeometryKind.Lines, TileGeometryKind.Roads],
    [TileGeometryKind.Buildings],
    [TileGeometryKind.Labels, TileGeometryKind.Pois],
    [TileGeometryKind.Details]
];

const DefaultBasicGeometryKinds: Set<TileGeometryKind> = new Set([
    TileGeometryKind.Background,
    TileGeometryKind.Ground,
    TileGeometryKind.Areas,
    TileGeometryKind.Lines
]);

export class PhasedTileGeometryManager implements TileGeometryManager {
    private m_maximumUpdatesPerFrame = 5;
    private m_loadPhaseDefinitions: PhaseList[] = DefaultPhases;
    private m_basicGeometryKinds: Set<TileGeometryKind> = DefaultBasicGeometryKinds;

    constructor(private m_mapView: MapView) {}

    initTile(tile: Tile): void {
        tile.tileGeometryLoader = new PhasedTileGeometryLoader(
            tile,
            this.m_loadPhaseDefinitions,
            this.m_basicGeometryKinds
        );
    }

    updateTiles(tiles: Tile[]): void {
        if (this.m_mapView.isDynamicFrame) {
            this.updateAllTiles(tiles);
        } else {
            this.updateTilesTogether(tiles);
        }

        if (!this.checkTilesFinished(tiles)) {
            this.m_mapView.update();
        }
    }

    clear() {
        //
    }

    private checkTilesFinished(tiles: Tile[]): boolean {
        for (const tile of tiles) {
            const phasedGeometryLoader = tile.tileGeometryLoader as PhasedTileGeometryLoader;
            if (phasedGeometryLoader !== undefined && !phasedGeometryLoader.allGeometryLoaded) {
                return false;
            }
        }
        return true;
    }

    private updateAllTiles(tiles: Tile[]) {
        let numTilesUpdated = 0;
        for (const tile of tiles) {
            const phasedGeometryLoader = tile.tileGeometryLoader as PhasedTileGeometryLoader;

            if (phasedGeometryLoader !== undefined && phasedGeometryLoader.update()) {
                numTilesUpdated++;
                if (
                    this.m_maximumUpdatesPerFrame > 0 &&
                    numTilesUpdated >= this.m_maximumUpdatesPerFrame &&
                    tile.mapView.isDynamicFrame
                ) {
                    break;
                }
            }
        }
    }

    private updateTilesTogether(tiles: Tile[]): void {
        let lowestPhase: number | undefined;

        for (const tile of tiles) {
            const phasedGeometryLoader = tile.tileGeometryLoader as PhasedTileGeometryLoader;

            if (
                phasedGeometryLoader !== undefined &&
                (lowestPhase === undefined || phasedGeometryLoader.currentPhase < lowestPhase)
            ) {
                lowestPhase = phasedGeometryLoader.currentPhase;
            }
        }

        if (lowestPhase !== undefined && lowestPhase < this.m_loadPhaseDefinitions.length) {
            const nextPhase = lowestPhase + 1;
            this.updateTilesIfNeeded(tiles, nextPhase);
        }
    }

    private updateTilesIfNeeded(tiles: Tile[], toPhase: number) {
        let numTilesUpdated = 0;
        for (const tile of tiles) {
            const phasedGeometryLoader = tile.tileGeometryLoader as PhasedTileGeometryLoader;
            if (phasedGeometryLoader !== undefined && phasedGeometryLoader.updateToPhase(toPhase)) {
                numTilesUpdated++;
                if (
                    tile.mapView.isDynamicFrame &&
                    this.m_maximumUpdatesPerFrame > 0 &&
                    numTilesUpdated >= this.m_maximumUpdatesPerFrame
                ) {
                    break;
                }
            }
        }
    }
}
