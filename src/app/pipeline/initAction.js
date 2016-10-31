"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animationForRemoveAction = animationForRemoveAction;
exports.initAction = initAction;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _util = require("../common/util");

var util = _interopRequireWildcard(_util);

var _drag = require("../common/drag");

var _lineHover = require("../relation/lineHover");

var _clickAction = require("../action/clickAction");

var _dragDropSetPath = require("../relation/dragDropSetPath");

var _main = require("./main");

var _initLine = require("./initLine");

var _initPipeline = require("./initPipeline");

var _addOrDeleteAction = require("../action/addOrDeleteAction");

var _initButton = require("./initButton");

var initButton = _interopRequireWildcard(_initButton);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function animationForRemoveAction(parentId, itemId, itemIndex) {
    var actionViewId = "action-" + parentId;
    /* make target action and reference items disappear */
    var target = "#" + itemId;
    var inputCircle = "#action-self-line-input-" + itemId;
    var outputCircle = "#action-self-line-output-" + itemId;
    var linkPath = "#action-self-line-path-" + itemId;
    var dispappearArray = [target, inputCircle, outputCircle, linkPath];
    var relatedLines = util.findAllRelatedLines(itemId);
    _.each(relatedLines, function (item) {
        var selector = "#" + item.id;
        dispappearArray.push(selector);
    });
    util.disappearAnimation(dispappearArray);

    /* make sibling actions and reference items transform  */
    var siblings = "#" + actionViewId + ">image";
    var siblingInputCircle = "#" + "action-self-line-" + parentId + " > .action-self-line-input";
    var siblingOutputCircle = "#" + "action-self-line-" + parentId + " > .action-self-line-output";
    var siblingLinkPath = "#" + "action-self-line-" + parentId + "> path";
    var transformArray = [{ "selector": siblings, "type": "siblings", "itemIndex": itemIndex }, { "selector": siblingInputCircle, "type": "others", "itemIndex": itemIndex }, { "selector": siblingOutputCircle, "type": "others", "itemIndex": itemIndex }, { "selector": siblingLinkPath, "type": "others", "itemIndex": itemIndex }];
    util.transformAnimation(transformArray, "action");
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

function initAction() {
    constant.actionsView.selectAll("g").remove();

    /* draw actions in actionView , data source is stage.actions */
    constant.pipelineView.selectAll("image").each(function (d, i) {
        if (d.type == constant.PIPELINE_STAGE && d.actions != null && d.actions.length > 0) {
            var actionViewId = "action" + "-" + d.id;

            constant.actionView[actionViewId] = constant.actionsView.append("g").attr("width", constant.svgWidth).attr("height", constant.svgHeight).attr("id", actionViewId);

            var actionStartX = d.translateX + (constant.svgStageWidth - constant.svgActionWidth) / 2;
            var actionStartY = d.translateY;

            constant.actionView[actionViewId].selectAll("image").data(d.actions).enter().append("image").attr("xlink:href", function (ad, ai) {
                if (constant.currentSelectedItem != null && constant.currentSelectedItem.type == "action" && constant.currentSelectedItem.data.id == ad.id) {
                    return "../../assets/svg/action-selected-latest.svg";
                } else {
                    return "../../assets/svg/action-latest.svg";
                }
            }).attr("id", function (ad, ai) {
                return ad.id;
            }).attr("data-index", function (ad, ai) {
                return ai;
            }).attr("data-parent", i).attr("width", function (ad, ai) {
                return constant.svgActionWidth;
            }).attr("height", function (ad, ai) {
                return constant.svgActionHeight;
            }).attr("translateX", actionStartX).attr("translateY", function (ad, ai) {
                /* draw difference distance between action and stage grouped by stage index */
                if (i % 2 == 0) {
                    ad.translateY = actionStartY + constant.svgStageHeight - 55 + constant.ActionNodeSpaceSize * (ai + 1);
                } else {
                    ad.translateY = actionStartY + constant.svgStageHeight - 10 + constant.ActionNodeSpaceSize * (ai + 1);
                }
                return ad.translateY;
            }).attr("transform", function (ad, ai) {
                ad.width = constant.svgActionWidth;
                ad.height = constant.svgActionHeight;
                if (i % 2 == 0) {
                    ad.translateX = actionStartX;
                    ad.translateY = actionStartY + constant.svgStageHeight - 55 + constant.ActionNodeSpaceSize * (ai + 1);
                } else {
                    ad.translateX = actionStartX;
                    ad.translateY = actionStartY + constant.svgStageHeight - 10 + constant.ActionNodeSpaceSize * (ai + 1);
                }

                return "translate(" + ad.translateX + "," + ad.translateY + ")";
            }).on("click", function (ad, ai) {
                (0, _clickAction.clickAction)(ad, ai);
                util.changeCurrentElement(constant.currentSelectedItem);
                constant.setCurrentSelectedItem({ "data": ad, "parentData": d, "type": "action" });
                initButton.updateButtonGroup("action");
                d3.select("#" + ad.id).attr("href", "../../assets/svg/action-selected-latest.svg");
                constant.pipelineView.selectAll("#pipeline-element-popup").remove();
            }).on("mouseout", function (ad, ai) {
                constant.pipelineView.selectAll("#pipeline-element-popup").remove();
            }).on("mouseover", function (ad, ai) {
                d3.select(this).style("cursor", "pointer");
                var x = ad.translateX;
                var y = ad.translateY + constant.svgActionHeight;
                initButton.showToolTip(x, y, "Click to Edit", "pipeline-element-popup", constant.pipelineView);
            });

            // .call(drag);
        }
    });

    (0, _initLine.initLine)();
}