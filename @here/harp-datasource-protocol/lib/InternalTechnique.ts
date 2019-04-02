/*
 * Copyright (C) 2017-2019 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */

import { Technique } from "./Techniques";

/**
 * Techniques are used to specify how a geometry is drawn on the canvas.
 */
export interface InternalTechniqueParams {
    /**
     * Automatically assigned default render order. Automatic renderOrders are in ascending order
     * from the top of the theme to the bottom. Only assigned if renderOrder is not used.
     * @hidden
     */
    _renderOrderAuto?: number;

    /**
     * Optimization: Index into table in StyleSetEvaluator.
     * @hidden
     */
    _index?: number;
}

export type InternalTechnique = Technique & InternalTechniqueParams;
