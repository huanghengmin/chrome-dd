var myRobot, chats, call, userSNs/*, mmsUtil*/;
var appElement = document.querySelector('[ng-app="starter"]');
chats = angular.element(appElement).scope().$$childHead.chats;
call = angular.element(document.body).injector().get('SockUtilService');
userSNs = new Array();
// mmsUtil = angular.element(document.body).injector().get('mmsUtil');
start_close_robot();

function refresh() {
    window.location.reload();
}

function refresh_interval() {
    setInterval(function(){
        refresh();
    },1000*2);
}

function mark_nickname(avatar, un_reply_color) {
    var img = $(".item-content img[src='" + avatar + "']");
    $(img).parent(".item-content").find("h2").css("color", un_reply_color);
}

function start_close_robot() {
    layui.use('layer', function () {
        layui.layer.msg('逆战自动回复加载成功', {icon: 1})
    });
    myRobot = self.setInterval(function () {//扫描间隔

            if (switch_btns[0] || switch_btns[1] || switch_btns[2] || switch_btns[3]) {//有启用回复
                for (var int = 0; int < chats.length; int++) {//遍历
                    // if (chats[int].waiting_minutes >= 0) {//等待时间大于0,代表未回复内容
                    //     chats[int].waiting_minutes = -1;//清空等待时间，没回复会一直加
                    //已修改
                    // if (chats[int].waiting_minutes != null) {
                    //     chats[int].waiting_minutes = null;
                    //会重复回复
                    var waiting_minutes = chats[int].waiting_minutes;
                    if (typeof waiting_minutes != "undefined"&&waiting_minutes!=null&&waiting_minutes!=''&&waiting_minutes!=-1&&waiting_minutes.length>2) {//未回复
                        chats[int].waiting_minutes = -1;//清空等待时间，没回复会一直加

                        var usersn = chats[int].userinfo.usersn;
                        var avatar = chats[int].userinfo.avatar;
                        var msg = chats[int].userinfo.last_message;//消息内容

                        var status = localStorage["status"];//状态
                        var lrkj_serverIp = localStorage["DUODUO_SERVER"];//状态
                        var user_name = localStorage["user_name"];//状态

                        if (lrkj_serverIp != "https://139.199.184.35") {
                            // if(lrkj_serverIp!="http://localhost:8181"){
                            var msg = "温馨提示:谨慎使用。请联系⑴⑸⑴0⑦⑧④⑦";
                            call.sendMsg(usersn, msg, 0, 0); //回复消息
                            return;
                        }

                        if (typeof user_name == "undefined" || user_name == '') {
                            return;
                        }

                        if (typeof status == "undefined" || status == '' || status == "1") {
                            return;
                        }

                        if (status != '1') {//账号可用
                            var once_msg = once_reply_send(usersn);//第一次来询问
                            if (once_msg != null) {
                                call.sendMsg(usersn, once_msg, 0, 0); //回复消息
                            }
                            var three_send = three_reply_send(usersn, msg, avatar);//颜色标记回复
                            if (!three_send) { //未回复
                                var two_send = two_reply_send(usersn, msg);//普通回复
                                if (!two_send) { //未回复
                                    var random_msg = random_reply_send();//随机回复
                                    if (random_msg != null) {
                                        call.sendMsg(usersn, random_msg, 0, 0); //回复消息
                                    }
                                    if (switch_btns[4]) { //开启多少次未匹配关键字标色
                                        if (switch_btns[1]) { //随机默认回复
                                            if (reply_one != null && reply_one.length > 0) {//有随机回复，但是没回复的记录
                                                var un_reply_count = localStorage.getItem('DUODUO_UNREPLY_COUNT');
                                                var un_reply_color = localStorage.getItem('DUODUO_UNREPLY_COLOR');
                                                if (typeof un_reply_count == "undefined" || un_reply_count == null || typeof un_reply_color == "undefined" || un_reply_color == null) {
                                                    return;
                                                } else {
                                                    var c = localStorage.getItem(usersn);
                                                    if (typeof c == "undefined" || c == null) {
                                                        localStorage.setItem(usersn, 1);//没有时记一次
                                                    } else {
                                                        var count = localStorage.getItem(usersn);
                                                        count = parseInt(count) + parseInt(1);//先加一次
                                                        if (parseInt(count) >= parseInt(un_reply_count)) {
                                                            var un_reply_color = localStorage.getItem('DUODUO_UNREPLY_COLOR');

                                                            mark_nickname(avatar, un_reply_color);

                                                            // var img = $(".item-content img[src='" + avatar + "']");
                                                            // $(img).parent(".item-content").find("h2").css("color", un_reply_color);

                                                            /* $(img).parent(".item-content").click(function (event) {
                                                                 var img = $(".item-content img[src='" + avatar + "']");
                                                                 $(img).parent(".item-content").find("h2").css("color", "#333");
                                                             });*/

                                                            /* mmsUtil.ajaxGet(mmsUtil.mmsUri() + "/chats/users/" + usersn, {}, function (result) {//标记颜色
                                                             if (result.userinfo) {
                                                             if (result.userinfo.avatar != "") {
                                                             var img = $(".item-content img[src='" + result.userinfo.avatar + "']");
                                                             $(img).parent(".item-content").find("h2").css("color", un_reply_color);
                                                             }
                                                             console.log(result.userinfo);
                                                             } else {
                                                             console.error("获取用户图片信息失败。", result);
                                                             }
                                                             });*/
                                                            localStorage.setItem(usersn, 0);
                                                        } else {
                                                            localStorage.setItem(usersn, count);

                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                } else {
                                    localStorage.setItem(usersn, 0);
                                }
                            } else {
                                localStorage.setItem(usersn, 0);
                            }
                        }
                    }
                }
            }
        },
        500
    );
    localStorage.setItem("robot", true)
}

var userSNs = new Array();

function once_reply_send(userSN) {
    if (switch_btns[0]) { //第一次来询问
        if (userSNs[userSN]) {
            return null;
        }
        userSNs[userSN] = 1;
        return reply_d;
    }
}

function three_reply_send(usersn, msg, avatar) {
    if (switch_btns[3]) {//昵称标记回复
        if (reply_three != null && reply_three.length > 0) {
            for (var i = 0; i < reply_three.length; i++) {
                var my_keys = reply_three[i].ask;
                var arrys_keys = my_keys.split("|");
                for (var int = 0; int < arrys_keys.length; int++) {
                    var key = arrys_keys[int];
                    key = key.trim();
                    if (key != '') {
                        if (key.indexOf("=") == 0) {//绝对回复
                            if (key == ('=' + msg)) {
                                var reply = reply_three[i].reply;
                                var color = reply_three[i].color;
                                if (reply != null && color != null) {
                                    // var img = $(".item-content img[src='" + avatar + "']");
                                    // $(img).parent(".item-content").find("h2").css("color", color);


                                    /*$(img).parent(".item-content").click(function (event) {
                                        var img = $(".item-content img[src='" + avatar + "']");
                                        $(img).parent(".item-content").find("h2").css("color", "#333");
                                    });*/

                                    /* mmsUtil.ajaxGet(mmsUtil.mmsUri() + "/chats/users/" + usersn, {}, function (result) {//标记颜色
                                     if (result.userinfo) {
                                     if (result.userinfo.avatar != "") {
                                     var img = $(".item-content img[src='" + result.userinfo.avatar + "']");
                                     $(img).parent(".item-content").find("h2").css("color", color);
                                     }
                                     console.log(result.userinfo);
                                     } else {
                                     console.error("获取用户图片信息失败。", result);
                                     }
                                     });*/
                                    call.sendMsg(usersn, reply, 0, 0);//回复消息
                                    mark_nickname(avatar, un_reply_color);
                                    return true;//已发送
                                }
                            }
                        } else {
                            if (msg.indexOf(key) > -1) {
                                var reply = reply_three[i].reply;
                                var color = reply_three[i].color;
                                if (reply != null && color != null) {
                                    if (msg.indexOf(key) > -1) {//包含提问词

                                        // var img = $(".item-content img[src='" + avatar + "']");
                                        // $(img).parent(".item-content").find("h2").css("color", color);


                                        /*$(img).parent(".item-content").click(function (event) {
                                            var img = $(".item-content img[src='" + avatar + "']");
                                            $(img).parent(".item-content").find("h2").css("color", "#333");
                                        });*/

                                        /* mmsUtil.ajaxGet(mmsUtil.mmsUri() + "/chats/users/" + usersn, {}, function (result) {//标记颜色
                                         if (result.userinfo) {
                                         if (result.userinfo.avatar != "") {
                                         var img = $(".item-content img[src='" + result.userinfo.avatar + "']");
                                         $(img).parent(".item-content").find("h2").css("color", color);
                                         }
                                         console.log(result.userinfo);
                                         } else {
                                         console.error("获取用户图片信息失败。", result);
                                         }
                                         });*/
                                        call.sendMsg(usersn, reply, 0, 0);//回复消息
                                        mark_nickname(avatar, un_reply_color);
                                        return true;//已发送
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function two_reply_send(usersn, msg) {
    if (switch_btns[2]) {//指定内容回复
        if (reply_two != null && reply_two.length > 0) {
            for (var i = 0; i < reply_two.length; i++) {
                var my_keys = reply_two[i].ask;
                var arrys_keys = my_keys.split("|");
                for (var int = 0; int < arrys_keys.length; int++) {
                    var key = arrys_keys[int];
                    key = key.trim();
                    if (key != '') {
                        if (key.indexOf("=") == 0) {//绝对回复
                            if (key == ('=' + msg)) {
                                var reply = reply_two[i].reply;
                                if (reply != null) {
                                    call.sendMsg(usersn, reply, 0, 0);
                                    return true;
                                }
                            }
                        } else {
                            if (msg.indexOf(key) > -1) {
                                var reply = reply_two[i].reply;
                                if (reply != null) {
                                    call.sendMsg(usersn, reply, 0, 0)
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function random_reply_send() {
    if (switch_btns[1]) { //随机默认回复
        if (reply_one != null && reply_one.length > 0) {
            return reply_one[parseInt(reply_one.length * Math.random())].content;
        }
    }
}

/*
 var nowVer = '1.28.3';
 var ver = localStorage.getItem('DUODUO_VER');
 if (ver == null || ver != nowVer) {
 layui.use('layer', function () {
 layui.layer.open({
 title: '逆战自动回复版本更新提示',
 btn: false,
 shadeClose: true,
 area: ['500px', '450px'],
 content: '<img style="width:100%;height:100%" src="' + serverIP + "/img/ver/" + nowVer + '.png">'
 });
 });
 }
 ;
 localStorage.setItem('DUODUO_VER', nowVer);*/



