"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bipatiteView = bipatiteView;

var _setPath = require("./setPath");

var _util = require("../common/util");

var _relation = require("./relation");

var _notify = require("../common/notify");

/* 
Copyright 2014 Huawei Technologies Co., Ltd. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

var importTreeJson, outputTreeJson, fromParentDom, toParentDom;

function bipatiteView(importJson, outputJson, linePathData) {

	var importTree = importTreeJson = jsonTransformation(importJson);
	var outputTree = outputTreeJson = jsonTransformation(outputJson);
	initView(importTree, outputTree, linePathData);
}

function getRelationArray() {

	var visibleInputStr = getVisibleInputStr();
	var visibleOutputStr = getVisibleOutputStr();
	var visibleInput = visibleInputStr.split(";");
	var visibleOutput = visibleOutputStr.split(";");

	return (0, _relation.initPipeline)(importTreeJson, outputTreeJson);
}

function initView(importTree, outputTree, linePathData) {

	if (linePathData.relation == undefined) {
		linePathData.relation = getRelationArray();
	}

	$("#importDiv").html("");
	$("#outputDiv").html("");
	construct($("#importDiv"), importTree, linePathData.relation);
	construct($("#outputDiv"), outputTree, linePathData.relation);

	relationLineInit(linePathData.relation);

	$("span.property").mousedown(function (event) {

		if (event.buttons != 1) {
			return false;
		}

		var _startX = $(event.target).offset().left,
		    _startY = $(event.target).offset().top,
		    startClass = $(event.target).parent().attr("class"),
		    fromPath = $(event.target).parent().attr("data-path").replace(/\-/g, '.');
		fromPath = fromPath.substring(5);

		document.onmousemove = function (event) {
			event.pageX;
			event.pageY;
			dragDropLine([_startX, _startY, event.pageX, event.pageY]);
		};

		document.onmouseup = function (event) {
			document.onmousemove = null;
			document.onmouseup = null;

			var endX = $(event.target).offset().left,
			    endY = $(event.target).offset().top,
			    endClass = $(event.target).parent().attr("class"),
			    toPath = $(event.target).parent().attr("data-path");

			$("#bipatiteLineSvg .drag-drop-line").remove();

			if (toPath != undefined) {

				if (startClass != endClass) {
					(0, _notify.notify)("Difference type", "error");
					return false;
				}

				toPath = toPath.replace(/\-/g, '.').substring(5);

				linePathData.relation = (0, _relation.addRelation)(linePathData.relation, true, fromPath, toPath, getVisibleInputStr(), getVisibleOutputStr());

				relationLineInit(linePathData.relation);
			}
		};
	});

	$("#removeLine").click(function () {
		var path = $("#bipatiteLineSvg path.active");
		var index = path.attr("data-index");
		linePathData.relation.splice(index, 1);
		relationLineInit(linePathData.relation);
		$(this).addClass("hide");
	});

	function construct(root, json) {

		for (var i = 0; i < json.length; i++) {

			var item = $('<div>', { 'class': 'item row ' + json[i].type, 'data-path': replacePoint(json[i].path) }),
			    property = $('<span>', { 'class': 'property' });

			property.text(json[i].key).attr("title", json[i].key);
			item.append(property);
			root.append(item);

			if (json[i].childNode) {
				addExpander(item);
				construct(item, json[i].childNode);
			}
		}
	}

	function addExpander(item) {
		if (item.children('.expander').length == 0) {
			var expander = $('<span>', { 'class': 'expander' });
			expander.bind('click', function () {
				var item = $(this).parent();
				item.toggleClass('expanded');
				relationLineInit(linePathData.relation);
			});
			item.prepend(expander);
		}
	}
}

function relationLineInit(ary) {
	d3.select("#bipatiteLineSvg").selectAll("path").remove();
	relationLine(ary);
}

function relationLine(ary) {

	var rootImport = $("#importDiv"),
	    rootOutput = $("#outputDiv");

	for (var i = 0; i < ary.length; i++) {

		var fromPath = replacePoint(ary[i].from);
		var toPath = replacePoint(ary[i].to);
		var fromDom = rootImport.find("div[data-path=" + fromPath + "]");
		var toDom = rootOutput.find("div[data-path=" + toPath + "]");

		if (fromDom.hasClass("expanded") && toDom.hasClass("expanded")) {
			continue;
		}

		if (fromDom.is(":visible") && toDom.is(":visible")) {
			settingOut([fromDom.offset().left, fromDom.offset().top, toDom.offset().left, toDom.offset().top], fromPath, toPath, i);
		}

		if (fromDom.is(":visible") && toDom.is(":hidden")) {
			getVisibleToParent(toDom);
			if (toParentDom != undefined) {
				settingOut([fromDom.offset().left, fromDom.offset().top, toParentDom.offset().left, toParentDom.offset().top], fromPath, toPath, i);
			}
		}

		if (fromDom.is(":hidden") && toDom.is(":visible")) {

			getVisibleFromParent(fromDom);

			if (fromParentDom != undefined) {
				settingOut([fromParentDom.offset().left, fromParentDom.offset().top, toDom.offset().left, toDom.offset().top], fromPath, toPath, i);
			}
		}

		if (fromDom.is(":hidden") && toDom.is(":hidden")) {

			getVisibleFromParent(fromDom);
			getVisibleToParent(toDom);

			if (fromParentDom != undefined && toParentDom != undefined) {
				settingOut([fromParentDom.offset().left, fromParentDom.offset().top, toParentDom.offset().left, toParentDom.offset().top], fromPath, toPath, i);
			}
		}
	}
}

function jsonTransformation(json) {
	var newJsonArray = [];

	for (var key in json) {
		newJsonArray.push({
			"key": key,
			"type": jsonType(json[key]),
			"path": "." + key
		});
		if ((0, _util.isObject)(json[key]) || (0, _util.isArray)(json[key])) {
			var child = newJsonArray[newJsonArray.length - 1].childNode = [];
			jsonChange(child, json[key], newJsonArray[newJsonArray.length - 1].path);
		}
	}
	return newJsonArray;
}

function jsonChange(child, json, path) {

	if ((0, _util.isObject)(json)) {
		for (var key in json) {
			child.push({
				"key": key,
				"type": jsonType(json[key]),
				"path": path + "." + key
			});
			if ((0, _util.isObject)(json[key]) || (0, _util.isArray)(json[key])) {
				var childNode = child[child.length - 1].childNode = [];
				jsonChange(childNode, json[key], child[child.length - 1].path);
			}
		}
	} else if ((0, _util.isArray)(json)) {
		for (var i = 0; i < json.length; i++) {
			if ((0, _util.isObject)(json[i])) {
				for (var key in json[i]) {
					child.push({
						"key": key,
						"type": jsonType(json[i][key]),
						"path": path + "." + i + "." + key
					});
					if ((0, _util.isObject)(json[i][key]) || (0, _util.isArray)(json[i][key])) {
						var childNode = child[child.length - 1].childNode = [];
						jsonChange(childNode, json[i][key], child[child.length - 1].path);
					}
				}
			}
		}
	}
}

function settingOut(point, fromPath, toPath, index) {
	var offsetTop = $("#bipatiteLineSvg").offset().top;
	var offsetLeft = $("#bipatiteLineSvg").offset().left;
	var x1 = point[0] - offsetLeft + 51;
	var y1 = point[1] - offsetTop;
	var x2 = point[2] - offsetLeft + 5;
	var y2 = point[3] - offsetTop;
	var d = (0, _setPath.getPathData)({ x: x1, y: y1 }, { x: x2, y: y2 });

	d3.select("#bipatiteLineSvg").append("path").attr("d", d).attr("stroke", "#75c880").attr("stroke-width", 6).attr("fill", "none").attr("stroke-opacity", "0.8").attr("class", "cursor").attr("from", fromPath).attr("to", toPath).attr("data-index", index).on("click", function (d, i) {
		$("#removeLine").removeClass("hide");
		$("#bipatiteLineSvg path").attr("stroke", "#75c880").removeClass("active");
		$(this).attr("class", "cursor active").attr("stroke", "red");
	});
}

function replacePoint(str) {
	str = ("start" + str).replace(/\./g, '-');
	return str;
}

function getVisibleFromParent(dom) {
	var parent = $(dom).parent();

	if (parent.is(":hidden")) {
		getVisibleFromParent(parent);
	} else {
		fromParentDom = parent;
	}
}

function getVisibleToParent(dom) {
	var parent = $(dom).parent();

	if (parent.is(":hidden")) {
		getVisibleToParent(parent);
	} else {
		toParentDom = parent;
	}
}

function jsonType(json) {
	if ((0, _util.isObject)(json)) {
		return "object";
	} else if ((0, _util.isArray)(json)) {
		return "array";
	} else if ((0, _util.isBoolean)(json)) {
		return "boolean";
	} else if ((0, _util.isString)(json)) {
		return "string";
	} else if ((0, _util.isNumber)(json)) {
		return "number";
	} else {
		return "null";
	}
}

function dragDropLine(point) {

	var offsetTop = $("#bipatiteLineSvg").offset().top;
	var offsetLeft = $("#bipatiteLineSvg").offset().left;
	var x1 = point[0] - offsetLeft + 51;
	var y1 = point[1] - offsetTop;
	var x2 = point[2] - offsetLeft + 5;
	var y2 = point[3] - offsetTop;
	var d = (0, _setPath.getPathData)({ x: x1, y: y1 }, { x: x2, y: y2 });

	if ($("#bipatiteLineSvg .drag-drop-line").length == 0) {
		d3.select("#bipatiteLineSvg").append("path").attr("d", d).attr("stroke", "red").attr("stroke-width", 3).attr("fill", "none").attr("stroke-opacity", "0.8").attr("class", "drag-drop-line");
	} else {
		d3.select(".drag-drop-line").attr("d", d);
	}
}

function getVisibleInputStr() {
	var str = "";

	$("#importDiv div.item").each(function () {
		var path = $(this).attr("data-path").replace(/\-/g, '.');
		str = str + path.substring(5) + ";";
	});

	return str;
}

function getVisibleOutputStr() {
	var str = "";

	$("#outputDiv div.item").each(function () {
		var path = $(this).attr("data-path").replace(/\-/g, '.');
		str = str + path.substring(5) + ";";
	});

	return str;
}