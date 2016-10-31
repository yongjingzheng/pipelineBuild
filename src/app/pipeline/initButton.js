"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buttonHorizonSpace = exports.background = exports.buttonVerticalSpace = exports.buttonHeight = exports.buttonWidth = undefined;
exports.initButton = initButton;
exports.updateButtonGroup = updateButtonGroup;
exports.showToolTip = showToolTip;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _initAction = require("./initAction");

var _addOrDeleteAction = require("../action/addOrDeleteAction");

var _main = require("./main");

var _initPipeline = require("./initPipeline");

var _addOrDeleteStage = require("../stage/addOrDeleteStage");

var _setPath = require("../relation/setPath");

var _initLine = require("./initLine");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var buttonWidth = exports.buttonWidth = 18,
    buttonHeight = exports.buttonHeight = 20,
    buttonVerticalSpace = exports.buttonVerticalSpace = 15,
    background = exports.background = "#555",
    buttonHorizonSpace = exports.buttonHorizonSpace = 25; /* 
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

function initButton() {
    constant.buttonView.append("rect").attr("width", constant.svgWidth).attr("height", 2 * buttonVerticalSpace + buttonHeight).style({
        "fill": "#84C1BC"
    });
}
function updateButtonGroup(currentItemType) {
    constant.buttonView.selectAll("image").remove();
    if (constant.currentSelectedItem != null) {
        if (currentItemType == "stage") {
            showOptBtn(1, "add");
            showOptBtn(2, "delete", currentItemType);
        } else if (currentItemType == "action") {
            showOptBtn(1, "delete", currentItemType);
        } else if (currentItemType == "line") {
            showOptBtn(1, "removeLink");
        } else {
            constant.buttonView.selectAll("image").remove();
        }
    }
}

function showToolTip(x, y, text, popupId, parentView) {
    parentView.append("g").attr("id", popupId);
    parentView.selectAll("#" + popupId).append("rect").attr("width", constant.popupWidth).attr("height", constant.popupHeight).attr("x", function (pd, pi) {
        return x;
    }).attr("y", function (pd, pi) {
        return y;
    }).attr("rx", 3).attr("ry", 3).style("fill", background).style("opacity", 0.9);
    parentView.selectAll("#" + popupId).append("text").attr("x", x + 10).attr("y", y + constant.popupHeight / 2 + 5).style("fill", "white").style("opacity", 0.9).text(text);
}

function showOptBtn(index, type) {
    constant.buttonView.append("image").attr("xlink:href", function (ad, ai) {
        if (type == "add") {
            return "../../assets/svg/add-action-latest.svg";
        } else if (type == "delete") {
            return "../../assets/svg/delete-latest.svg";
        } else if (type == "removeLink") {
            return "../../assets/svg/remove-link-latest.svg";
        }
    }).attr("translateX", function (d, i) {
        return index * buttonHorizonSpace + (index - 1) * buttonWidth;
    }).attr("translateY", function (d, i) {
        return buttonVerticalSpace;
    }).attr("transform", function (d, i) {
        var translateX = index * buttonHorizonSpace + (index - 1) * buttonWidth;
        var translateY = buttonVerticalSpace;
        return "translate(" + translateX + "," + translateY + ")";
    }).attr("id", function (d, i) {
        if (type == "add") {
            return "addActionBtn";
        } else if (type == "delete") {
            return "deleteBtn";
        } else if (type == "removeLink") {
            return "removeLinkBtn";
        }
    }).attr("width", buttonWidth).attr("height", buttonHeight).on("mouseover", function (d, i) {
        d3.select(this).style("cursor", "pointer");
        var content = "";
        var href = "";
        if (type == "add") {
            content = "Add Action";
            href = "../../assets/svg/add-action-selected-latest.svg";
        } else if (type == "delete") {
            content = "Delete";
            href = "../../assets/svg/delete-selected-latest.svg";
        } else if (type == "removeLink") {
            content = "Remove Link";
            href = "../../assets/svg/remove-link-selected-latest.svg";
        }
        d3.select(this).attr("href", href);
        showToolTip(index * buttonHorizonSpace + (index - 1) * buttonWidth, buttonVerticalSpace + buttonHeight, content, "button-element-popup", constant.buttonView);
    }).on("mouseout", function (d, i) {
        constant.buttonView.selectAll("#button-element-popup").remove();
        var href = "";
        if (type == "add") {
            href = "../../assets/svg/add-action-latest.svg";
        } else if (type == "delete") {
            href = "../../assets/svg/delete-latest.svg";
        } else if (type == "removeLink") {
            href = "../../assets/svg/remove-link-latest.svg";
        }
        d3.select(this).attr("href", href);
    }).on("click", function (d, i) {
        constant.buttonView.selectAll("#button-element-popup").remove();
        if (type == "add") {
            (0, _addOrDeleteAction.addAction)(constant.currentSelectedItem.data.actions);
            (0, _initAction.initAction)();
        } else if (type == "delete") {
            $("#pipeline-info-edit").html("");
            var timeout = 0;
            var index = d3.select("#" + constant.currentSelectedItem.data.id).attr("data-index");
            /* if remove the node is not the last one, add animation to action */
            if (constant.currentSelectedItem.type == "stage") {
                if (i < _main.pipelineData.length - 1) {
                    timeout = 400;
                    (0, _initPipeline.animationForRemoveStage)(constant.currentSelectedItem.data.id, index);
                }
                setTimeout(function () {
                    (0, _addOrDeleteStage.deleteStage)(constant.currentSelectedItem.data, index);
                    constant.setCurrentSelectedItem(null);
                    (0, _initPipeline.initPipeline)();
                }, timeout);
            } else if (constant.currentSelectedItem.type == "action") {
                $("#pipeline-info-edit").html("");
                var timeout = 0;
                // TODO
                var index = d3.select("#" + constant.currentSelectedItem.data.id).attr("data-index");
                var stageData = constant.currentSelectedItem.parentData;
                var actionData = constant.currentSelectedItem.data;
                /* if remove the node is not the last one, add animation to action */
                if (index < stageData.actions.length - 1) {
                    timeout = 400;
                    (0, _initAction.animationForRemoveAction)(stageData.id, actionData.id, index);
                }

                /* reload pipeline after the animation */
                setTimeout(function () {
                    (0, _addOrDeleteAction.deleteAction)(actionData, index);
                    constant.setCurrentSelectedItem(null);
                    (0, _initPipeline.initPipeline)();
                }, timeout);
            }
            constant.buttonView.selectAll("image").remove();
        } else if (type == "removeLink") {
            $("#pipeline-info-edit").html("");
            var id = constant.currentSelectedItem.data.attr("id");
            constant.currentSelectedItem.data.remove();
            var lineData = _.find(constant.linePathAry, function (item) {
                return item.id == id;
            });
            var index = _.indexOf(constant.linePathAry, lineData);
            constant.linePathAry.splice(index, 1);
            constant.buttonView.selectAll("image").remove();
            constant.setCurrentSelectedItem(null);
        }
    });
}