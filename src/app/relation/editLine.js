"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.lineOutputJSON = exports.lineInputJSON = undefined;
exports.editLine = editLine;

var _jquery = require("../../vendor/jquery.jsoneditor");

var _bipatiteView = require("./bipatiteView");

var _widget = require("../theme/widget");

var _main = require("../pipeline/main");

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var lineInputJSON = exports.lineInputJSON = {}; /* 
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

var lineOutputJSON = exports.lineOutputJSON = {};

function editLine(editPage, currentLine) {
    var id = currentLine.attr("id");
    $("#pipeline-info-edit").html($(editPage));

    $("#importDiv").html("");
    $("#outputDiv").html("");
    var currentLineData = _.find(constant.linePathAry, function (line) {
        return id == line.id;
    });

    exports.lineInputJSON = lineInputJSON = currentLineData.startData.outputJson;
    exports.lineOutputJSON = lineOutputJSON = currentLineData.endData.inputJson;
    if (_.isEmpty(lineInputJSON)) {
        $("#importDiv").html("no data");
    }
    if (_.isEmpty(lineOutputJSON)) {
        $("#outputDiv").html("no data");
    }

    (0, _bipatiteView.bipatiteView)(lineInputJSON, lineOutputJSON, currentLineData);

    $("#refreshRelation").click(function () {

        currentLineData = _.find(constant.linePathAry, function (line) {
            return id == line.id;
        });

        if (currentLineData.startData.id == "start-stage") {
            currentLineData.startData = _main.pipelineData[0];
        } else {
            currentLineData.startData = getAction(currentLineData.startData.id);
        }

        currentLineData.endData = getAction(currentLineData.endData.id);
        exports.lineInputJSON = lineInputJSON = currentLineData.startData.outputJson;
        exports.lineOutputJSON = lineOutputJSON = currentLineData.endData.inputJson;
        currentLineData.relation = undefined;
        (0, _bipatiteView.bipatiteView)(lineInputJSON, lineOutputJSON, currentLineData);
    });

    (0, _widget.resizeWidget)();
}

function getAction(actionId) {
    for (var i = 0; i < _main.pipelineData.length; i++) {
        var stage = _main.pipelineData[i];
        if (stage.actions) {
            for (var j = 0; j < stage.actions.length; j++) {
                var action = stage.actions[j];
                if (action.id == actionId) {
                    return action;
                }
            }
        }
    }

    return "";
}