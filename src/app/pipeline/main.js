"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pipelineData = exports.allPipelines = undefined;
exports.initPipelinePage = initPipelinePage;
exports.savePipelineData = savePipelineData;
exports.getPipelineToken = getPipelineToken;

var _initDesigner = require("./initDesigner");

var _initPipeline = require("./initPipeline");

var _initAction = require("./initAction");

var _pipelineData = require("./pipelineData");

var pipelineDataService = _interopRequireWildcard(_pipelineData);

var _notify = require("../common/notify");

var _loading = require("../common/loading");

var _constant = require("../common/constant");

var _check = require("../common/check");

var _initButton = require("./initButton");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var allPipelines = exports.allPipelines = void 0; /* 
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

var pipelineData = exports.pipelineData = void 0;
var pipelineName = void 0,
    pipelineVersion = void 0,
    pipelineVersionID = void 0;
var pipelineEnvs = void 0;

function initPipelinePage() {
    _loading.loading.show();
    var promise = pipelineDataService.getAllPipelines();
    promise.done(function (data) {
        _loading.loading.hide();
        exports.allPipelines = allPipelines = data.list;
        if (allPipelines.length > 0) {
            showPipelineList();
        } else {
            showNoPipeline();
        }
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

function showPipelineList() {
    $.ajax({
        url: "../../templates/pipeline/pipelineList.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#main").html($(data));
            $("#pipelinelist").show("slow");

            $(".newpipeline").on('click', function () {
                showNewPipeline();
            });

            $(".pipelinelist_body").empty();
            _.each(allPipelines, function (item) {
                var pprow = "<tr class=\"pp-row\">\n                                <td class=\"pptd\">\n                                    <span class=\"glyphicon glyphicon-menu-down treeclose treecontroller\" data-name=" + item.name + "></span>&nbsp;&nbsp;&nbsp;&nbsp;" + item.name + "</td><td></td><td></td><td></td></tr>";
                $(".pipelinelist_body").append(pprow);

                _.each(item.version, function (version) {
                    var vrow = "<tr data-pname=" + item.name + " data-version=" + version.version + " data-versionid=" + version.id + " class=\"ppversion-row\">\n                                    <td></td>\n                                    <td class=\"pptd\">" + version.version + "</td><td>";

                    if (_.isUndefined(version.status)) {
                        vrow += "<div class=\"state-list\">\n                                    <div class=\"state-icon-list state-norun\"></div>\n                                </div>";
                    } else if (version.status.status) {
                        vrow += "<div class=\"state-list\">\n                                    <div class=\"state-icon-list state-success\"></div>\n                                    <span class=\"state-label-list\">" + version.status.time + "</span>\n                                </div>";
                    } else {
                        vrow += "<div class=\"state-list\">\n                                    <div class=\"state-icon-list state-fail\"></div>\n                                    <span class=\"state-label-list\">" + version.status.time + "</span>\n                                </div>";
                    }

                    vrow += "</td><td>\n                                <button type=\"button\" class=\"btn btn-success ppview\">\n                                    <i class=\"glyphicon glyphicon-eye-open\" style=\"font-size:16px\"></i>&nbsp;&nbsp;View\n                                </button>\n                            </td></tr>";

                    $(".pipelinelist_body").append(vrow);
                });
            });

            $(".treecontroller").on("click", function (event) {
                var target = $(event.currentTarget);
                if (target.hasClass("treeclose")) {
                    target.removeClass("glyphicon-menu-down treeclose");
                    target.addClass("glyphicon-menu-right treeopen");

                    var name = target.data("name");
                    $('*[data-pname="' + name + '"]').hide();
                } else {
                    target.addClass("glyphicon-menu-down treeclose");
                    target.removeClass("glyphicon-menu-right treeopen");

                    var name = target.data("name");
                    $('*[data-pname="' + name + '"]').show();
                }
            });

            $(".ppview").on("click", function (event) {
                var target = $(event.currentTarget);
                pipelineName = target.parent().parent().data("pname");
                pipelineVersion = target.parent().parent().data("version");
                pipelineVersionID = target.parent().parent().data("versionid");
                getPipelineData();
            });
        }
    });
}

function getPipelineData() {
    (0, _constant.setCurrentSelectedItem)(null);
    _loading.loading.show();
    var promise = pipelineDataService.getPipeline(pipelineName, pipelineVersionID);
    promise.done(function (data) {
        _loading.loading.hide();
        exports.pipelineData = pipelineData = data.stageList;
        (0, _constant.setLinePathAry)(data.lineList);
        showPipelineDesigner(data.status);
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

function showNoPipeline() {
    $.ajax({
        url: "../../templates/pipeline/noPipeline.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#main").html($(data));
            $("#nopipeline").show("slow");
            $(".newpipeline").on('click', function () {
                showNewPipeline();
            });
        }
    });
}

function beforeShowNewPipeline() {
    var actions = [{
        "name": "save",
        "label": "Yes",
        "action": function action() {
            savePipelineData(showNewPipeline);
        }
    }, {
        "name": "show",
        "label": "No",
        "action": function action() {
            showNewPipeline();
        }
    }];
    (0, _notify.confirm)("The pipeline design may be modified, would you like to save the pipeline at first.", "info", actions);
}

function showNewPipeline() {
    $.ajax({
        url: "../../templates/pipeline/newPipeline.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#main").children().hide();
            $("#main").append($(data));
            $("#newpipeline").show("slow");
            $("#newppBtn").on('click', function () {
                var promise = pipelineDataService.addPipeline();
                if (promise) {
                    _loading.loading.show();
                    promise.done(function (data) {
                        _loading.loading.hide();
                        (0, _notify.notify)(data.message, "success");
                        initPipelinePage();
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
            });
            $("#cancelNewppBtn").on('click', function () {
                cancelNewPPPage();
            });
        }
    });
}

function showPipelineDesigner(state) {
    $.ajax({
        url: "../../templates/pipeline/pipelineDesign.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#main").html($(data));
            $("#pipelinedesign").show("slow");

            $("#selected_pipeline").text(pipelineName + " / " + pipelineVersion);

            if (state) {
                $(".pipeline-state").addClass("pipeline-on");
            } else {
                $(".pipeline-state").addClass("pipeline-off");
            }

            (0, _initDesigner.initDesigner)();
            drawPipeline();

            $(".backtolist").on('click', function () {
                beforeBackToList();
            });

            $(".pipeline-state").on('click', function (event) {
                if ($(event.currentTarget).hasClass("pipeline-off")) {
                    if (!(0, _check.pipelineCheck)(pipelineData)) {
                        (0, _notify.notify)("This pipeline does not pass the availability check, please make it available before ", "error");
                    } else {
                        beforeRunPipeline();
                    }
                } else if ($(event.currentTarget).hasClass("pipeline-on")) {
                    beforeStopPipeline();
                }
            });

            $(".checkpipeline").on('click', function () {
                (0, _check.pipelineCheck)(pipelineData);
            });

            $(".savepipeline").on('click', function () {
                savePipelineData();
            });

            $(".newpipelineversion").on('click', function () {
                showNewPipelineVersion();
            });

            $(".newpipelineindesigner").on('click', function () {
                beforeShowNewPipeline();
            });

            $(".envsetting").on("click", function (event) {
                showPipelineEnv();
            });
        }
    });
}

function drawPipeline() {
    $("#pipeline-info-edit").empty();
    (0, _initPipeline.initPipeline)();
    (0, _initButton.initButton)();
}

function savePipelineData(next) {
    _loading.loading.show();
    var promise = pipelineDataService.savePipeline(pipelineName, pipelineVersion, pipelineVersionID, pipelineData, _constant.linePathAry);
    promise.done(function (data) {
        _loading.loading.hide();
        if (!next) {
            (0, _notify.notify)(data.message, "success");
        } else {
            next();
        }
    });
    promise.fail(function (xhr, status, error) {
        _loading.loading.hide();
        if (!next) {
            if (!_.isUndefined(xhr.responseJSON) && xhr.responseJSON.errMsg) {
                (0, _notify.notify)(xhr.responseJSON.errMsg, "error");
            } else {
                (0, _notify.notify)("Server is unreachable", "error");
            }
        } else {
            next();
        }
    });
}

function showNewPipelineVersion() {
    $.ajax({
        url: "../../templates/pipeline/newPipelineVersion.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#main").children().hide();
            $("#main").append($(data));
            $("#newpipelineversion").show("slow");

            $("#pp-name-newversion").val(pipelineName);

            $("#newppVersionBtn").on('click', function () {
                var promise = pipelineDataService.addPipelineVersion(pipelineName, pipelineVersionID, pipelineData, _constant.linePathAry);
                if (promise) {
                    _loading.loading.show();
                    promise.done(function (data) {
                        _loading.loading.hide();
                        (0, _notify.notify)(data.message, "success");
                        initPipelinePage();
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
            });
            $("#cancelNewppVersionBtn").on('click', function () {
                cancelNewPPVersionPage();
            });
        }
    });

    $("#content").hide();
    $("#nopipeline").hide();
    $("#newpipeline").hide();
    $("#newpipelineversion").show("slow");
}

function cancelNewPPPage() {
    $("#newpipeline").remove();
    $("#main").children().show("slow");
}

function cancelNewPPVersionPage() {
    $("#newpipelineversion").remove();
    $("#main").children().show("slow");
}

function showPipelineEnv() {
    if ($("#env-setting").hasClass("env-setting-closed")) {
        $("#env-setting").removeClass("env-setting-closed");
        $("#env-setting").addClass("env-setting-opened");

        $.ajax({
            url: "../../templates/pipeline/envSetting.html",
            type: "GET",
            cache: false,
            success: function success(data) {
                $("#env-setting").html($(data));

                $(".new-kv").on('click', function () {
                    pipelineEnvs.push(["", ""]);
                    showEnvKVs();
                });

                $(".close-env").on('click', function () {
                    hidePipelineEnv();
                });

                $(".save-env").on('click', function () {
                    savePipelineEnvs();
                });

                getEnvList();
            }
        });
    } else {
        $("#env-setting").removeClass("env-setting-opened");
        $("#env-setting").addClass("env-setting-closed");
    }
}

function hidePipelineEnv() {
    $("#env-setting").removeClass("env-setting-opened");
    $("#env-setting").addClass("env-setting-closed");
}

function getEnvList() {
    _loading.loading.show();
    var promise = pipelineDataService.getEnvs(pipelineName, pipelineVersionID);
    promise.done(function (data) {
        _loading.loading.hide();
        pipelineEnvs = _.pairs(data.env);
        showEnvKVs();
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

function showEnvKVs() {
    $("#envs").empty();
    _.each(pipelineEnvs, function (item, index) {
        var row = '<tr data-index="' + index + '"><td>' + '<input type="text" class="form-control col-md-5 env-key" value="' + item[0] + '" required>' + '</td><td>' + '<input type="text" class="form-control col-md-5 env-value" required>' + '</td><td>' + '<span class="glyphicon glyphicon-minus rm-kv"></span>' + '</td></tr>';
        $("#envs").append(row);
        $("#envs").find("tr[data-index=" + index + "]").find(".env-value").val(item[1]);
    });

    $(".env-key").on('input', function (event) {
        var key = $(event.currentTarget).val();
        $(event.currentTarget).val(key.toUpperCase());
    });

    $(".env-key").on('blur', function (event) {
        var index = $(event.currentTarget).parent().parent().data("index");
        pipelineEnvs[index][0] = $(event.currentTarget).val();
    });

    $(".env-value").on('blur', function (event) {
        var index = $(event.currentTarget).parent().parent().data("index");
        pipelineEnvs[index][1] = $(event.currentTarget).val();
    });

    $(".rm-kv").on('click', function (event) {
        var index = $(event.currentTarget).parent().parent().data("index");
        pipelineEnvs.splice(index, 1);
        showEnvKVs();
    });
}

function savePipelineEnvs() {
    var promise = pipelineDataService.setEnvs(pipelineName, pipelineVersionID, pipelineEnvs);
    if (promise) {
        _loading.loading.show();
        promise.done(function (data) {
            _loading.loading.hide();
            (0, _notify.notify)(data.message, "success");
            hidePipelineEnv();
        });
        promise.fail(function (xhr, status, error) {
            _loading.loading.hide();
            if (!_.isUndefined(xhr.responseJSON) && xhr.responseJSON.errMsg) {
                (0, _notify.notify)(xhr.responseJSON.errMsg, "error");
            } else {
                (0, _notify.notify)("Server is unreachable", "error");
            }
            hidePipelineEnv();
        });
    }
}

// run pipeline
function beforeRunPipeline() {
    var actions = [{
        "name": "saveAndRun",
        "label": "Yes, save it first.",
        "action": function action() {
            savePipelineData(runPipeline);
        }
    }, {
        "name": "run",
        "label": "No, just run it.",
        "action": function action() {
            runPipeline();
        }
    }];
    (0, _notify.confirm)("The pipeline design may be modified, would you like to save the pipeline before run it.", "info", actions);
}

function runPipeline() {
    _loading.loading.show();
    var promise = pipelineDataService.changeState(pipelineName, pipelineVersionID, 1);
    promise.done(function (data) {
        _loading.loading.hide();
        (0, _notify.notify)(data.message, "success");
        $(".pipeline-state").removeClass("pipeline-off").addClass("pipeline-on");
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

//stop pipeline
function beforeStopPipeline() {
    var actions = [{
        "name": "saveAndStop",
        "label": "Yes, save it first.",
        "action": function action() {
            savePipelineData(stopPipeline);
        }
    }, {
        "name": "stop",
        "label": "No, just stop it.",
        "action": function action() {
            stopPipeline();
        }
    }];
    (0, _notify.confirm)("The pipeline design may be modified, would you like to save the pipeline before stop it.", "info", actions);
}

function stopPipeline() {
    _loading.loading.show();
    var promise = pipelineDataService.changeState(pipelineName, pipelineVersionID, 0);
    promise.done(function (data) {
        _loading.loading.hide();
        (0, _notify.notify)(data.message, "success");
        $(".pipeline-state").removeClass("pipeline-on").addClass("pipeline-off");
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

function beforeBackToList() {
    var actions = [{
        "name": "save",
        "label": "Yes",
        "action": function action() {
            savePipelineData(initPipelinePage);
        }
    }, {
        "name": "back",
        "label": "No",
        "action": function action() {
            initPipelinePage();
        }
    }];
    (0, _notify.confirm)("The pipeline design may be modified, would you like to save the pipeline before go back to list.", "info", actions);
}

function getPipelineToken() {
    return pipelineDataService.getToken(pipelineName, pipelineVersionID);
}
// $("#pipeline-select").on('change',function(){
//     showVersionList();
// })
// $("#version-select").on('change',function(){
//     showPipeline();
// })

// function showPipelineList(){
//     $("#pipeline-select").empty();
//     d3.select("#pipeline-select")
//         .selectAll("option")
//         .data(allPipelines)
//         .enter()
//         .append("option")
//         .attr("value",function(d,i){
//             return d.name;
//         })
//         .text(function(d,i){
//             return d.name;
//         }); 
//      $("#pipeline-select").select2({
//        minimumResultsForSearch: Infinity
//      });   
//     showVersionList();
// }

// function showVersionList(){
//     var pipeline = $("#pipeline-select").val();
//     var versions = _.find(allPipelines,function(item){
//         return item.name == pipeline;
//     }).versions;

//     $("#version-select").empty();
//     d3.select("#version-select")
//         .selectAll("option")
//         .data(versions)
//         .enter()
//         .append("option")
//         .attr("value",function(d,i){
//             return d.version;
//         })
//         .text(function(d,i){
//             return d.version;
//         }); 
//     $("#version-select").select2({
//        minimumResultsForSearch: Infinity
//      });

//     versions_shown = versions;

//     showPipeline(); 
// }