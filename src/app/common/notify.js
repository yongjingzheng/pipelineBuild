"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.notify = notify;
exports.confirm = confirm;
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

function notify(msg, type, showtime) {
    Messenger().post({
        "message": msg,
        "type": type,
        /* success, error, info*/
        "showCloseButton": true,
        "hideAfter": showtime ? showtime : 3
    });
}

function confirm(msg, type, actions, showtime) {
    // actions is an array of {"name":"","label":"","action":function}
    var options = {
        "message": msg,
        "type": type,
        /* success, error, info*/
        "showCloseButton": true,
        "hideAfter": showtime ? showtime : 60,
        "actions": {}
    };

    _.each(actions, function (item) {
        var oneAction = {
            "label": item.label,
            "action": function action() {
                item.action();
                this.hide();
            }
        };
        options.actions[item.name] = oneAction;
    });

    Messenger().post(options);
}