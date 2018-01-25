localStorage["lrkj_serverIp"] = 'https://139.199.184.35';
localStorage["lrkj_pay_url"] = 'http://www.youka.la/category/A05D0976C63E447A?1';
localStorage["status"] = '0';
localStorage["expiration_date"];
if (typeof localStorage["user_name"] == "undefined") {
    localStorage["user_name"] = '';
}
thread(60 * 60 * 1000);
task();
function task() {//查询用户有效期
    if (typeof localStorage["user_name"] != "undefined" && localStorage["user_name"] != '' && localStorage["user_name"] != null) {
        $.ajax({
            type: "post",
            url: localStorage["lrkj_serverIp"] + "/api/pdd/getcustom",
            dataType: "json",
            timeout: 15000,
            data: {
                username: localStorage["user_name"]
            },
            success: function (json, textStatus, XMLHttpRequest) {
                if (json.code == 0) {
                    var user = json.data.user;
                    localStorage["status"] = user.status;
                    localStorage["expiration_date"] = user.expiration_date;
                    console.log("background task send cmd 2,status" + user.status + ",username:" + localStorage["user_name"] + ",expiration_date:" + user.expiration_date);
                    setStatus(user.status, localStorage["user_name"], user.expiration_date);
                } else {
                    console.log("background getcustom code not 0:" + json);
                }
            }
        });
    } else {
        localStorage["status"] = '1';//设置为无效
    }
}
function thread(time) {
    setInterval(function () {
        task();
    }, time);
}
var myport = null;
function setStatus(status, username, expiration_date) {
    if (myport != null) {
        myport.postMessage({
            cmd: 2,
            status: status,
            username: username,
            expiration_date: expiration_date
        });
    }
}

function sendStatus(json) {
    console.log("background sendStatus cmd:" + json.cmd + ",status:" + json.status + ",username:" + json.username + ",expiration_date:" + json.expiration_date);
    if (myport != null) {
        myport.postMessage(json);
    }
}
chrome.extension.onConnect.addListener(function (port) {
    myport = port;
    console.log("background receive port:" + port);
    port.onMessage.addListener(function (info) {
        if (info.cmd == 0) {//未绑定校验绑定信息
            $.ajax({
                type: "post",
                url: localStorage["lrkj_serverIp"] + "/api/pdd/getcustom",
                dataType: "json",
                timeout: 15000,
                data: {
                    username: info.username
                },
                success: function (json, textStatus, XMLHttpRequest) {
                    console.log(json)
                    if (json.code == 0) {
                        var user = json.data.user;
                        localStorage["status"] = user.status;
                        localStorage["expiration_date"] = user.expiration_date;
                        localStorage["user_name"] = info.username;

                        console.log("background cmd 0 ,status" + user.status + ",username:" + info.username + ",expiration_date:" + user.expiration_date);
                        port.postMessage({//返回绑定成功
                            cmd: 0,
                            status: user.status,
                            username: info.username,
                            expiration_date: user.expiration_date
                        });
                    } else {
                        localStorage["status"] = "1";
                        localStorage["expiration_date"] = '';
                        localStorage["user_name"] = ''

                        console.log("background cmd 0 server response code not 0,status" + user.status + ",username:" + info.username + ",expiration_date:" + user.expiration_date);
                        port.postMessage({//返回绑定成功
                            cmd: 0,
                            status: user.status,
                            username: info.username,
                            expiration_date: user.expiration_date
                        });
                    }
                }
            });
        }
        if (info.cmd == 1) {//已绑定，返回控件本地状态
            console.log("background cmd 1 ,status" + localStorage["status"] + ",username:" + localStorage["user_name"] + ",expiration_date:" + localStorage["expiration_date"]);
            port.postMessage({
                cmd: 1,
                status: localStorage["status"],
                username: localStorage["user_name"],
                expiration_date: localStorage["expiration_date"]
            });
        }
    });
});
