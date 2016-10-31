"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initDesigner = initDesigner;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _initButton = require("./initButton");

var initButton = _interopRequireWildcard(_initButton);

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

var linesView = void 0,
    actionsView = void 0,
    pipelineView = void 0,
    buttonView = void 0;

function initDesigner() {
    var $div = $("#div-d3-main-svg").height($("main").height() * 2 / 3);
    var zoom = d3.behavior.zoom().on("zoom", zoomed);

    constant.setSvgWidth("100%");
    constant.setSvgHeight($div.height());
    constant.setPipelineNodeStartX(50);
    constant.setPipelineNodeStartY(($div.height() + 2 * initButton.buttonVerticalSpace + initButton.buttonHeight) * 0.2);

    $div.empty();

    var svg = d3.select("#div-d3-main-svg").on("touchstart", nozoom).on("touchmove", nozoom).append("svg").attr("width", constant.svgWidth).attr("height", constant.svgHeight).style("fill", "white");

    var g = svg.append("g").call(zoom).on("dblclick.zoom", null);

    var svgMainRect = g.append("rect").attr("width", constant.svgWidth).attr("height", constant.svgHeight).on("click", clicked);

    linesView = g.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", "linesView");

    actionsView = g.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", "actionsView");

    pipelineView = g.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", "pipelineView");

    buttonView = g.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", "buttonView");

    var actionLinkView = g.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", "actionLinkView");

    constant.setSvg(svg);
    constant.setG(g);
    constant.setSvgMainRect(svgMainRect);
    constant.setLinesView(linesView);
    constant.setActionsView(actionsView);
    constant.setPipelineView(pipelineView);
    constant.setButtonView(buttonView);
}

function clicked(d, i) {
    // constant.buttonView.selectAll("image").remove();
    if (d3.event.defaultPrevented) return; // zoomed
    d3.select(this).transition().transition();
}

function zoomed() {
    pipelineView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    actionsView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    // buttonView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    linesView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")").attr("translateX", d3.event.translate[0]).attr("translateY", d3.event.translate[1]).attr("scale", d3.event.scale);
}

function nozoom() {
    d3.event.preventDefault();
}