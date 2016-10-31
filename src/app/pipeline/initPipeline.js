"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animationForRemoveStage = animationForRemoveStage;
exports.initPipeline = initPipeline;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _util = require("../common/util");

var util = _interopRequireWildcard(_util);

var _main = require("./main");

var _drag = require("../common/drag");

var _clickStart = require("../stage/clickStart");

var _addOrDeleteStage = require("../stage/addOrDeleteStage");

var _clickStage = require("../stage/clickStage");

var _initAction = require("./initAction");

var _lineHover = require("../relation/lineHover");

var _dragDropSetPath = require("../relation/dragDropSetPath");

var _addOrDeleteAction = require("../action/addOrDeleteAction");

var _tree = require("../relation/tree");

var _initButton = require("./initButton");

var initButton = _interopRequireWildcard(_initButton);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function animationForRemoveStage(itemId, itemIndex) {
    var target = "#" + itemId;
    var actions = "#action" + "-" + itemId + "> image";
    var actionReference = "#action-self-line-" + itemId;
    var dispappearArray = [target, actions, actionReference];
    util.disappearAnimation(dispappearArray);
    var siblings = "#pipelineView" + ">image";
    var transformArray = [{ "selector": siblings, "type": "siblings", "itemIndex": itemIndex }];
    util.transformAnimation(transformArray, "stage");
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

function initPipeline() {
    constant.pipelineView.selectAll("image").remove();
    constant.pipelineView.selectAll("image").data(_main.pipelineData).enter().append("image").attr("xlink:href", function (d, i) {
        if (constant.currentSelectedItem != null && constant.currentSelectedItem.type == "stage" && constant.currentSelectedItem.data.id == d.id) {
            if (d.type == constant.PIPELINE_START) {
                return "../../assets/svg/start-selected-latest.svg";
            } else if (d.type == constant.PIPELINE_ADD_STAGE) {
                return "../../assets/svg/add-stage-selected-latest.svg";
            } else if (d.type == constant.PIPELINE_END) {
                return "../../assets/svg/end-latest.svg";
            } else if (d.type == constant.PIPELINE_STAGE) {
                return "../../assets/svg/stage-selected-latest.svg";
            }
        } else {
            if (d.type == constant.PIPELINE_START) {
                return "../../assets/svg/start-latest.svg";
            } else if (d.type == constant.PIPELINE_ADD_STAGE) {
                return "../../assets/svg/add-stage-latest.svg";
            } else if (d.type == constant.PIPELINE_END) {
                return "../../assets/svg/end-latest.svg";
            } else if (d.type == constant.PIPELINE_STAGE) {
                return "../../assets/svg/stage-latest.svg";
            }
        }
    }).attr("id", function (d, i) {
        return d.id;
    }).attr("data-index", function (d, i) {
        return i;
    }).attr("width", function (d, i) {
        return constant.svgStageWidth;
    }).attr("height", function (d, i) {
        return constant.svgStageHeight;
    }).attr("transform", function (d, i) {
        d.width = constant.svgStageWidth;
        d.height = constant.svgStageHeight;
        d.translateX = i * constant.PipelineNodeSpaceSize + constant.pipelineNodeStartX;
        d.translateY = constant.pipelineNodeStartY;
        return "translate(" + d.translateX + "," + d.translateY + ")";
    }).attr("translateX", function (d, i) {
        return i * constant.PipelineNodeSpaceSize + constant.pipelineNodeStartX;
    }).attr("translateY", constant.pipelineNodeStartY).attr("class", function (d, i) {
        if (d.type == constant.PIPELINE_START) {
            return constant.PIPELINE_START;
        } else if (d.type == constant.PIPELINE_ADD_STAGE) {
            return constant.PIPELINE_ADD_STAGE;
        } else if (d.type == constant.PIPELINE_END) {
            return constant.PIPELINE_END;
        } else if (d.type == constant.PIPELINE_STAGE) {
            return constant.PIPELINE_STAGE;
        }
    }).on("click", function (d, i) {
        constant.pipelineView.selectAll("#pipeline-element-popup").remove();
        if (d.type == constant.PIPELINE_ADD_STAGE) {
            (0, _addOrDeleteStage.addStage)(d, i);
            initPipeline();
        } else if (d.type == constant.PIPELINE_STAGE) {
            (0, _clickStage.clickStage)(d, i);
            util.changeCurrentElement(constant.currentSelectedItem);
            constant.setCurrentSelectedItem({ "data": d, "type": "stage" });
            initButton.updateButtonGroup("stage");
            d3.select("#" + d.id).attr("href", "../../assets/svg/stage-selected-latest.svg");
        } else if (d.type == constant.PIPELINE_START) {
            (0, _clickStart.clickStart)(d, i);
            util.changeCurrentElement(constant.currentSelectedItem);
            constant.setCurrentSelectedItem({ "data": d, "type": "start" });
            initButton.updateButtonGroup("start");
            d3.select("#" + d.id).attr("href", "../../assets/svg/start-selected-latest.svg");
        }
    }).on("mouseout", function (d, i) {
        d3.event.stopPropagation();
        if (d.type == constant.PIPELINE_ADD_STAGE) {
            d3.select(this).attr("xlink:href", function (d, i) {
                return "../../assets/svg/add-stage-latest.svg";
            });
        }
        constant.pipelineView.selectAll("#pipeline-element-popup").remove();
    }).on("mouseover", function (d, i) {
        // console.log(d3.event.movementX);
        // console.log(d3.event.movementY);

        if (d.type == constant.PIPELINE_ADD_STAGE) {
            d3.select(this).attr("xlink:href", function (d, i) {
                return "../../assets/svg/add-stage-selected-latest.svg";
            }).style({
                "cursor": "pointer"
            });
            initButton.showToolTip(i * constant.PipelineNodeSpaceSize + constant.pipelineNodeStartX, constant.pipelineNodeStartY + constant.svgStageHeight, "Add Stage", "pipeline-element-popup", constant.pipelineView);
        } else if (d.type == constant.PIPELINE_STAGE || d.type == constant.PIPELINE_START) {
            d3.select(this).style("cursor", "pointer");
            initButton.showToolTip(i * constant.PipelineNodeSpaceSize + constant.pipelineNodeStartX, constant.pipelineNodeStartY + constant.svgStageHeight, "Click to Edit", "pipeline-element-popup", constant.pipelineView);
        }
    }).call(_drag.drag);

    (0, _initAction.initAction)();

    // var type = "string";
    // for (let i = 0; i < 4; i++) {
    //     if (i == 0) {
    //         type = "string";
    //     } else if (i == 1) {
    //         type = "object";
    //     } else if (i == 2) {
    //         type = "boolean";
    //     } else if (i == 3) {
    //         type = "number";
    //     }

    //     drawTreeNode(100 + (i + 1) * 50, 30 + (i + 1) * 35, "text" + i, type, 0.6);
    // }

}