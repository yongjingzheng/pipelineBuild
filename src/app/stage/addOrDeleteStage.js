"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addStage = addStage;
exports.deleteStage = deleteStage;

var _main = require("../pipeline/main");

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _util = require("../common/util");

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function addStage(data, index) {
    _main.pipelineData.splice(_main.pipelineData.length - 2, 0, {
        id: constant.PIPELINE_STAGE + "-" + uuid.v1(),
        type: constant.PIPELINE_STAGE,
        class: constant.PIPELINE_STAGE,
        drawX: 0,
        drawY: 0,
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0,
        actions: [],
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

function deleteStage(data, index) {
    var relatedActions = util.findAllActionsOfStage(data.id);
    util.removeRelatedLines(relatedActions);
    _main.pipelineData.splice(index, 1);
}