"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mouseoverRelevantPipeline = mouseoverRelevantPipeline;
exports.mouseoutRelevantPipeline = mouseoutRelevantPipeline;
exports.makeFrontLayer = makeFrontLayer;
exports.makeBackLayer = makeBackLayer;

var _util = require("../common/util");

var util = _interopRequireWildcard(_util);

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

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

function mouseoverRelevantPipeline(param) {
    var outputLines = util.findOutputLines(param.id);
    _.each(outputLines, function (line) {
        d3.select("#" + line.id).attr("stroke", function () {
            makeFrontLayer(this);
            return "#81D9EC";
        });
    });
}

function mouseoutRelevantPipeline(param) {
    var outputLines = util.findOutputLines(param.id);
    var tempLines = constant.linePathAry;
    if (constant.currentSelectedItem != null && constant.currentSelectedItem.type == "line") {
        var id = constant.currentSelectedItem.data.attr("id");
        var currentLineData = _.find(constant.linePathAry, function (line) {
            return id == line.id;
        });
        tempLines = _.without(outputLines, currentLineData);
    }

    _.each(tempLines, function (line) {
        d3.select("#" + line.id).attr("stroke", function () {
            makeBackLayer(this);
            return "#E6F3E9";
        });
    });
}

function makeFrontLayer(element) {
    element.parentNode.appendChild(element);
}

function makeBackLayer(element) {
    var firstChild = element.parentNode.firstChild;
    if (firstChild) {
        element.parentNode.insertBefore(element, firstChild);
    }
}