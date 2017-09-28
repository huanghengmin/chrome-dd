var myRobot, chats, call;
var appElement = document.querySelector('[ng-app="starter"]');
chats = angular.element(appElement).scope().$$childHead.chats;
call = angular.element(document.body).injector().get('SockUtilService');
start_close_robot();
function start_close_robot() {
    layui.use('layer', function () {
        layui.layer.msg('哆哆加载成功', {icon: 1})
    });
    myRobot = self.setInterval(function () {
        if (switch_btns[0] || switch_btns[1] || switch_btns[2]) {
            for (var int = 0; int < chats.length; int++) {
                if (chats[int].waiting_minutes >= 0) {
                    chats[int].waiting_minutes = -1;
                    var one_msg = one_send(chats[int].userinfo.usersn);
                    if (one_msg != null) {
                        call.sendMsg(chats[int].userinfo.usersn, one_msg, 0, 0)
                    }
                    var two_msg = two_send(chats[int].userinfo.last_message);
                    if (two_msg != null) {
                        call.sendMsg(chats[int].userinfo.usersn, two_msg, 0, 0)
                    }
                }
            }
        }
    }, 500);
    localStorage.setItem("robot", true)
}
var userSNs = new Array();
function one_send(userSN) {
    if (switch_btns[0]) {
        if (userSNs[userSN]) {
            return null
        }
    }
    userSNs[userSN] = 1;
    return reply_d
}
function two_send(msg) {
    if (switch_btns[2]) {
        for (var i = 0; i < reply_two.length; i++) {
            if (msg.indexOf(reply_two[i].ask) >= 0) {
                return reply_two[i].reply
            }
        }
    }
    if (switch_btns[1]) {
        var msg;
        return reply_one[parseInt(reply_one.length * Math.random())].content
    }
}
var nowVer = '1.28.3';
var ver = localStorage.getItem('DUODUO_VER');
if (ver == null || ver != nowVer) {
    layui.use('layer', function () {
        layui.layer.open({
            title: '哆哆版本更新提示',
            btn: false,
            shadeClose: true,
            area: ['500px', '450px'],
            content: '<img style="width:100%;height:100%" src="' + serverIP + "/img/ver/" + nowVer + '.png">'
        });
    });
}
;
localStorage.setItem('DUODUO_VER', nowVer);