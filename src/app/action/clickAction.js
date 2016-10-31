"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clickAction = clickAction;

var _constant = require("../common/constant");

var constant = _interopRequireWildcard(_constant);

var _initPipeline = require("../pipeline/initPipeline");

var _initAction = require("../pipeline/initAction");

var _initLine = require("../pipeline/initLine");

var _main = require("../pipeline/main");

var _widget = require("../theme/widget");

var _actionIO = require("./actionIO");

var _actionSetup = require("./actionSetup");

var _actionEnv = require("./actionEnv");

var _componentData = require("../component/componentData");

var _main2 = require("../component/main");

var _notify = require("../common/notify");

var _loading = require("../common/loading");

var _actionConflict = require("./actionConflict");

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

function clickAction(sd, si) {
    if (sd.component) {
        showActionEditor(sd);
    } else {
        $.ajax({
            url: "../../templates/action/actionMain.html",
            type: "GET",
            cache: false,
            success: function success(data) {
                $("#pipeline-info-edit").html($(data));
                $(".usecomponent").on('click', function () {
                    getComponents(sd);
                });
                (0, _widget.resizeWidget)();
            }
        });
    }
}

function showActionEditor(action) {
    $.ajax({
        url: "../../templates/action/actionEdit.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#pipeline-info-edit").html($(data));

            (0, _actionSetup.initActionSetup)(action);

            (0, _actionIO.initActionIO)(action);

            (0, _actionEnv.initActionEnv)(action);

            (0, _actionConflict.getConflict)(action.id);

            $("#uuid").attr("value", action.id);

            // view select init
            $("#action-component-select").select2({
                minimumResultsForSearch: Infinity
            });
            // $("#k8s-service-protocol").select2({
            //     minimumResultsForSearch: Infinity
            // });  
            (0, _widget.resizeWidget)();
        }
    });
}

var allComponents = void 0;

function getComponents(action) {
    _loading.loading.show();
    var promise = (0, _componentData.getAllComponents)();
    promise.done(function (data) {
        _loading.loading.hide();
        allComponents = data.list;
        showComponentList(action);
        if (allComponents.length == 0) {
            (0, _notify.notify)("You have no components to reuse, please go to 'Component' to create one.", "info");
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

function showComponentList(action) {
    $.ajax({
        url: "../../templates/action/actionComponentList.html",
        type: "GET",
        cache: false,
        success: function success(data) {
            $("#actionMain").html($(data));

            $(".newcomponent").on('click', function () {
                $(".menu-component").parent().addClass("active");
                $(".menu-pipeline").parent().removeClass("active");
                (0, _notify.notify)("Saving current pipeline automatically.", "info");
                (0, _main.savePipelineData)();
                (0, _main2.showNewComponent)(true);
            });

            $(".componentlist_body").empty();
            _.each(allComponents, function (item) {
                var pprow = "<tr class=\"pp-row\">\n                                <td class=\"pptd\">\n                                    <span class=\"glyphicon glyphicon-menu-down treeclose treecontroller\" data-name=" + item.name + "></span>&nbsp;&nbsp;&nbsp;&nbsp;" + item.name + "</td><td></td><td></td></tr>";
                $(".componentlist_body").append(pprow);
                _.each(item.version, function (version) {
                    var vrow = "<tr data-pname=" + item.name + " data-version=" + version.version + " data-versionid=" + version.id + " class=\"ppversion-row\">\n                                    <td></td>\n                                    <td class=\"pptd\">" + version.version + "</td>\n                                    <td>\n                                        <button type=\"button\" class=\"btn btn-success ppview cload\">\n                                            <i class=\"fa fa-copy\" style=\"font-size:16px\"></i>&nbsp;&nbsp;Load\n                                        </button>\n                                    </td>\n                                </tr>";
                    $(".componentlist_body").append(vrow);
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

            $(".cload").on("click", function (event) {
                var target = $(event.currentTarget);
                var componentName = target.parent().parent().data("pname");
                var componentVersionID = target.parent().parent().data("versionid");
                LoadComponentToAction(componentName, componentVersionID, action);
            });
        }
    });
}

function LoadComponentToAction(componentName, componentVersionID, action) {
    _loading.loading.show();
    var promise = (0, _componentData.getComponent)(componentName, componentVersionID);
    promise.done(function (data) {
        _loading.loading.hide();
        if (_.isEmpty(data.setupData)) {
            (0, _notify.notify)("Selected component lack base config, can not be loaded.", "error");
        } else if (_.isEmpty(data.inputJson)) {
            (0, _notify.notify)("Selected component lack input json, can not be loaded.", "error");
        } else if (_.isEmpty(data.outputJson)) {
            (0, _notify.notify)("Selected component lack output json, can not be loaded.", "error");
        } else {
            action.setupData = $.extend(true, {}, data.setupData);
            action.inputJson = $.extend(true, {}, data.inputJson);
            action.outputJson = $.extend(true, {}, data.outputJson);
            action.env = [].concat(data.env);
            action.component = {
                "name": componentName,
                "versionid": componentVersionID
            };
            showActionEditor(action);
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

function jsonChanged(root, json) {
    root.val(JSON.stringify(json));
}