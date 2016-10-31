"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clickStage = clickStage;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _initPipeline = require("../pipeline/initPipeline");

var _initAction = require("../pipeline/initAction");

var _main = require("../pipeline/main");

var _widget = require("../theme/widget");

var _stageSetup = require("./stageSetup");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function clickStage(sd, si) {
    //show stage form
    $.ajax({
        url: "../../templates/stage/stageEdit.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#pipeline-info-edit").html($(data));

            (0, _stageSetup.initStageSetup)(sd);

            $("#uuid").attr("value", sd.id);

            (0, _widget.resizeWidget)();
        }
    });
}