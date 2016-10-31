"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getComponentEnvData = getComponentEnvData;
exports.setEnvKey = setEnvKey;
exports.setEnvValue = setEnvValue;
exports.removeEnv = removeEnv;
exports.addEnv = addEnv;
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

function getComponentEnvData(component) {
    if (!_.isUndefined(component.env) && !_.isEmpty(component.env)) {
        exports.data = data = component.env;
    } else {
        exports.data = data = [];
        component.env = data;
    }
}

function setEnvKey(event) {
    var index = $(event.currentTarget).parent().data("index");
    data[index].key = $(event.currentTarget).val();
}

function setEnvValue(event) {
    var index = $(event.currentTarget).parent().data("index");
    data[index].value = $(event.currentTarget).val();
}

function removeEnv(event) {
    var index = $(event.currentTarget).data("index");
    data.splice(index, 1);
}

function addEnv() {
    data.push({
        "key": "",
        "value": ""
    });
}