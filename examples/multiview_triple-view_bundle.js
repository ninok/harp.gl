/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"multiview_triple-view": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/multiview_triple-view.ts","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/multiview_triple-view.ts":
/*!**************************************!*\
  !*** ./src/multiview_triple-view.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*\n * Copyright (C) 2017-2019 HERE Europe B.V.\n * Licensed under Apache 2.0, see full license in LICENSE\n * SPDX-License-Identifier: Apache-2.0\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar harp_geoutils_1 = __webpack_require__(/*! @here/harp-geoutils */ \"../harp-geoutils/index.ts\");\nvar harp_map_controls_1 = __webpack_require__(/*! @here/harp-map-controls */ \"../harp-map-controls/index.ts\");\nvar harp_mapview_1 = __webpack_require__(/*! @here/harp-mapview */ \"../harp-mapview/index.ts\");\nvar harp_omv_datasource_1 = __webpack_require__(/*! @here/harp-omv-datasource */ \"../harp-omv-datasource/index.ts\");\nvar config_1 = __webpack_require__(/*! ../config */ \"./config.ts\");\n/**\n * An example showing triple map view build with 3 [[MapView]]s each with a different theme and/or\n * datasource.\n *\n * Creates 3 views with their own MapView and MapControl as WebTileDataSourceOptions:\n * ```typescript\n * [[include:harp_gl_multiview_tripleView_1.ts]]\n * ```\n *\n * Create 3 separate [[MapView]]s and datasources that will populate them.\n * ```typescript\n * [[include:harp_gl_multiview_tripleView_2.ts]]\n * ```\n * After adding the MapViews and their dedicated datasources (each one possibly with different\n * theme, added event handlers to sync between them [[MapView]]s:\n * ```typescript\n * [[include:harp_gl_multiview_tripleView_3.ts]]\n * ```\n */\nvar TripleViewExample;\n(function (TripleViewExample) {\n    // inject HTML code to page to show additional map canvases and position them side-by-side\n    document.body.innerHTML += \"\\n\\n<style>\\n\\n    .themeName {\\n        font-weight: bold;\\n        padding: 1em;\\n        position: absolute\\n        margin-bottom: 0.5em;\\n        margin: 0 auto;\\n        width: 33%;\\n    }\\n\\n    .titleRow\\n    {\\n        display: table;\\n        table-layout: fixed;\\n        width: 100%;\\n    }\\n\\n    #mapTheme1 {\\n        background-color: rgba(0, 128, 128, 0.8);\\n        color: rgba(255, 255, 255, 0.8);\\n        display: table-cell;\\n    }\\n\\n    #mapTheme2 {\\n        background-color: rgba(64, 128, 128, 0.8);\\n        color: rgba(255, 250, 200, 0.8);\\n        display: table-cell;\\n        left: 33%;\\n    }\\n\\n    #mapTheme3 {\\n        background-color: rgba(255, 255, 255, 0.8);\\n        color: rgba(0, 128, 128, 0.9);\\n        display: table-cell;\\n        left: 66%;\\n    }\\n\\n    #mapCanvas {\\n        border: 0px;\\n        height: 100%;\\n        left: 0;\\n        overflow: hidden;\\n        position: absolute;\\n        width: calc(100%/3);\\n        z-index: -1\\n    }\\n\\n    #mapCanvas2 {\\n        border: 0px;\\n        height: 100%;\\n        left: 33.3%;\\n        overflow: hidden;\\n        position: absolute;\\n        width: calc(100%/3);\\n        z-index: -1\\n    }\\n\\n    #mapCanvas3 {\\n        border: 0px;\\n        height: 100%;\\n        left: 66.6%;\\n        overflow: hidden;\\n        position: absolute;\\n        width: calc(100%/3);\\n        z-index: -1\\n    }\\n\\n</style>\\n\\n<canvas id=\\\"mapCanvas2\\\"></canvas>\\n<canvas id=\\\"mapCanvas3\\\"></canvas>\\n<div class=\\\"titleRow\\\">\\n    <div class=\\\"themeName\\\" id=\\\"mapTheme1\\\">\\n        Data:<em> OMV</em><br/> Theme: <em>Base</em>\\n    </div>\\n    <div class=\\\"themeName\\\" id=\\\"mapTheme2\\\">\\n        Data:<em> OMV</em><br/> Theme: <em>Dark</em>\\n    </div>\\n    <div class=\\\"themeName\\\" id=\\\"mapTheme3\\\">\\n        Data:<em> OMV</em><br/> Theme: <em>Reduced</em>\\n    </div>\\n</div>\\n\";\n    var defaultTheme = \"./resources/berlin_tilezen_day_reduced.json\";\n    var numberOfSyncXViews = 3;\n    // Adjust CSS to see more then 1 row in Y axis\n    var numberOfSyncYViews = 1;\n    var defaultZoomLevel = 14;\n    function setupSyncViewsGrid(mapView, gridPosX, gridPosY) {\n        var winW = window.innerWidth;\n        var winH = window.innerHeight;\n        var chunkW = window.innerWidth / numberOfSyncXViews;\n        var chunkH = window.innerHeight / numberOfSyncYViews;\n        // force camera aspect\n        mapView.forceCameraAspect = winW / winH;\n        // resize the mapView to maximum\n        mapView.resize(chunkW, chunkH);\n        // let the camera float over the map, looking straight down\n        mapView.camera.setViewOffset(winW, winH, gridPosX * chunkW, gridPosY * chunkH, chunkW, chunkH);\n    }\n    TripleViewExample.setupSyncViewsGrid = setupSyncViewsGrid;\n    /**\n     * Creates the pair of MapView and MapControllers required to sync the views.\n     *\n     * @param id ID of HTML canvas element\n     * @param theme URL of theme to load\n     * @param decoderUrl URL of decoder bundle\n     */\n    function initMapView(id, gridPositionX, gridPositionY, theme, decoderUrl) {\n        var canvas = document.getElementById(id);\n        var mapView = new harp_mapview_1.MapView({\n            canvas: canvas,\n            theme: theme !== undefined ? theme : defaultTheme,\n            decoderUrl: decoderUrl\n        });\n        harp_mapview_1.CopyrightElementHandler.install(\"copyrightNotice\")\n            .attach(mapView)\n            .setDefaults([\n            {\n                id: \"here.com\",\n                label: \"HERE\",\n                link: \"https://legal.here.com/terms\",\n                year: 2019\n            }\n        ]);\n        mapView.camera.position.set(0, 0, 800);\n        // instantiate the default map controls, allowing the user to pan around freely.\n        var mapControls = new harp_map_controls_1.MapControls(mapView);\n        // Add an UI.\n        if (gridPositionX === 1) {\n            var ui = new harp_map_controls_1.MapControlsUI(mapControls);\n            canvas.parentElement.appendChild(ui.domElement);\n        }\n        //Set the cameras height according to the given zoom level.\n        mapView.camera.position.setZ(harp_mapview_1.MapViewUtils.calculateDistanceToGroundFromZoomLevel(mapView, defaultZoomLevel));\n        // center the camera somewhere around Berlin geo locations\n        mapView.geoCenter = new harp_geoutils_1.GeoCoordinates(52.518611, 13.376111, 0);\n        setupSyncViewsGrid(mapView, gridPositionX, gridPositionY);\n        // react on resize events\n        window.addEventListener(\"resize\", function () {\n            setupSyncViewsGrid(mapView, gridPositionX, gridPositionY);\n        });\n        return { mapView: mapView, mapControls: mapControls };\n    }\n    TripleViewExample.initMapView = initMapView;\n    // create `${numberOfSyncXViews}` MapViews, each with their own theme file\n    // snippet:harp_gl_multiview_tripleView_1.ts\n    var mapViews = {\n        view1: initMapView(\"mapCanvas\", 0, 0, \"./resources/berlin_tilezen_base.json\", \"./decoder.bundle.js\"),\n        view2: initMapView(\"mapCanvas2\", 1, 0, \"./resources/berlin_tilezen_night_reduced.json\", \"./decoder.bundle.js\"),\n        view3: initMapView(\"mapCanvas3\", 2, 0, \"./resources/berlin_tilezen_day_reduced.json\", \"./decoder.bundle.js\")\n    };\n    // end:harp_gl_multiview_tripleView_1.ts\n    // snippet:harp_gl_multiview_tripleView_2.ts\n    var xyzDataSourceParams = {\n        baseUrl: \"https://xyz.api.here.com/tiles/herebase.02\",\n        apiFormat: harp_omv_datasource_1.APIFormat.XYZOMV,\n        styleSetName: \"tilezen\",\n        maxZoomLevel: 17,\n        authenticationCode: config_1.accessToken\n    };\n    var dataSources = {\n        omvDataSource1: new harp_omv_datasource_1.OmvDataSource(xyzDataSourceParams),\n        omvDataSource2: new harp_omv_datasource_1.OmvDataSource(xyzDataSourceParams),\n        omvDataSource3: new harp_omv_datasource_1.OmvDataSource(xyzDataSourceParams)\n    };\n    mapViews.view1.mapView.addDataSource(dataSources.omvDataSource1);\n    mapViews.view2.mapView.addDataSource(dataSources.omvDataSource2);\n    mapViews.view3.mapView.addDataSource(dataSources.omvDataSource3);\n    // end:harp_gl_multiview_tripleView_2.ts\n    /**\n     * A function that copies the position and orientation of one MapView/MapControl to the others.\n     *\n     * @param srcView Source with MapView with current location and MapControl with current camera\n     *                  position and orientation\n     * @param destView Destination MapView synced to current location; MapControl synced to current\n     *                  position and orientation\n     */\n    // snippet:harp_gl_multiview_tripleView_3.ts\n    TripleViewExample.syncMapViews = function (srcView, destView) {\n        var ypr = srcView.mapControls.yawPitchRoll;\n        destView.mapControls.setRotation(ypr.yaw, ypr.pitch);\n        destView.mapView.worldCenter.copy(srcView.mapView.worldCenter);\n        destView.mapControls.cameraHeight = srcView.mapControls.cameraHeight;\n        //destView.mapView.camera.aspect = numberOfSyncXViews;\n        destView.mapView.camera.updateProjectionMatrix();\n        // force update on changed MapView\n        destView.mapView.update();\n    };\n    var views = [mapViews.view1, mapViews.view2, mapViews.view3];\n    // sync camera of each view to other views changes.\n    views.forEach(function (v, index) {\n        var otherViews = views.slice();\n        otherViews.splice(index, 1);\n        // tslint:disable-next-line:no-unused-variable\n        otherViews.forEach(function (otherView, indexTemp) {\n            v.mapControls.addEventListener(\"update\", function () {\n                TripleViewExample.syncMapViews(views[index], otherViews[indexTemp]);\n            });\n        });\n    });\n    // end:harp_gl_multiview_tripleView_3.ts\n})(TripleViewExample = exports.TripleViewExample || (exports.TripleViewExample = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbXVsdGl2aWV3X3RyaXBsZS12aWV3LnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL211bHRpdmlld190cmlwbGUtdmlldy50cz81OWYyIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTctMjAxOSBIRVJFIEV1cm9wZSBCLlYuXG4gKiBMaWNlbnNlZCB1bmRlciBBcGFjaGUgMi4wLCBzZWUgZnVsbCBsaWNlbnNlIGluIExJQ0VOU0VcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuaW1wb3J0IHsgR2VvQ29vcmRpbmF0ZXMgfSBmcm9tIFwiQGhlcmUvaGFycC1nZW91dGlsc1wiO1xuaW1wb3J0IHsgTWFwQ29udHJvbHMsIE1hcENvbnRyb2xzVUkgfSBmcm9tIFwiQGhlcmUvaGFycC1tYXAtY29udHJvbHNcIjtcbmltcG9ydCB7IENvcHlyaWdodEVsZW1lbnRIYW5kbGVyLCBNYXBWaWV3LCBNYXBWaWV3VXRpbHMgfSBmcm9tIFwiQGhlcmUvaGFycC1tYXB2aWV3XCI7XG5pbXBvcnQgeyBBUElGb3JtYXQsIE9tdkRhdGFTb3VyY2UgfSBmcm9tIFwiQGhlcmUvaGFycC1vbXYtZGF0YXNvdXJjZVwiO1xuaW1wb3J0IHsgYWNjZXNzVG9rZW4gfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbi8qKlxuICogQW4gZXhhbXBsZSBzaG93aW5nIHRyaXBsZSBtYXAgdmlldyBidWlsZCB3aXRoIDMgW1tNYXBWaWV3XV1zIGVhY2ggd2l0aCBhIGRpZmZlcmVudCB0aGVtZSBhbmQvb3JcbiAqIGRhdGFzb3VyY2UuXG4gKlxuICogQ3JlYXRlcyAzIHZpZXdzIHdpdGggdGhlaXIgb3duIE1hcFZpZXcgYW5kIE1hcENvbnRyb2wgYXMgV2ViVGlsZURhdGFTb3VyY2VPcHRpb25zOlxuICogYGBgdHlwZXNjcmlwdFxuICogW1tpbmNsdWRlOmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMS50c11dXG4gKiBgYGBcbiAqXG4gKiBDcmVhdGUgMyBzZXBhcmF0ZSBbW01hcFZpZXddXXMgYW5kIGRhdGFzb3VyY2VzIHRoYXQgd2lsbCBwb3B1bGF0ZSB0aGVtLlxuICogYGBgdHlwZXNjcmlwdFxuICogW1tpbmNsdWRlOmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMi50c11dXG4gKiBgYGBcbiAqIEFmdGVyIGFkZGluZyB0aGUgTWFwVmlld3MgYW5kIHRoZWlyIGRlZGljYXRlZCBkYXRhc291cmNlcyAoZWFjaCBvbmUgcG9zc2libHkgd2l0aCBkaWZmZXJlbnRcbiAqIHRoZW1lLCBhZGRlZCBldmVudCBoYW5kbGVycyB0byBzeW5jIGJldHdlZW4gdGhlbSBbW01hcFZpZXddXXM6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBbW2luY2x1ZGU6aGFycF9nbF9tdWx0aXZpZXdfdHJpcGxlVmlld18zLnRzXV1cbiAqIGBgYFxuICovXG5cbmV4cG9ydCBuYW1lc3BhY2UgVHJpcGxlVmlld0V4YW1wbGUge1xuICAgIC8vIGluamVjdCBIVE1MIGNvZGUgdG8gcGFnZSB0byBzaG93IGFkZGl0aW9uYWwgbWFwIGNhbnZhc2VzIGFuZCBwb3NpdGlvbiB0aGVtIHNpZGUtYnktc2lkZVxuICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MICs9IGBcblxuPHN0eWxlPlxuXG4gICAgLnRoZW1lTmFtZSB7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICBwYWRkaW5nOiAxZW07XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxuICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjVlbTtcbiAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICAgIHdpZHRoOiAzMyU7XG4gICAgfVxuXG4gICAgLnRpdGxlUm93XG4gICAge1xuICAgICAgICBkaXNwbGF5OiB0YWJsZTtcbiAgICAgICAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgI21hcFRoZW1lMSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAxMjgsIDAuOCk7XG4gICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCk7XG4gICAgICAgIGRpc3BsYXk6IHRhYmxlLWNlbGw7XG4gICAgfVxuXG4gICAgI21hcFRoZW1lMiB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNjQsIDEyOCwgMTI4LCAwLjgpO1xuICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1MCwgMjAwLCAwLjgpO1xuICAgICAgICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICAgICAgICBsZWZ0OiAzMyU7XG4gICAgfVxuXG4gICAgI21hcFRoZW1lMyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcbiAgICAgICAgY29sb3I6IHJnYmEoMCwgMTI4LCAxMjgsIDAuOSk7XG4gICAgICAgIGRpc3BsYXk6IHRhYmxlLWNlbGw7XG4gICAgICAgIGxlZnQ6IDY2JTtcbiAgICB9XG5cbiAgICAjbWFwQ2FudmFzIHtcbiAgICAgICAgYm9yZGVyOiAwcHg7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB3aWR0aDogY2FsYygxMDAlLzMpO1xuICAgICAgICB6LWluZGV4OiAtMVxuICAgIH1cblxuICAgICNtYXBDYW52YXMyIHtcbiAgICAgICAgYm9yZGVyOiAwcHg7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgbGVmdDogMzMuMyU7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgd2lkdGg6IGNhbGMoMTAwJS8zKTtcbiAgICAgICAgei1pbmRleDogLTFcbiAgICB9XG5cbiAgICAjbWFwQ2FudmFzMyB7XG4gICAgICAgIGJvcmRlcjogMHB4O1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGxlZnQ6IDY2LjYlO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHdpZHRoOiBjYWxjKDEwMCUvMyk7XG4gICAgICAgIHotaW5kZXg6IC0xXG4gICAgfVxuXG48L3N0eWxlPlxuXG48Y2FudmFzIGlkPVwibWFwQ2FudmFzMlwiPjwvY2FudmFzPlxuPGNhbnZhcyBpZD1cIm1hcENhbnZhczNcIj48L2NhbnZhcz5cbjxkaXYgY2xhc3M9XCJ0aXRsZVJvd1wiPlxuICAgIDxkaXYgY2xhc3M9XCJ0aGVtZU5hbWVcIiBpZD1cIm1hcFRoZW1lMVwiPlxuICAgICAgICBEYXRhOjxlbT4gT01WPC9lbT48YnIvPiBUaGVtZTogPGVtPkJhc2U8L2VtPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ0aGVtZU5hbWVcIiBpZD1cIm1hcFRoZW1lMlwiPlxuICAgICAgICBEYXRhOjxlbT4gT01WPC9lbT48YnIvPiBUaGVtZTogPGVtPkRhcms8L2VtPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ0aGVtZU5hbWVcIiBpZD1cIm1hcFRoZW1lM1wiPlxuICAgICAgICBEYXRhOjxlbT4gT01WPC9lbT48YnIvPiBUaGVtZTogPGVtPlJlZHVjZWQ8L2VtPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG4gICAgY29uc3QgZGVmYXVsdFRoZW1lID0gXCIuL3Jlc291cmNlcy9iZXJsaW5fdGlsZXplbl9kYXlfcmVkdWNlZC5qc29uXCI7XG4gICAgY29uc3QgbnVtYmVyT2ZTeW5jWFZpZXdzID0gMztcbiAgICAvLyBBZGp1c3QgQ1NTIHRvIHNlZSBtb3JlIHRoZW4gMSByb3cgaW4gWSBheGlzXG4gICAgY29uc3QgbnVtYmVyT2ZTeW5jWVZpZXdzID0gMTtcbiAgICBjb25zdCBkZWZhdWx0Wm9vbUxldmVsID0gMTQ7XG5cbiAgICAvKipcbiAgICAgKiBBIHBhaXIgb2YgTWFwVmlldyBhbmQgTWFwQ29udHJvbGxlci5cbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIFZpZXdDb250cm9sUGFpciB7XG4gICAgICAgIG1hcFZpZXc6IE1hcFZpZXc7XG4gICAgICAgIG1hcENvbnRyb2xzOiBNYXBDb250cm9scztcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0dXBTeW5jVmlld3NHcmlkKG1hcFZpZXc6IE1hcFZpZXcsIGdyaWRQb3NYOiBudW1iZXIsIGdyaWRQb3NZOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgd2luVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjb25zdCB3aW5IID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBjb25zdCBjaHVua1cgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIG51bWJlck9mU3luY1hWaWV3cztcbiAgICAgICAgY29uc3QgY2h1bmtIID0gd2luZG93LmlubmVySGVpZ2h0IC8gbnVtYmVyT2ZTeW5jWVZpZXdzO1xuICAgICAgICAvLyBmb3JjZSBjYW1lcmEgYXNwZWN0XG4gICAgICAgIG1hcFZpZXcuZm9yY2VDYW1lcmFBc3BlY3QgPSB3aW5XIC8gd2luSDtcbiAgICAgICAgLy8gcmVzaXplIHRoZSBtYXBWaWV3IHRvIG1heGltdW1cbiAgICAgICAgbWFwVmlldy5yZXNpemUoY2h1bmtXLCBjaHVua0gpO1xuXG4gICAgICAgIC8vIGxldCB0aGUgY2FtZXJhIGZsb2F0IG92ZXIgdGhlIG1hcCwgbG9va2luZyBzdHJhaWdodCBkb3duXG4gICAgICAgIG1hcFZpZXcuY2FtZXJhLnNldFZpZXdPZmZzZXQoXG4gICAgICAgICAgICB3aW5XLFxuICAgICAgICAgICAgd2luSCxcbiAgICAgICAgICAgIGdyaWRQb3NYICogY2h1bmtXLFxuICAgICAgICAgICAgZ3JpZFBvc1kgKiBjaHVua0gsXG4gICAgICAgICAgICBjaHVua1csXG4gICAgICAgICAgICBjaHVua0hcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBwYWlyIG9mIE1hcFZpZXcgYW5kIE1hcENvbnRyb2xsZXJzIHJlcXVpcmVkIHRvIHN5bmMgdGhlIHZpZXdzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIElEIG9mIEhUTUwgY2FudmFzIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gdGhlbWUgVVJMIG9mIHRoZW1lIHRvIGxvYWRcbiAgICAgKiBAcGFyYW0gZGVjb2RlclVybCBVUkwgb2YgZGVjb2RlciBidW5kbGVcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdE1hcFZpZXcoXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGdyaWRQb3NpdGlvblg6IG51bWJlcixcbiAgICAgICAgZ3JpZFBvc2l0aW9uWTogbnVtYmVyLFxuICAgICAgICB0aGVtZT86IHN0cmluZyxcbiAgICAgICAgZGVjb2RlclVybD86IHN0cmluZ1xuICAgICk6IFZpZXdDb250cm9sUGFpciB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgICAgICBjb25zdCBtYXBWaWV3ID0gbmV3IE1hcFZpZXcoe1xuICAgICAgICAgICAgY2FudmFzLFxuICAgICAgICAgICAgdGhlbWU6IHRoZW1lICE9PSB1bmRlZmluZWQgPyB0aGVtZSA6IGRlZmF1bHRUaGVtZSxcbiAgICAgICAgICAgIGRlY29kZXJVcmxcbiAgICAgICAgfSk7XG4gICAgICAgIENvcHlyaWdodEVsZW1lbnRIYW5kbGVyLmluc3RhbGwoXCJjb3B5cmlnaHROb3RpY2VcIilcbiAgICAgICAgICAgIC5hdHRhY2gobWFwVmlldylcbiAgICAgICAgICAgIC5zZXREZWZhdWx0cyhbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogXCJoZXJlLmNvbVwiLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJIRVJFXCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9sZWdhbC5oZXJlLmNvbS90ZXJtc1wiLFxuICAgICAgICAgICAgICAgICAgICB5ZWFyOiAyMDE5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIG1hcFZpZXcuY2FtZXJhLnBvc2l0aW9uLnNldCgwLCAwLCA4MDApO1xuXG4gICAgICAgIC8vIGluc3RhbnRpYXRlIHRoZSBkZWZhdWx0IG1hcCBjb250cm9scywgYWxsb3dpbmcgdGhlIHVzZXIgdG8gcGFuIGFyb3VuZCBmcmVlbHkuXG4gICAgICAgIGNvbnN0IG1hcENvbnRyb2xzID0gbmV3IE1hcENvbnRyb2xzKG1hcFZpZXcpO1xuXG4gICAgICAgIC8vIEFkZCBhbiBVSS5cbiAgICAgICAgaWYgKGdyaWRQb3NpdGlvblggPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHVpID0gbmV3IE1hcENvbnRyb2xzVUkobWFwQ29udHJvbHMpO1xuICAgICAgICAgICAgY2FudmFzLnBhcmVudEVsZW1lbnQhLmFwcGVuZENoaWxkKHVpLmRvbUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TZXQgdGhlIGNhbWVyYXMgaGVpZ2h0IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gem9vbSBsZXZlbC5cbiAgICAgICAgbWFwVmlldy5jYW1lcmEucG9zaXRpb24uc2V0WihcbiAgICAgICAgICAgIE1hcFZpZXdVdGlscy5jYWxjdWxhdGVEaXN0YW5jZVRvR3JvdW5kRnJvbVpvb21MZXZlbChtYXBWaWV3LCBkZWZhdWx0Wm9vbUxldmVsKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGNlbnRlciB0aGUgY2FtZXJhIHNvbWV3aGVyZSBhcm91bmQgQmVybGluIGdlbyBsb2NhdGlvbnNcbiAgICAgICAgbWFwVmlldy5nZW9DZW50ZXIgPSBuZXcgR2VvQ29vcmRpbmF0ZXMoNTIuNTE4NjExLCAxMy4zNzYxMTEsIDApO1xuXG4gICAgICAgIHNldHVwU3luY1ZpZXdzR3JpZChtYXBWaWV3LCBncmlkUG9zaXRpb25YLCBncmlkUG9zaXRpb25ZKTtcbiAgICAgICAgLy8gcmVhY3Qgb24gcmVzaXplIGV2ZW50c1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXR1cFN5bmNWaWV3c0dyaWQobWFwVmlldywgZ3JpZFBvc2l0aW9uWCwgZ3JpZFBvc2l0aW9uWSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7IG1hcFZpZXcsIG1hcENvbnRyb2xzIH07XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGAke251bWJlck9mU3luY1hWaWV3c31gIE1hcFZpZXdzLCBlYWNoIHdpdGggdGhlaXIgb3duIHRoZW1lIGZpbGVcbiAgICAvLyBzbmlwcGV0OmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMS50c1xuICAgIGNvbnN0IG1hcFZpZXdzID0ge1xuICAgICAgICB2aWV3MTogaW5pdE1hcFZpZXcoXG4gICAgICAgICAgICBcIm1hcENhbnZhc1wiLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBcIi4vcmVzb3VyY2VzL2Jlcmxpbl90aWxlemVuX2Jhc2UuanNvblwiLFxuICAgICAgICAgICAgXCIuL2RlY29kZXIuYnVuZGxlLmpzXCJcbiAgICAgICAgKSxcbiAgICAgICAgdmlldzI6IGluaXRNYXBWaWV3KFxuICAgICAgICAgICAgXCJtYXBDYW52YXMyXCIsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIFwiLi9yZXNvdXJjZXMvYmVybGluX3RpbGV6ZW5fbmlnaHRfcmVkdWNlZC5qc29uXCIsXG4gICAgICAgICAgICBcIi4vZGVjb2Rlci5idW5kbGUuanNcIlxuICAgICAgICApLFxuICAgICAgICB2aWV3MzogaW5pdE1hcFZpZXcoXG4gICAgICAgICAgICBcIm1hcENhbnZhczNcIixcbiAgICAgICAgICAgIDIsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgXCIuL3Jlc291cmNlcy9iZXJsaW5fdGlsZXplbl9kYXlfcmVkdWNlZC5qc29uXCIsXG4gICAgICAgICAgICBcIi4vZGVjb2Rlci5idW5kbGUuanNcIlxuICAgICAgICApXG4gICAgfTtcbiAgICAvLyBlbmQ6aGFycF9nbF9tdWx0aXZpZXdfdHJpcGxlVmlld18xLnRzXG5cbiAgICAvLyBzbmlwcGV0OmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMi50c1xuICAgIGNvbnN0IHh5ekRhdGFTb3VyY2VQYXJhbXMgPSB7XG4gICAgICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly94eXouYXBpLmhlcmUuY29tL3RpbGVzL2hlcmViYXNlLjAyXCIsXG4gICAgICAgIGFwaUZvcm1hdDogQVBJRm9ybWF0LlhZWk9NVixcbiAgICAgICAgc3R5bGVTZXROYW1lOiBcInRpbGV6ZW5cIixcbiAgICAgICAgbWF4Wm9vbUxldmVsOiAxNyxcbiAgICAgICAgYXV0aGVudGljYXRpb25Db2RlOiBhY2Nlc3NUb2tlblxuICAgIH07XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSB7XG4gICAgICAgIG9tdkRhdGFTb3VyY2UxOiBuZXcgT212RGF0YVNvdXJjZSh4eXpEYXRhU291cmNlUGFyYW1zKSxcbiAgICAgICAgb212RGF0YVNvdXJjZTI6IG5ldyBPbXZEYXRhU291cmNlKHh5ekRhdGFTb3VyY2VQYXJhbXMpLFxuICAgICAgICBvbXZEYXRhU291cmNlMzogbmV3IE9tdkRhdGFTb3VyY2UoeHl6RGF0YVNvdXJjZVBhcmFtcylcbiAgICB9O1xuXG4gICAgbWFwVmlld3MudmlldzEubWFwVmlldy5hZGREYXRhU291cmNlKGRhdGFTb3VyY2VzLm9tdkRhdGFTb3VyY2UxKTtcbiAgICBtYXBWaWV3cy52aWV3Mi5tYXBWaWV3LmFkZERhdGFTb3VyY2UoZGF0YVNvdXJjZXMub212RGF0YVNvdXJjZTIpO1xuICAgIG1hcFZpZXdzLnZpZXczLm1hcFZpZXcuYWRkRGF0YVNvdXJjZShkYXRhU291cmNlcy5vbXZEYXRhU291cmNlMyk7XG4gICAgLy8gZW5kOmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMi50c1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IGNvcGllcyB0aGUgcG9zaXRpb24gYW5kIG9yaWVudGF0aW9uIG9mIG9uZSBNYXBWaWV3L01hcENvbnRyb2wgdG8gdGhlIG90aGVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzcmNWaWV3IFNvdXJjZSB3aXRoIE1hcFZpZXcgd2l0aCBjdXJyZW50IGxvY2F0aW9uIGFuZCBNYXBDb250cm9sIHdpdGggY3VycmVudCBjYW1lcmFcbiAgICAgKiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIGFuZCBvcmllbnRhdGlvblxuICAgICAqIEBwYXJhbSBkZXN0VmlldyBEZXN0aW5hdGlvbiBNYXBWaWV3IHN5bmNlZCB0byBjdXJyZW50IGxvY2F0aW9uOyBNYXBDb250cm9sIHN5bmNlZCB0byBjdXJyZW50XG4gICAgICogICAgICAgICAgICAgICAgICBwb3NpdGlvbiBhbmQgb3JpZW50YXRpb25cbiAgICAgKi9cbiAgICAvLyBzbmlwcGV0OmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMy50c1xuICAgIGV4cG9ydCBjb25zdCBzeW5jTWFwVmlld3MgPSAoc3JjVmlldzogVmlld0NvbnRyb2xQYWlyLCBkZXN0VmlldzogVmlld0NvbnRyb2xQYWlyKSA9PiB7XG4gICAgICAgIGNvbnN0IHlwciA9IHNyY1ZpZXcubWFwQ29udHJvbHMueWF3UGl0Y2hSb2xsO1xuICAgICAgICBkZXN0Vmlldy5tYXBDb250cm9scy5zZXRSb3RhdGlvbih5cHIueWF3LCB5cHIucGl0Y2gpO1xuICAgICAgICBkZXN0Vmlldy5tYXBWaWV3LndvcmxkQ2VudGVyLmNvcHkoc3JjVmlldy5tYXBWaWV3LndvcmxkQ2VudGVyKTtcbiAgICAgICAgZGVzdFZpZXcubWFwQ29udHJvbHMuY2FtZXJhSGVpZ2h0ID0gc3JjVmlldy5tYXBDb250cm9scy5jYW1lcmFIZWlnaHQ7XG4gICAgICAgIC8vZGVzdFZpZXcubWFwVmlldy5jYW1lcmEuYXNwZWN0ID0gbnVtYmVyT2ZTeW5jWFZpZXdzO1xuICAgICAgICBkZXN0Vmlldy5tYXBWaWV3LmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICAgICAgLy8gZm9yY2UgdXBkYXRlIG9uIGNoYW5nZWQgTWFwVmlld1xuICAgICAgICBkZXN0Vmlldy5tYXBWaWV3LnVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCB2aWV3cyA9IFttYXBWaWV3cy52aWV3MSwgbWFwVmlld3MudmlldzIsIG1hcFZpZXdzLnZpZXczXTtcblxuICAgIC8vIHN5bmMgY2FtZXJhIG9mIGVhY2ggdmlldyB0byBvdGhlciB2aWV3cyBjaGFuZ2VzLlxuICAgIHZpZXdzLmZvckVhY2goKHY6IFZpZXdDb250cm9sUGFpciwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBvdGhlclZpZXdzID0gdmlld3Muc2xpY2UoKTtcbiAgICAgICAgb3RoZXJWaWV3cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW51c2VkLXZhcmlhYmxlXG4gICAgICAgIG90aGVyVmlld3MuZm9yRWFjaCgob3RoZXJWaWV3OiBWaWV3Q29udHJvbFBhaXIsIGluZGV4VGVtcDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICB2Lm1hcENvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVcIixcbiAgICAgICAgICAgICAgICAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN5bmNNYXBWaWV3cyh2aWV3c1tpbmRleF0sIG90aGVyVmlld3NbaW5kZXhUZW1wXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gZW5kOmhhcnBfZ2xfbXVsdGl2aWV3X3RyaXBsZVZpZXdfMy50c1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBdUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBUUE7QUFuQkE7QUFxQkE7Ozs7OztBQU1BO0FBQ0E7QUFPQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBbERBO0FBb0RBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFPQTtBQU9BO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/multiview_triple-view.ts\n");

/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = THREE;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWUuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJUSFJFRVwiP2ZjMDAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBUSFJFRTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///three\n");

/***/ })

/******/ });