"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasConflict = hasConflict;
exports.getActionConflict = getActionConflict;
exports.cleanConflict = cleanConflict;

var _constant = require("../common/constant");

var _main = require("../pipeline/main");

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

function hasConflict(startActionID, endActionID) {
    var result = false;
    var receiveData = {};

    for (var i = 0; i < _constant.linePathAry.length; i++) {
        var lineInfo = _constant.linePathAry[i];
        if (lineInfo.endData.id == endActionID && lineInfo.startData.id == startActionID && lineInfo.relation) {
            for (var j = 0; j < lineInfo.relation.length; j++) {
                var currentRelation = lineInfo.relation[j];

                receiveData[currentRelation.to] = true;
            }
            break;
        }
    }

    for (var _i = 0; _i < _constant.linePathAry.length; _i++) {
        var _lineInfo = _constant.linePathAry[_i];
        if (_lineInfo.endData.id == endActionID && _lineInfo.startData.id != startActionID && _lineInfo.relation) {
            for (var _j = 0; _j < _lineInfo.relation.length; _j++) {
                var _currentRelation = _lineInfo.relation[_j];

                if (receiveData[_currentRelation.to]) {
                    result = true;
                    break;
                }
            }
        }
    }

    return result;
}

function getActionConflict(actionID) {
    var result = {};
    var conflicts = {};
    var actionReceiveData = {};

    for (var i = 0; i < _constant.linePathAry.length; i++) {
        var lineInfo = _constant.linePathAry[i];
        if (lineInfo.endData.id == actionID && lineInfo.relation) {

            actionReceiveData = setReceiveData(actionReceiveData, lineInfo.startData.id, lineInfo.relation);
        }
    }

    for (var p in actionReceiveData) {
        if (actionReceiveData[p].length > 1) {
            for (var _i2 = 0; _i2 < actionReceiveData[p].length; _i2++) {
                var fromPath = actionReceiveData[p][_i2];
                var fromActionId = fromPath.split(".")[0];
                var fromNodePath = fromPath.substring(fromPath.indexOf("."));
                var line = {};

                if (!result.line) {
                    result.line = [];
                }
                if (!conflicts[actionID]) {
                    conflicts[actionID] = {};
                }
                if (!conflicts[fromActionId]) {
                    conflicts[fromActionId] = {};
                }

                var fromAction = getAction(fromActionId);
                var toAction = getAction(actionID);

                var fromActionValue = void 0;
                if (fromAction.outputJson) {
                    fromActionValue = getObjValue(fromAction.outputJson, fromNodePath);
                } else {
                    fromActionValue = null;
                }

                var toActionValue = void 0;
                if (toAction.inputJson) {
                    toActionValue = getObjValue(toAction.inputJson, p);
                } else {
                    toActionValue = null;
                }

                conflicts[fromActionId] = setConflictPath(conflicts[fromActionId], fromNodePath, fromActionValue);
                conflicts[actionID] = setConflictPath(conflicts[actionID], p, toActionValue);

                line.fromData = fromPath;
                line.toData = actionID + p;
                result.line.push(line);
            }
        }
    }

    for (var _p in conflicts) {
        var node = {};
        var nodeConflicts = [];
        if (!result.node) {
            result.node = [];
        }

        for (var prop in conflicts[_p]) {
            var nodeConflict = {};
            nodeConflict[prop] = conflicts[_p][prop];

            nodeConflicts.push(nodeConflict);
        }

        var action = getAction(_p);
        var actionName = "";
        if (action.setupData.action.name) {
            actionName = action.setupData.action.name;
        }

        node.id = _p;
        node.name = actionName;
        node.conflicts = nodeConflicts;

        result.node.push(node);
    }

    return result;
}

function setReceiveData(actionReceiveData, actionId, relationList) {
    var allLeafNodes = [];
    for (var i = 0; i < relationList.length; i++) {
        var relation = relationList[i];
        var isLeafNode = true;

        for (var j = 0; j < relationList.length; j++) {
            if ((relationList[j].from + ".").indexOf(relation.from + ".") == 0 && relation.from != relationList[j].from) {
                isLeafNode = false;
                break;
            }
        }

        if (isLeafNode) {
            relation.finalPath = actionId + relation.from;
            allLeafNodes.push(relation);
        }
    }

    for (var _i3 = 0; _i3 < allLeafNodes.length; _i3++) {
        var currentRelation = allLeafNodes[_i3];

        if (!actionReceiveData[currentRelation.to]) {
            actionReceiveData[currentRelation.to] = [];
        }

        actionReceiveData[currentRelation.to].push(currentRelation.finalPath);
    }

    return actionReceiveData;
}

function cleanConflict(fromActionId, toActionId, path) {

    var formPath = "." + path;
    var actionId = fromActionId + "-" + toActionId;

    var line = _.find(_constant.linePathAry, function (obj) {
        return actionId == obj.id;
    });

    line.relation = delRelation(line.relation, formPath);
}

function setConflictPath(obj, path, info) {
    path = path.substring(1);
    var currentProp = path.split(".")[0];

    if (path.split(".").length > 1) {
        if (!obj[currentProp]) {
            obj[currentProp] = {};
        }
        obj[currentProp] = setConflictPath(obj[currentProp], path.substring(path.indexOf(".")), info);
    } else {
        if (!obj[currentProp]) {
            obj[currentProp] = info;
        }
    }

    return obj;
}

function delRelation(relation, fromPath) {
    var finalRelation = [];
    for (var i = 0; i < relation.length; i++) {
        var tempRelation = relation[i];

        if (tempRelation.from.indexOf(fromPath) == 0) {
            continue;
        }

        finalRelation = finalRelation.concat(tempRelation);
    }

    return finalRelation;
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

function getObjValue(obj, path) {
    path = path.substring(1);
    var value = void 0;
    var currentProp = path.split(".")[0];

    if (path.split(".").length > 1) {
        if (typeof obj[currentProp] == "undefined") {
            return null;
        }
        value = getObjValue(obj[currentProp], path.substring(path.indexOf(".")));
    } else {
        if (typeof obj[currentProp] == "undefined") {
            return null;
        }
        value = obj[currentProp];
    }

    return value;
}