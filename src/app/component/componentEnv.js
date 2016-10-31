"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initComponentEnv = initComponentEnv;

var _componentEnvData = require("./componentEnvData");

var componentEnvData = _interopRequireWildcard(_componentEnvData);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initComponentEnv(component) {
    componentEnvData.getComponentEnvData(component);

    showComponentEnvKVs();
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

function showComponentEnvKVs() {
    $("#component-envs").empty();
    _.each(componentEnvData.data, function (item, index) {
        var row = '<div class="port-row"><div class="port-div">' + '<div>' + '<label for="normal-field" class="col-sm-4 control-label">' + 'Key' + '</label>' + '<div class="col-sm-7" data-index="' + index + '">' + '<input type="text" value="' + item.key + '" class="form-control c-env-key" required>' + '</div>' + '</div>' + '</div>' + '<div class="target-port-div">' + '<div>' + '<label for="normal-field" class="col-sm-4 control-label">' + 'Value' + '</label>' + '<div class="col-sm-7" data-index="' + index + '">' + '<input type="text" class="form-control c-env-value" required>' + '</div>' + '</div>' + '</div>' + '<div class="port-remove-div c-rm-kv" data-index="' + index + '">' + '<span class="glyphicon glyphicon-remove"></span>' + '</div></div>';
        $("#component-envs").append(row);
        $("#component-envs").find("div[data-index=" + index + "]").find(".c-env-value").val(item.value);
    });

    var addrow = "<button type=\"button\" class=\"btn btn-success c-new-kv\">\n                        <i class=\"glyphicon glyphicon-plus\" style=\"top:1px\"></i>&nbsp;&nbsp;Add Env\n                    </button>";
    $("#component-envs").append(addrow);

    $(".c-new-kv").on('click', function () {
        componentEnvData.addEnv();
        showComponentEnvKVs();
    });

    $(".c-env-key").on('input', function (event) {
        var key = $(event.currentTarget).val();
        $(event.currentTarget).val(key.toUpperCase());
    });

    $(".c-env-key").on('blur', function (event) {
        componentEnvData.setEnvKey(event);
    });

    $(".c-env-value").on('blur', function (event) {
        componentEnvData.setEnvValue(event);
    });

    $(".c-rm-kv").on('click', function (event) {
        componentEnvData.removeEnv(event);
        showComponentEnvKVs();
    });
}