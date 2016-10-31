"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initStartSetup = initStartSetup;

var _startSetupData = require("./startSetupData");

var startSetupData = _interopRequireWildcard(_startSetupData);

var _startIO = require("./startIO");

var _main = require("../pipeline/main");

var _notify = require("../common/notify");

var _loading = require("../common/loading");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initStartSetup(start) {
    showPipeline_URL_Token();

    startSetupData.getStartSetupData(start);
    (0, _startIO.initStartIO)(start);

    // type select
    $("#type-select").val(startSetupData.getTypeSelect());
    selectType(startSetupData.getTypeSelect());

    $("#type-select").on("change", function () {
        startSetupData.setTypeSelect();
        selectType(startSetupData.getTypeSelect());
    });

    $("#type-select").select2({
        minimumResultsForSearch: Infinity
    });

    // event select
    $("#event-select").on("change", function () {
        startSetupData.setEventSelect();
        (0, _startIO.getOutputForEvent)(startSetupData.getEventSelect());
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

function selectType(pipelineType) {
    if (pipelineType == "github" || pipelineType == "gitlab") {
        $("#event_select").show();
        $("#outputTreeViewer").show();
        $("#outputTreeDesigner").hide();

        $("#event-select").val(startSetupData.getEventSelect());
        $("#event-select").select2({
            minimumResultsForSearch: Infinity
        });
        (0, _startIO.getOutputForEvent)(startSetupData.getEventSelect());
    } else {
        $("#event_select").hide();
        $("#outputTreeViewer").hide();
        $("#outputTreeDesigner").show();

        (0, _startIO.initTreeEdit)();
        (0, _startIO.initFromEdit)("output");
    }
}

function showPipeline_URL_Token() {
    _loading.loading.show();
    var promise = (0, _main.getPipelineToken)();
    promise.done(function (data) {
        _loading.loading.hide();
        $("#pp-url").val(data.url);
        $("#pp-token").val(data.token);
    });
    promise.fail(function (xhr, status, error) {
        _loading.loading.hide();
        if (!_.isUndefined(xhr.responseJSON) && xhr.responseJSON.errMsg) {
            (0, _notify.notify)(xhr.responseJSON.errMsg, "error");
        } else {
            (0, _notify.notify)("Server is unreachable", "error");
        }
    });
}