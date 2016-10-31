"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.newComponentData = undefined;
exports.getAllComponents = getAllComponents;
exports.getComponent = getComponent;
exports.addComponent = addComponent;
exports.addComponentVersion = addComponentVersion;
exports.saveComponent = saveComponent;
exports.validateComponent = validateComponent;

var _notify = require("../common/notify");

var _api = require("../common/api");

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

var allComponents = [];

function getAllComponents() {
    return _api.componentApi.list();
}

function getComponent(name, versionid) {
    return _api.componentApi.data(name, versionid);
}

function addComponent() {
    if (!$('#newcomponent-form').parsley().validate()) {
        return false;
    }
    var name = $("#c-name").val();
    var version = $("#c-version").val();

    return _api.componentApi.add(name, version);
}

function addComponentVersion(name, versionid, componentData) {
    if (!$('#newcomponent-version-form').parsley().validate()) {
        return false;
    } else {
        var version = $("#c-newversion").val();
        return saveComponent(name, version, versionid, componentData);
    }
}

function saveComponent(name, version, versionid, componentData) {
    var reqbody = {
        "id": versionid,
        "version": version.toString(),
        "define": componentData
    };

    return _api.componentApi.save(name, reqbody);
}

function validateComponent(componentData) {
    if (!$('#component-form').parsley().validate()) {
        (0, _notify.notify)("Missed some required base config.", "error");
        return false;
    } else if (!componentData.setupData.action.useAdvanced && !$('#base-setting-form').parsley().validate()) {
        (0, _notify.notify)("Missed some required base setting of kubernetes.", "error");
        return false;
    } else if (_.isEmpty(componentData.inputJson)) {
        (0, _notify.notify)("Component input json is empty.", "error");
        return false;
    } else if (_.isEmpty(componentData.outputJson)) {
        (0, _notify.notify)("Component output json is empty.", "error");
        return false;
    } else {
        return true;
    }
}

var newComponentData = exports.newComponentData = {
    "setupData": {},
    "inputJson": {},
    "outputJson": {},
    "env": {}
};