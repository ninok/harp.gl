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
/******/ 		"datasource_xyzmvt": 0
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
/******/ 	deferredModules.push(["./src/datasource_xyzmvt.ts","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/datasource_xyzmvt.ts":
/*!**********************************!*\
  !*** ./src/datasource_xyzmvt.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*\n * Copyright (C) 2017-2019 HERE Europe B.V.\n * Licensed under Apache 2.0, see full license in LICENSE\n * SPDX-License-Identifier: Apache-2.0\n */\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar harp_geoutils_1 = __webpack_require__(/*! @here/harp-geoutils */ \"../harp-geoutils/index.ts\");\nvar harp_map_controls_1 = __webpack_require__(/*! @here/harp-map-controls */ \"../harp-map-controls/index.ts\");\nvar harp_mapview_1 = __webpack_require__(/*! @here/harp-mapview */ \"../harp-mapview/index.ts\");\nvar harp_omv_datasource_1 = __webpack_require__(/*! @here/harp-omv-datasource */ \"../harp-omv-datasource/index.ts\");\nvar config_1 = __webpack_require__(/*! ../config */ \"./config.ts\");\n/**\n * MapView initialization sequence enables setting all the necessary elements on a map  and returns\n * a [[MapView]] object. Looking at the function's definition:\n *\n * ```typescript\n * function initializeMapView(id: string): MapView {\n * ```\n *\n * it can be seen that it accepts a string which holds an `id` of a DOM element to initialize the\n * map canvas within.\n *\n * ```typescript\n * [[include:harp_gl_datasource_xyzmvt_example_0.ts]]\n * ```\n *\n * During the initialization, canvas element with a given `id` is searched for first. Than a\n * [[MapView]] object is created and set to initial values of camera settings and map's geo center.\n *\n * ```typescript\n * [[include:harp_gl_datasource_xyzmvt_example_1.ts]]\n * ```\n * As a map needs controls to allow any interaction with the user (e.g. panning), a [[MapControls]]\n * object is created.\n *\n * ```typescript\n * [[include:harp_gl_datasource_xyzmvt_example_2.ts]]\n * ```\n * Finally the map is being resized to fill the whole screen and a listener for a \"resize\" event is\n * added, which enables adjusting the map's size to the browser's window size changes.\n *\n * ```typescript\n * [[include:harp_gl_datasource_xyzmvt_example_3.ts]]\n * ```\n * At the end of the initialization a [[MapView]] object is returned. To show map tiles an exemplary\n * datasource is used, [[OmvDataSource]]:\n *\n * ```typescript\n * [[include:harp_gl_datasource_xyzmvt_example_4.ts]]\n * ```\n *\n * After creating a specific datasource it needs to be added to the map in order to be seen.\n *\n * ```typescript\n * [[include:harp_gl_datasource_xyzmvt_example_5.ts]]\n * ```\n *\n */\nvar HelloWorldExample;\n(function (HelloWorldExample) {\n    // creates a new MapView for the HTMLCanvasElement of the given id\n    function initializeMapView(id) {\n        // snippet:harp_gl_datasource_xyzmvt_example_0.ts\n        var canvas = document.getElementById(id);\n        // end:harp_gl_datasource_xyzmvt_example_0.ts\n        // snippet:harp_gl_datasource_xyzmvt_example_1.ts\n        var map = new harp_mapview_1.MapView({\n            canvas: canvas,\n            theme: \"resources/berlin_tilezen_base.json\"\n        });\n        // end:harp_gl_datasource_xyzmvt_example_1.ts\n        harp_mapview_1.CopyrightElementHandler.install(\"copyrightNotice\")\n            .attach(map)\n            .setDefaults([\n            {\n                id: \"openstreetmap.org\",\n                label: \"OpenStreetMap contributors\",\n                link: \"https://www.openstreetmap.org/copyright\"\n            }\n        ]);\n        // snippet:harp_gl_datasource_xyzmvt_example_2.ts\n        // set an isometric view of the map\n        map.camera.position.set(0, 0, 1600);\n        // center the camera on Manhattan, New York City\n        map.geoCenter = new harp_geoutils_1.GeoCoordinates(40.7, -74.010241978);\n        // instantiate the default map controls, allowing the user to pan around freely.\n        var mapControls = new harp_map_controls_1.MapControls(map);\n        mapControls.setRotation(0.9, 23.928);\n        // end:harp_gl_datasource_xyzmvt_example_2.ts\n        // snippet:harp_gl_datasource_xyzmvt_example_3.ts\n        // resize the mapView to maximum\n        map.resize(window.innerWidth, window.innerHeight);\n        // react on resize events\n        window.addEventListener(\"resize\", function () {\n            map.resize(window.innerWidth, window.innerHeight);\n        });\n        // end:harp_gl_datasource_xyzmvt_example_3.ts\n        return map;\n    }\n    var mapView = initializeMapView(\"mapCanvas\");\n    // snippet:harp_gl_datasource_xyzmvt_example_4.ts\n    var omvDataSource = new harp_omv_datasource_1.OmvDataSource({\n        baseUrl: \"https://xyz.api.here.com/tiles/osmbase/256/all\",\n        apiFormat: harp_omv_datasource_1.APIFormat.XYZMVT,\n        styleSetName: \"tilezen\",\n        maxZoomLevel: 17,\n        authenticationCode: config_1.accessToken\n    });\n    // end:harp_gl_datasource_xyzmvt_example_4.ts\n    // snippet:harp_gl_datasource_xyzmvt_example_5.ts\n    mapView.addDataSource(omvDataSource);\n    // end:harp_gl_datasource_xyzmvt_example_5.ts\n})(HelloWorldExample = exports.HelloWorldExample || (exports.HelloWorldExample = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvZGF0YXNvdXJjZV94eXptdnQudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZGF0YXNvdXJjZV94eXptdnQudHM/MDM2YiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChDKSAyMDE3LTIwMTkgSEVSRSBFdXJvcGUgQi5WLlxuICogTGljZW5zZWQgdW5kZXIgQXBhY2hlIDIuMCwgc2VlIGZ1bGwgbGljZW5zZSBpbiBMSUNFTlNFXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IEdlb0Nvb3JkaW5hdGVzIH0gZnJvbSBcIkBoZXJlL2hhcnAtZ2VvdXRpbHNcIjtcbmltcG9ydCB7IE1hcENvbnRyb2xzIH0gZnJvbSBcIkBoZXJlL2hhcnAtbWFwLWNvbnRyb2xzXCI7XG5pbXBvcnQgeyBDb3B5cmlnaHRFbGVtZW50SGFuZGxlciwgTWFwVmlldyB9IGZyb20gXCJAaGVyZS9oYXJwLW1hcHZpZXdcIjtcbmltcG9ydCB7IEFQSUZvcm1hdCwgT212RGF0YVNvdXJjZSB9IGZyb20gXCJAaGVyZS9oYXJwLW9tdi1kYXRhc291cmNlXCI7XG5pbXBvcnQgeyBhY2Nlc3NUb2tlbiB9IGZyb20gXCIuLi9jb25maWdcIjtcblxuLyoqXG4gKiBNYXBWaWV3IGluaXRpYWxpemF0aW9uIHNlcXVlbmNlIGVuYWJsZXMgc2V0dGluZyBhbGwgdGhlIG5lY2Vzc2FyeSBlbGVtZW50cyBvbiBhIG1hcCAgYW5kIHJldHVybnNcbiAqIGEgW1tNYXBWaWV3XV0gb2JqZWN0LiBMb29raW5nIGF0IHRoZSBmdW5jdGlvbidzIGRlZmluaXRpb246XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogZnVuY3Rpb24gaW5pdGlhbGl6ZU1hcFZpZXcoaWQ6IHN0cmluZyk6IE1hcFZpZXcge1xuICogYGBgXG4gKlxuICogaXQgY2FuIGJlIHNlZW4gdGhhdCBpdCBhY2NlcHRzIGEgc3RyaW5nIHdoaWNoIGhvbGRzIGFuIGBpZGAgb2YgYSBET00gZWxlbWVudCB0byBpbml0aWFsaXplIHRoZVxuICogbWFwIGNhbnZhcyB3aXRoaW4uXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogW1tpbmNsdWRlOmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV8wLnRzXV1cbiAqIGBgYFxuICpcbiAqIER1cmluZyB0aGUgaW5pdGlhbGl6YXRpb24sIGNhbnZhcyBlbGVtZW50IHdpdGggYSBnaXZlbiBgaWRgIGlzIHNlYXJjaGVkIGZvciBmaXJzdC4gVGhhbiBhXG4gKiBbW01hcFZpZXddXSBvYmplY3QgaXMgY3JlYXRlZCBhbmQgc2V0IHRvIGluaXRpYWwgdmFsdWVzIG9mIGNhbWVyYSBzZXR0aW5ncyBhbmQgbWFwJ3MgZ2VvIGNlbnRlci5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBbW2luY2x1ZGU6aGFycF9nbF9kYXRhc291cmNlX3h5em12dF9leGFtcGxlXzEudHNdXVxuICogYGBgXG4gKiBBcyBhIG1hcCBuZWVkcyBjb250cm9scyB0byBhbGxvdyBhbnkgaW50ZXJhY3Rpb24gd2l0aCB0aGUgdXNlciAoZS5nLiBwYW5uaW5nKSwgYSBbW01hcENvbnRyb2xzXV1cbiAqIG9iamVjdCBpcyBjcmVhdGVkLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIFtbaW5jbHVkZTpoYXJwX2dsX2RhdGFzb3VyY2VfeHl6bXZ0X2V4YW1wbGVfMi50c11dXG4gKiBgYGBcbiAqIEZpbmFsbHkgdGhlIG1hcCBpcyBiZWluZyByZXNpemVkIHRvIGZpbGwgdGhlIHdob2xlIHNjcmVlbiBhbmQgYSBsaXN0ZW5lciBmb3IgYSBcInJlc2l6ZVwiIGV2ZW50IGlzXG4gKiBhZGRlZCwgd2hpY2ggZW5hYmxlcyBhZGp1c3RpbmcgdGhlIG1hcCdzIHNpemUgdG8gdGhlIGJyb3dzZXIncyB3aW5kb3cgc2l6ZSBjaGFuZ2VzLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIFtbaW5jbHVkZTpoYXJwX2dsX2RhdGFzb3VyY2VfeHl6bXZ0X2V4YW1wbGVfMy50c11dXG4gKiBgYGBcbiAqIEF0IHRoZSBlbmQgb2YgdGhlIGluaXRpYWxpemF0aW9uIGEgW1tNYXBWaWV3XV0gb2JqZWN0IGlzIHJldHVybmVkLiBUbyBzaG93IG1hcCB0aWxlcyBhbiBleGVtcGxhcnlcbiAqIGRhdGFzb3VyY2UgaXMgdXNlZCwgW1tPbXZEYXRhU291cmNlXV06XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogW1tpbmNsdWRlOmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV80LnRzXV1cbiAqIGBgYFxuICpcbiAqIEFmdGVyIGNyZWF0aW5nIGEgc3BlY2lmaWMgZGF0YXNvdXJjZSBpdCBuZWVkcyB0byBiZSBhZGRlZCB0byB0aGUgbWFwIGluIG9yZGVyIHRvIGJlIHNlZW4uXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogW1tpbmNsdWRlOmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV81LnRzXV1cbiAqIGBgYFxuICpcbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBIZWxsb1dvcmxkRXhhbXBsZSB7XG4gICAgLy8gY3JlYXRlcyBhIG5ldyBNYXBWaWV3IGZvciB0aGUgSFRNTENhbnZhc0VsZW1lbnQgb2YgdGhlIGdpdmVuIGlkXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZU1hcFZpZXcoaWQ6IHN0cmluZyk6IE1hcFZpZXcge1xuICAgICAgICAvLyBzbmlwcGV0OmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV8wLnRzXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgLy8gZW5kOmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV8wLnRzXG5cbiAgICAgICAgLy8gc25pcHBldDpoYXJwX2dsX2RhdGFzb3VyY2VfeHl6bXZ0X2V4YW1wbGVfMS50c1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwVmlldyh7XG4gICAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgICB0aGVtZTogXCJyZXNvdXJjZXMvYmVybGluX3RpbGV6ZW5fYmFzZS5qc29uXCJcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGVuZDpoYXJwX2dsX2RhdGFzb3VyY2VfeHl6bXZ0X2V4YW1wbGVfMS50c1xuXG4gICAgICAgIENvcHlyaWdodEVsZW1lbnRIYW5kbGVyLmluc3RhbGwoXCJjb3B5cmlnaHROb3RpY2VcIilcbiAgICAgICAgICAgIC5hdHRhY2gobWFwKVxuICAgICAgICAgICAgLnNldERlZmF1bHRzKFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBcIm9wZW5zdHJlZXRtYXAub3JnXCIsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAvLyBzbmlwcGV0OmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV8yLnRzXG4gICAgICAgIC8vIHNldCBhbiBpc29tZXRyaWMgdmlldyBvZiB0aGUgbWFwXG4gICAgICAgIG1hcC5jYW1lcmEucG9zaXRpb24uc2V0KDAsIDAsIDE2MDApO1xuICAgICAgICAvLyBjZW50ZXIgdGhlIGNhbWVyYSBvbiBNYW5oYXR0YW4sIE5ldyBZb3JrIENpdHlcbiAgICAgICAgbWFwLmdlb0NlbnRlciA9IG5ldyBHZW9Db29yZGluYXRlcyg0MC43LCAtNzQuMDEwMjQxOTc4KTtcblxuICAgICAgICAvLyBpbnN0YW50aWF0ZSB0aGUgZGVmYXVsdCBtYXAgY29udHJvbHMsIGFsbG93aW5nIHRoZSB1c2VyIHRvIHBhbiBhcm91bmQgZnJlZWx5LlxuICAgICAgICBjb25zdCBtYXBDb250cm9scyA9IG5ldyBNYXBDb250cm9scyhtYXApO1xuICAgICAgICBtYXBDb250cm9scy5zZXRSb3RhdGlvbigwLjksIDIzLjkyOCk7XG4gICAgICAgIC8vIGVuZDpoYXJwX2dsX2RhdGFzb3VyY2VfeHl6bXZ0X2V4YW1wbGVfMi50c1xuXG4gICAgICAgIC8vIHNuaXBwZXQ6aGFycF9nbF9kYXRhc291cmNlX3h5em12dF9leGFtcGxlXzMudHNcbiAgICAgICAgLy8gcmVzaXplIHRoZSBtYXBWaWV3IHRvIG1heGltdW1cbiAgICAgICAgbWFwLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgICAvLyByZWFjdCBvbiByZXNpemUgZXZlbnRzXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICAgICAgICAgIG1hcC5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBlbmQ6aGFycF9nbF9kYXRhc291cmNlX3h5em12dF9leGFtcGxlXzMudHNcblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcFZpZXcgPSBpbml0aWFsaXplTWFwVmlldyhcIm1hcENhbnZhc1wiKTtcblxuICAgIC8vIHNuaXBwZXQ6aGFycF9nbF9kYXRhc291cmNlX3h5em12dF9leGFtcGxlXzQudHNcbiAgICBjb25zdCBvbXZEYXRhU291cmNlID0gbmV3IE9tdkRhdGFTb3VyY2Uoe1xuICAgICAgICBiYXNlVXJsOiBcImh0dHBzOi8veHl6LmFwaS5oZXJlLmNvbS90aWxlcy9vc21iYXNlLzI1Ni9hbGxcIixcbiAgICAgICAgYXBpRm9ybWF0OiBBUElGb3JtYXQuWFlaTVZULFxuICAgICAgICBzdHlsZVNldE5hbWU6IFwidGlsZXplblwiLFxuICAgICAgICBtYXhab29tTGV2ZWw6IDE3LFxuICAgICAgICBhdXRoZW50aWNhdGlvbkNvZGU6IGFjY2Vzc1Rva2VuXG4gICAgfSk7XG4gICAgLy8gZW5kOmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV80LnRzXG5cbiAgICAvLyBzbmlwcGV0OmhhcnBfZ2xfZGF0YXNvdXJjZV94eXptdnRfZXhhbXBsZV81LnRzXG4gICAgbWFwVmlldy5hZGREYXRhU291cmNlKG9tdkRhdGFTb3VyY2UpO1xuICAgIC8vIGVuZDpoYXJwX2dsX2RhdGFzb3VyY2VfeHl6bXZ0X2V4YW1wbGVfNS50c1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Q0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/datasource_xyzmvt.ts\n");

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