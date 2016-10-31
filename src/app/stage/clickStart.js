"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clickStart = clickStart;

var _widget = require("../theme/widget");

var _startSetup = require("./startSetup");

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

var pipelineType = void 0,
    selectedEvent = void 0;
function clickStart(sd, si) {
    //show git form
    $.ajax({
        url: "../../templates/stage/startEdit.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#pipeline-info-edit").html($(data));

            (0, _startSetup.initStartSetup)(sd);

            // $("#uuid").attr("value", sd.id);

            (0, _widget.resizeWidget)();
        }
    });
}