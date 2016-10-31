"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setPath = setPath;
exports.getPathData = getPathData;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _drag = require("../common/drag");

var _editLine = require("./editLine");

var _util = require("../common/util");

var util = _interopRequireWildcard(_util);

var _initButton = require("../pipeline/initButton");

var initButton = _interopRequireWildcard(_initButton);

var _lineHover = require("./lineHover");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* draw real line between from node and to node */
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

function setPath(options) {
    var fromDom = $("#" + options.startData.id)[0].__data__;
    var toDom = $("#" + options.endData.id)[0].__data__;

    /* line start point(x,y) is the circle(x,y) */
    var startPoint = {},
        endPoint = {};
    if (fromDom.type == constant.PIPELINE_START) {
        startPoint = { x: fromDom.translateX + 1, y: fromDom.translateY + 57 };
    } else if (fromDom.type == constant.PIPELINE_ACTION) {
        startPoint = { x: fromDom.translateX + 19, y: fromDom.translateY + 4 };
    }
    endPoint = { x: toDom.translateX - 12, y: toDom.translateY + 4 };

    constant.lineView[options.pipelineLineViewId].append("path").attr("d", getPathData(startPoint, endPoint)).attr("fill", "none").attr("stroke-opacity", "1").attr("stroke", function (d, i) {
        if (constant.currentSelectedItem != null && constant.currentSelectedItem.type == "line" && constant.currentSelectedItem.data.attr("id") == options.id) {
            (0, _lineHover.makeFrontLayer)(this);
            return "#81D9EC";
        } else {
            (0, _lineHover.makeBackLayer)(this);
            return "#E6F3E9";
        }
    }).attr("stroke-width", 10).attr("data-index", options.index).attr("id", options.id).style("cursor", "pointer").on("click", function (d) {
        this.parentNode.appendChild(this); // make this line to front layer
        var self = $(this);
        util.changeCurrentElement(constant.currentSelectedItem);
        constant.setCurrentSelectedItem({ "data": self, "type": "line" });
        initButton.updateButtonGroup("line");
        d3.select(this).attr("stroke", "#81D9EC");
        $.ajax({
            url: "../../templates/relation/editLine.html",
            type: "GET",
            cache: false,
            success: function success(data) {
                (0, _editLine.editLine)(data, self);
            }
        });
    });
}

function getPathData(startPoint, endPoint) {
    var curvature = .5;
    var x0 = startPoint.x + 30,
        x1 = endPoint.x + 2,
        xi = d3.interpolateNumber(x0, x1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature),
        y0 = startPoint.y + 30 / 2,
        y1 = endPoint.y + 30 / 2;

    return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
}