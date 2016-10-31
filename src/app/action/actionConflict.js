"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConflict = getConflict;
exports.svgTree = svgTree;

var _util = require("../common/util");

var _conflict = require("../relation/conflict");

var conflictUtil = _interopRequireWildcard(_conflict);

var _setPath = require("../relation/setPath");

var _notify = require("../common/notify");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function getConflict(actionId) {
    $("#conflictTreeView").empty();
    var conflict = conflictUtil.getActionConflict(actionId);
    console.log(conflict);
    if (_.isEmpty(conflict)) {
        var noconflict = "<h4 class='pr'>" + "<em>No Conflict</em>" + "</h4>";
        $("#conflictTreeView").append(noconflict);
    } else {
        svgTree(d3.select("#conflictTreeView"), conflict, actionId);
    }
}

function svgTree(container, data, actionId) {
    var conflictDIV = $("#conflictTreeView");
    var svgWidth = ($("#actionTabsContent").width() - 110) / 2;
    var conflictActions = _.filter(data.node, function (node) {
        return node.id != actionId;
    });
    var curAction = _.filter(data.node, function (node) {
        return node.id == actionId;
    });
    var conflictArray = transformJson(conflictActions, svgWidth / 5);
    var curActionArray = transformJson(curAction, svgWidth + svgWidth / 5);
    console.log(conflictDIV.height());
    var svg = container.append("svg").attr("width", "100%").attr("height", conflictDIV.height() - 100).style("fill", "white");
    for (var i = 0; i < conflictArray.length; i++) {
        construct(svg, conflictArray[i], "conflict-source");
    }

    for (var _i = 0; _i < curActionArray.length; _i++) {
        construct(svg, curActionArray[_i], "conflict-base");
    }

    drawLine(data.line);

    function transformJson(data, initX) {

        var jsonArray = [];
        var depthY = 0;
        var depthX = 1;

        for (var _i2 = 0; _i2 < data.length; _i2++) {
            depthY++;
            jsonArray.push({
                depthX: depthX,
                depthY: depthY,
                type: "object",
                initX: initX,
                name: data[_i2].name,
                class: "",
                category: "action",
                parentActionId: data[_i2].id
            });

            for (var j = 0; j < data[_i2].conflicts.length; j++) {

                var conflicts = data[_i2].conflicts[j];

                for (var key in conflicts) {
                    depthY++;

                    jsonArray.push({
                        depthX: 2,
                        depthY: depthY,
                        type: (0, _util.judgeType)(conflicts[key]),
                        initX: initX,
                        parentActionId: data[_i2].id,
                        name: key,
                        class: key,
                        category: (0, _util.judgeType)(conflicts[key]) == "object" ? "path" : "property"
                    });

                    getChildJson(conflicts[key], 3, data[_i2].id, key);
                }
            }
        }

        function getChildJson(data, depthX, parentActionId, parentPath) {
            if ((0, _util.isObject)(data)) {
                for (var _key in data) {
                    depthY++;
                    jsonArray.push({
                        depthX: depthX,
                        depthY: depthY,
                        type: (0, _util.judgeType)(data[_key]),
                        initX: initX,
                        parentActionId: parentActionId,
                        name: _key,
                        class: parentPath + "." + _key,
                        category: (0, _util.judgeType)(data[_key]) == "object" ? "path" : "property"

                    });
                    getChildJson(data[_key], depthX + 1, parentActionId, parentPath + "." + _key);
                }
            }

            if ((0, _util.isArray)(data) && data.length > 0) {}
        }

        return jsonArray;
    }

    function construct(svg, options, type) {
        var gLine = svg.append("g").attr("id", "conflictLine");

        var g = svg.append("g")
        // .attr("transform", "translate(" + (options.depthX * 20 + options.initX) + "," + (options.depthY * 28) + ")")
        .attr("transform", "translate(" + (options.depthX * 20 + options.initX) + "," + options.depthY * 28 + ")").attr("id", options.parentActionId + "_" + options.class.replace(/\./g, "_")).attr("tx", options.depthX * 20 + options.initX).attr("ty", options.depthY * 28).attr("data-type", type).attr("data-class", options.class.replace(/\./g, "_")).attr("data-clean", options.class).style("cursor", "pointer").on("mouseover", function () {
            if (options.category == "property") {
                d3.selectAll("[data-class=" + options.class.replace(/\./g, "_") + "]").each(function (d, i) {

                    var d3DOM = d3.select(this);
                    d3DOM.select("rect").attr("fill", "#555");
                    var elementType = d3DOM.attr("data-type");
                    if (elementType == "conflict-line") {
                        d3DOM.attr("stroke", "#555");
                    } else {
                        d3DOM.select(".conflict-image").attr("xlink:href", function () {
                            if (elementType == "conflict-source") {
                                if (options.type != "object") {
                                    return "../../assets/svg/remove-conflict.svg";
                                } else {
                                    return "../../assets/svg/highlight-conflict.svg";
                                }
                            } else if (elementType == "conflict-base") {
                                return "../../assets/svg/highlight-conflict.svg";
                            }
                        });
                    }
                });
            }
        }).on("mouseout", function () {
            if (options.category == "property") {
                d3.selectAll("[data-class=" + options.class.replace(/\./g, "_") + "]").select("rect").attr("fill", function () {
                    switch (options.type) {
                        case "string":
                            return "#13b5b1";
                            break;
                        case "object":
                            return "#eb6876";
                            break;
                        case "number":
                            return "#32b16c";
                            break;
                        case "array":
                            return "#c490c0";
                            break;
                        case "boolean":
                            return "#8fc320";
                            break;
                        default:
                            return "#cfcfcf";
                    };
                });

                d3.selectAll("[data-class=" + options.class.replace(/\./g, "_") + "]").each(function () {

                    var d3DOM = d3.select(this);
                    var type = d3DOM.attr("data-type");
                    if (type == "conflict-line") {
                        d3DOM.attr("stroke", "#e0e004");
                    } else {
                        d3DOM.select(".conflict-image").attr("xlink:href", "../../assets/svg/conflict.svg");
                    }
                });
            }
        });
        var rect = g.append('rect').attr("ry", 5).attr("rx", 5).attr("y", 0).attr("width", 135).attr("height", 24).attr("fill", function () {
            switch (options.type) {
                case "string":
                    return "#13b5b1";
                    break;
                case "object":
                    return "#eb6876";
                    break;
                case "number":
                    return "#32b16c";
                    break;
                case "array":
                    return "#c490c0";
                    break;
                case "boolean":
                    return "#8fc320";
                    break;
                default:
                    return "#cfcfcf";
            }
        });

        var clashImage = g.append('image').attr("transform", "translate(0,0)").attr("xlink:href", "../../assets/svg/conflict.svg").attr("x", 2).attr("y", 2).attr("width", 20).attr("height", 20).attr("class", "conflict-image").on("click", function () {
            if (type == "conflict-source") {

                if (options.parentActionId) {
                    var conflictSourceId = options.parentActionId;
                    conflictUtil.cleanConflict(conflictSourceId, actionId, options.class);

                    getConflict(actionId);
                    (0, _notify.notify)("Remove conflict successfully", "success");
                    return false;
                }
            }
        });
        var typeImage = g.append('image').attr("transform", "translate(115,0)").attr("xlink:href", function () {
            switch (options.type) {
                case "string":
                    return "../../assets/images/string.png";
                    break;
                case "object":
                    return "../../assets/images/object.png";
                    break;
                case "number":
                    return "../../assets/images/number.png";
                    break;
                case "array":
                    return "../../assets/images/array.png";
                    break;
                case "boolean":
                    return "../../assets/images/boolean.png";
                    break;
                default:
                    return "";
            }
        }).attr("x", "0").attr("y", "0").attr("width", "20").attr("height", "24").attr("class", "type-image");

        var text = g.append('text').attr("dx", 28).attr("dy", 17).attr("fill", function () {
            if (options.type == "null") {
                return "#8e8a89";
            } else {
                return "#fff";
            }
        }).text(function () {
            if (options.name.length > 12) {
                return options.name.substring(0, 10) + "...";
            } else {
                return options.name;
            }
        });
    }
}

function drawLine(lineArray) {
    for (var i = 0; i < lineArray.length; i++) {
        var start = $("#" + lineArray[i].fromData.replace(/\./g, "_"));
        var end = $("#" + lineArray[i].toData.replace(/\./g, "_"));
        var point = [start.attr("tx"), start.attr("ty"), end.attr("tx"), end.attr("ty")];
        var dataClass = _.rest(lineArray[i].fromData.split(".")).join("_");
        // drawLinePath(point, "", "");
        drawLinePath(point, dataClass, "conflict-line");
    }
}

function drawLinePath(point, dataClass, type, fromPath, toPath) {
    // var offsetTop = $("#bipatiteLineSvg").offset().top;
    // var offsetLeft = $("#bipatiteLineSvg").offset().left;
    var x1 = parseInt(point[0]) + 70;
    var y1 = parseInt(point[1]);
    var x2 = parseInt(point[2]);
    var y2 = parseInt(point[3]);
    var d = (0, _setPath.getPathData)({ x: x1, y: y1 }, { x: x2, y: y2 });

    d3.select("#conflictLine").append("path").attr("d", d).attr("stroke", "#e0e004").attr("stroke-width", 6).attr("fill", "none").attr("stroke-opacity", "0.8").attr("class", "cursor").attr("data-class", dataClass).attr("data-type", type);
}