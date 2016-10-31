"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addAction = addAction;
exports.deleteAction = deleteAction;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _main = require("../pipeline/main");

var _util = require("../common/util");

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function addAction(actions) {
    actions.splice(actions.length, 0, {
        id: constant.PIPELINE_ACTION + "-" + uuid.v1(),
        type: constant.PIPELINE_ACTION,
        // parentIndex: i,
        // index: i,
        setupData: {}
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

function deleteAction(data, index) {
    // for (var key in pipelineData) {
    //     if (pipelineData[key].type == constant.PIPELINE_STAGE && pipelineData[key].actions.length > 0) {
    //         for (var actionKey in pipelineData[key].actions) {
    //             if (pipelineData[key].actions[actionKey].id == ad.id) {
    //                 pipelineData[key].actions.splice(actionKey, 1);

    //             }

    //         }
    //     }

    // }
    _.each(_main.pipelineData, function (stage) {
        if (stage.type == constant.PIPELINE_STAGE && stage.actions && stage.actions.length > 0) {
            _.each(stage.actions, function (action) {
                if (action.id == data.id) {
                    stage.actions = _.without(stage.actions, action);
                }
            });
        }
    });
    util.removeRelatedLines(data.id);
}