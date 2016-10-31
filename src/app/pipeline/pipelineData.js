"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllPipelines = getAllPipelines;
exports.getPipeline = getPipeline;
exports.addPipeline = addPipeline;
exports.savePipeline = savePipeline;
exports.addPipelineVersion = addPipelineVersion;
exports.getEnvs = getEnvs;
exports.setEnvs = setEnvs;
exports.changeState = changeState;
exports.getToken = getToken;

var _api = require("../common/api");

var allPipelines = []; /* 
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

function getAllPipelines() {
    return _api.pipelineApi.list();
}

function getPipeline(name, versionid) {
    return _api.pipelineApi.data(name, versionid);
}

function addPipeline() {
    if (!$('#newpp-form').parsley().validate()) {
        return false;
    }
    var name = $("#pp-name").val();
    var version = $("#pp-version").val();

    return _api.pipelineApi.add(name, version);
}

function savePipeline(name, version, versionid, nodes, lines) {
    var reqbody = {
        "id": versionid,
        "version": version.toString(),
        "define": {
            "lineList": lines,
            "stageList": nodes
        }
    };

    return _api.pipelineApi.save(name, reqbody);
}

function addPipelineVersion(name, versionid, nodes, lines) {
    if (!$('#newpp-version-form').parsley().validate()) {
        return false;
    } else {
        var version = $("#pp-newversion").val();
        return savePipeline(name, version, versionid, nodes, lines);
    }
}

function getEnvs(name, versionid) {
    return _api.pipelineApi.getEnv(name, versionid);
}

function setEnvs(name, versionid, envs) {
    var reqbody = {
        "id": versionid,
        "env": _.object(envs)
    };

    return _api.pipelineApi.setEnv(name, reqbody);
}

function changeState(name, versionid, state) {
    var reqbody = {
        "id": versionid,
        "state": state
    };

    return _api.pipelineApi.changeState(name, reqbody);
}

function getToken(name, versionid) {
    return _api.pipelineApi.getToken(name, versionid);
}