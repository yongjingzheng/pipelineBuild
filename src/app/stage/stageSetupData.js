"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStageSetupData = getStageSetupData;
exports.setStageName = setStageName;
exports.setStageTimeout = setStageTimeout;
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

var data = exports.data = void 0;

function getStageSetupData(stage) {
    if (!_.isUndefined(stage.setupData) && !_.isEmpty(stage.setupData)) {
        exports.data = data = stage.setupData;
    } else {
        exports.data = data = $.extend(true, {}, metadata);
        stage.setupData = data;
    }
}

function setStageName() {
    data.name = $("#stage-name").val();
}

function setStageTimeout() {
    data.timeout = $("#stage-timeout").val();
}

// export function setStageEnv(){
//     data.env = $("#stage-env").val();
// }

// export function setStageCallbackUrl(){
//     data.callbackurl = $("#stage-callback-url").val();
// }


var metadata = {
    "name": "",
    "timeout": ""
};