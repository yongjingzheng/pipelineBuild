"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStartSetupData = getStartSetupData;
exports.setTypeSelect = setTypeSelect;
exports.getTypeSelect = getTypeSelect;
exports.setEventSelect = setEventSelect;
exports.getEventSelect = getEventSelect;
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

function getStartSetupData(start) {
    if (!_.isUndefined(start.setupData) && !_.isEmpty(start.setupData)) {
        exports.data = data = start.setupData;
    } else {
        exports.data = data = $.extend(true, {}, metadata);
        start.setupData = data;
    }
}

function setTypeSelect() {
    data.type = $("#type-select").val();
}

function getTypeSelect() {
    return data.type;
}

function setEventSelect() {
    data.event = $("#event-select").val();
}

function getEventSelect() {
    return data.event;
}

var metadata = {
    "type": "github",
    "event": "PullRequest"
};