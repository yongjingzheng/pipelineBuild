"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initHistoryList = initHistoryList;

var _historyData = require("./historyData");

var historyDataService = _interopRequireWildcard(_historyData);

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _loading = require("../common/loading");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initHistoryList() {
    _loading.loading.show();
    var promise = historyDataService.sequenceList();
    promise.done(function (data) {
        _loading.loading.hide();
        constant.sequenceAllList = data.pipelineList;

        if (constant.sequenceAllList.length > 0) {
            getHistoryList(constant.sequenceAllList);
        } else {
            notify("Server is unreachable", "error");
        }
    });
    promise.fail(function (xhr, status, error) {
        _loading.loading.hide();
        if (xhr.responseJSON.errMsg) {
            notify(xhr.responseJSON.errMsg, "error");
        } else {
            notify("Server is unreachable", "error");
        }
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

function getHistoryList(pipelineData) {
    $.ajax({
        url: "../../templates/history/historyList.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#history-pipeline-list").html($(data));
            $("#historyPipelinelist").show();
            $(".pipelinelist_body").empty();

            var hppItem = $(".pipelinelist_body");

            _.each(pipelineData, function (pd) {
                var hpRow = "<tr data-id=\"pd" + pd.id + "\" class=\"pp-row\">\n                                <td class=\"pptd\">\n                                    <span class=\"glyphicon glyphicon-menu-down treeclose treecontroller\" data-name=" + pd.name + "></span>&nbsp;&nbsp;&nbsp;&nbsp;" + pd.id + pd.name + "</td><td></td><td></td>\n                                    <td data-btnId=\"pd" + pd.id + "\"><button type=\"button\" class=\"btn btn-success ppview\">\n                                    <i class=\"glyphicon glyphicon-list-alt\" style=\"font-size:16px\"></i>&nbsp;&nbsp;detail\n                                </button></td></tr>";
                hppItem.append(hpRow);

                _.each(pd.versionList, function (vd) {
                    var hvRow = "<tr data-id=\"vd" + vd.id + " data-pname=" + vd.name + " data-version=" + vd.id + " data-versionid=" + vd.id + " class=\"ppversion-row\">\n                                    <td></td>";

                    if (_.isUndefined(vd.status) && vd.sequenceList.length <= 0) {

                        hvRow += "<td class=\"pptd\">" + vd.name + "</td>\n                                    <td><div class=\"state-list\"><div class=\"state-icon-list state-norun\"></div></div></td><td></td>";

                        hppItem.append(hvRow);
                    } else {

                        hvRow += "<td class=\"pptd\"><span class=\"glyphicon glyphicon-menu-down treeclose treecontroller\" data-name=" + vd.name + "></span>&nbsp;&nbsp;&nbsp;&nbsp;" + vd.name + "</td>";

                        // version is close  
                        // if( isTreeOpen == false ){

                        //     if(vd.status == true){
                        //         hvRow += `<td><div class="state-list">
                        //                 <div class="state-icon-list state-success"></div>
                        //                 <span class="state-label-list">` + vd.time + `</span>
                        //             </div></td>`;
                        //     } else {
                        //         hvRow += `<td><div class="state-list">
                        //                 <div class="state-icon-list state-fail"></div>
                        //                 <span class="state-label-list">` + vd.time + `</span>
                        //             </div></td>`
                        //     }

                        // } else {

                        hvRow += "<td class=\"pptd\">" + vd.info + "</td>";

                        // }


                        hvRow += "<td data-btnId=\"vd" + vd.id + "\"><button type=\"button\" class=\"btn btn-success ppview\"><i class=\"glyphicon glyphicon-list-alt\" style=\"font-size:16px\"></i>&nbsp;&nbsp;detail</button></td></tr> ";

                        hppItem.append(hvRow);

                        if (vd.sequenceList.length > 0) {
                            _.each(vd.sequenceList, function (sd) {
                                var hsRow = "<tr data-id=\"sd" + sd.pipelineSequenceID + " class=\"ppversion-row\"><td></td><td></td>";

                                if (sd.status == true) {
                                    hsRow += "<td><div class=\"state-list\">\n                                            <div class=\"state-icon-list state-success\"></div>\n                                            <span class=\"state-label-list\">" + sd.time + "</span>\n                                        </div></td>";
                                } else {
                                    hsRow += "<td><div class=\"state-list\">\n                                            <div class=\"state-icon-list state-fail\"></div>\n                                            <span class=\"state-label-list\">" + sd.time + "</span>\n                                        </div></td>";
                                }

                                hsRow += "<td data-btnId=\"sd" + sd.pipelineSequenceID + "\"><button type=\"button\" class=\"btn btn-success ppview\"><i class=\"glyphicon glyphicon-list-alt\" style=\"font-size:16px\"></i>&nbsp;&nbsp;detail</button></td></tr> ";

                                hppItem.append(hsRow);
                            });
                        }
                    }
                });
            });
        }
    });
}