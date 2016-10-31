"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initStageSetup = initStageSetup;

var _stageSetupData = require("./stageSetupData");

var stageSetupData = _interopRequireWildcard(_stageSetupData);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initStageSetup(stage) {
    stageSetupData.getStageSetupData(stage);

    $("#stage-name").val(stageSetupData.data.name);
    $("#stage-name").on("blur", function () {
        stageSetupData.setStageName();
    });

    $("#stage-timeout").val(stageSetupData.data.timeout);
    $("#stage-timeout").on("blur", function () {
        stageSetupData.setStageTimeout();
    });

    // $("#stage-env").val(stageSetupData.data.env);
    // $("#stage-env").on("blur",function(){
    //     stageSetupData.setStageEnv();
    // });

    // $("#stage-callback-url").val(stageSetupData.data.callbackurl);
    // $("#stage-callback-url").on("blur",function(){
    //     stageSetupData.setStageCallbackUrl();
    // });
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