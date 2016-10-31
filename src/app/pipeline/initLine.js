"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initLine = initLine;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _setPath = require("../relation/setPath");

var _drag = require("../common/drag");

var _lineHover = require("../relation/lineHover");

var _dragDropSetPath = require("../relation/dragDropSetPath");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initLine() {

    constant.linesView.selectAll("g").remove();

    var diagonal = d3.svg.diagonal();

    var pipelineLineViewId = "pipeline-line-view";

    constant.lineView[pipelineLineViewId] = constant.linesView.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", pipelineLineViewId);

    constant.pipelineView.selectAll("image").each(function (d, i) {

        /* draw the main line of pipeline */
        if (i != 0) {
            constant.lineView[pipelineLineViewId].append("path").attr("d", function () {
                return diagonal({
                    source: { x: d.translateX - constant.PipelineNodeSpaceSize, y: constant.pipelineNodeStartY + constant.svgStageHeight / 2 },
                    target: { x: d.translateX + 2, y: constant.pipelineNodeStartY + constant.svgStageHeight / 2 }
                });
            }).attr("fill", "none").attr("stroke", "#1F6D84").attr("stroke-width", 2);
        }
        if (d.type == constant.PIPELINE_START) {
            /* draw the vertical line and circle for start node  in lineView -> pipeline-line-view */
            constant.lineView[pipelineLineViewId].append("path").attr("d", function () {
                return diagonal({
                    source: { x: d.translateX + constant.svgStageWidth / 2, y: constant.pipelineNodeStartY + constant.svgStageHeight / 2 },
                    target: { x: d.translateX + constant.svgStageWidth / 2, y: constant.pipelineNodeStartY + constant.svgStageHeight + 10 }
                });
            }).attr("fill", "none").attr("stroke", "#1F6D84").attr("stroke-width", 1);
            constant.lineView[pipelineLineViewId].append("circle").attr("cx", function (cd, ci) {
                return d.translateX + constant.svgStageWidth / 2;
            }).attr("cy", function (cd, ci) {
                return constant.pipelineNodeStartY + constant.svgStageHeight + 19;
            }).attr("r", function (cd, ci) {
                return 8;
            }).attr("fill", "#fff").attr("stroke", "#1F6D84").attr("stroke-width", 2).style("cursor", "pointer")
            /* mouse over the circle show relevant lines of start stage */
            .on("mouseover", function (cd, ci) {
                (0, _lineHover.mouseoverRelevantPipeline)(d);
            })
            /* mouse over the circle to draw line from start stage */
            .on("mousedown", function (cd, ci) {
                // this.parentNode.appendChild(this); 
                d3.event.stopPropagation();
                (0, _dragDropSetPath.dragDropSetPath)({
                    "data": d,
                    "node": i
                });
            }).on("mouseout", function (cd, ci) {
                (0, _lineHover.mouseoutRelevantPipeline)(d);
            });
        }
        /* draw line from action 2 stage and circle of action self to accept and emit lines  */
        if (d.type == constant.PIPELINE_STAGE && d.actions != null && d.actions.length > 0) {

            var actionLineViewId = "action-line" + "-" + d.id;
            var action2StageLineViewId = "action-2-stage-line" + "-" + d.id;
            var actionSelfLine = "action-self-line" + "-" + d.id;
            /* Action 2 Stage */
            constant.lineView[action2StageLineViewId] = constant.linesView.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", action2StageLineViewId);

            constant.lineView[action2StageLineViewId].selectAll("path").data(d.actions).enter().append("path").attr("d", function (ad, ai) {
                /* draw the tail line of action */
                constant.lineView[action2StageLineViewId].append("path").attr("d", function (fd, fi) {
                    return diagonal({
                        source: { x: ad.translateX + constant.svgActionWidth / 2, y: ad.translateY + constant.svgActionHeight },
                        target: { x: ad.translateX + constant.svgActionWidth / 2, y: ad.translateY + constant.svgActionHeight + 8 }
                    });
                }).attr("fill", "none").attr("stroke", "#1F6D84").attr("stroke-width", 1).attr("stroke-dasharray", "2,2");
                /* draw different length line group by stage index */
                if (i % 2 == 0) {
                    return diagonal({
                        source: { x: ad.translateX + constant.svgActionWidth / 2, y: ad.translateY },
                        target: { x: ad.translateX + constant.svgActionWidth / 2, y: ad.translateY - 44 }
                    });
                } else {
                    return diagonal({
                        source: { x: ad.translateX + constant.svgActionWidth / 2, y: ad.translateY },
                        target: { x: ad.translateX + constant.svgActionWidth / 2, y: ad.translateY - 68 }
                    });
                }
            }).attr("fill", "none").attr("stroke", "#1F6D84").attr("stroke-width", 1).attr("stroke-dasharray", "2,2");

            /* line across action to connect two circles */
            constant.lineView[actionSelfLine] = constant.linesView.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", actionSelfLine);

            constant.lineView[actionSelfLine].selectAll("path").data(d.actions).enter().append("path").attr("d", function (ad, ai) {
                return diagonal({
                    source: { x: ad.translateX - 8, y: ad.translateY + constant.svgActionHeight / 2 },
                    target: { x: ad.translateX + constant.svgActionWidth + 8, y: ad.translateY + constant.svgActionHeight / 2 }
                });
            }).attr("id", function (ad, ai) {
                return "action-self-line-path-" + ad.id;
            }).attr("fill", "none").attr("stroke", "#1F6D84").attr("stroke-width", 1);

            /* circle on the left */
            constant.lineView[actionSelfLine].selectAll(".action-self-line-input").data(d.actions).enter().append("circle").attr("class", "action-self-line-input").attr("cx", function (ad, ai) {
                return ad.translateX - 16;
            }).attr("cy", function (ad, ai) {
                return ad.translateY + constant.svgActionHeight / 2;
            }).attr("r", function (ad, ai) {
                return 8;
            }).attr("id", function (ad, ai) {
                return "action-self-line-input-" + ad.id;
            }).attr("fill", "#fff").attr("stroke", "#84C1BC").attr("stroke-width", 2).style("cursor", "pointer")
            /* mouse down to drag lines */
            // .on("mousedown", function(ad, ai) {
            //     d3.event.stopPropagation();
            //     dragDropSetPath({
            //         "data": ad,
            //         "node": ai
            //     });
            // })
            .on("mouseover", function (ad, ai) {
                d3.select(this).attr("r", 16);
            }).on("mouseout", function (ad, ai) {
                d3.select(this).attr("r", 8);
            });

            /* circle on the right */
            constant.lineView[actionSelfLine].selectAll(".action-self-line-output").data(d.actions).enter().append("circle").attr("class", "action-self-line-output").attr("cx", function (ad, ai) {
                return ad.translateX + constant.svgActionWidth + 16;
            }).attr("cy", function (ad, ai) {
                return ad.translateY + constant.svgActionHeight / 2;
            }).attr("r", function (ad, ai) {
                return 8;
            }).attr("id", function (ad, ai) {
                return "action-self-line-output-" + ad.id;
            }).attr("fill", "#fff").attr("stroke", "#84C1BC").attr("stroke-width", 2).style("cursor", "pointer").on("mouseover", function (ad, ai) {
                (0, _lineHover.mouseoverRelevantPipeline)(ad);
            }).on("mousedown", function (ad, ai) {
                d3.event.stopPropagation();
                (0, _dragDropSetPath.dragDropSetPath)({
                    "data": ad,
                    "node": ai
                });
            }).on("mouseout", function (ad, ai) {
                (0, _lineHover.mouseoutRelevantPipeline)(ad);
            });
        }
    });

    constant.linePathAry.forEach(function (i) {
        (0, _setPath.setPath)(i);
    });
} /* 
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