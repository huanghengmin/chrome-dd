var serverIP;
var appPath;
$(function () {
    serverIP = localStorage.getItem('DUODUO_SERVER')
        appPath = serverIP+ "/app";
    var theScript = document.createElement('script');
    theScript.src = appPath + '/layui/layui.js';
    document.documentElement.appendChild(theScript);
    var theStyle = document.createElement('link');
    theStyle.href = appPath + '/layui/css/layui.css';
    theStyle.rel = "stylesheet";
    document.documentElement.appendChild(theStyle);


    var theStyle2 = document.createElement('link');
    theStyle2.href = appPath + '/css/style.css';
    theStyle2.rel = "stylesheet";
    document.documentElement.appendChild(theStyle2);


    $('body').append('<div style="right:-290px;"  class="contactusdiyou">' +
        '<div class="chats-btn" id="chats-btn">' +
        '<span>自</span><span>动</span><span>回</span><span>复</span>' +
        '</div>' +
        '</div>');


    // $('.pane ion-side-menus .menu-right .bar-header h1').css("font-size", "10px");
    // var v = $('ion-side-menu ion-header-bar h1')[1].children[3];
    // $(v).after('<span id="chats-btn" class="function_panel_title" style="background:#000;color:#FFFF00">哆哆助手</span>');
    var loginDiv = '<div id="duoduo_login" align="center" style="margin:5px">' + '<img src="' + appPath + '/img/head.png" style="width:100px;margin-top:20px"></img>' + '<div class="list"><label class="item item-input" style="margin:40px 0 10px 0">' + '账号：<input id="username" type="text" placeholder="请输入您的账号"></label><label class="item item-input">' + '密码：<input id="password" type="password" placeholder="请输入您的密码"></label></div></div>';
    var indexDiv = '<style>.layui-elem-quote{padding-top:10px;padding-bottom:10px;}.elem-quote button{display:block;margin:18px 10px;min-width:244px;}.elem-quote input{float:right;}.layui-form{margin-top:0;}.layui-bg-blue{margin:5px 0 3px 0;}</style>' + '<div id="duoduo_index" style="position:relative;height:100%;width:1000px"><div style="float:left;height:100%;width:265px;text-align:center;background:#FF0000;opacity:0.95"><img style="margin:24px 0 24px 0;width:126px" src="' + appPath + '/img/head.png"></img>' + '<div><button id="name" style="max-width:92px;min-width:92px" class="layui-btn layui-btn-primary">您的账号</button><button id="exit_btn" class="layui-btn layui-btn-danger">退出登录</button><div style="margin:16px 0 33px 0"><button id="time" style="max-width:198px;min-width:198px" class="layui-btn layui-btn-primary"></button></div>' + '<div class="elem-quote">' + '<button class="layui-btn">第一次来询问</button>' + '<button class="layui-btn">随机默认回复</button>' + '<button class="layui-btn">指定内容回复</button>' + '<button class="layui-btn layui-btn-normal">全部开启/关闭</button></div></div></div>' + '<div style="float:right;height:100%;width:730px">' + '<textarea id="reply-d" style="width:99%;height:88px;resize:none;margin-top:4px;padding:8px;padding-right:40px;border: 1px solid rgb(226,226,226)" placeholder="第一次咨询回复内容"></textarea>' + '<table style="display:none;width:100%;height:100%;margin-top:0;margin-bottom:5px;resize:none" class="layui-table" id="table-one" lay-filter="one"></table>' + '<table style="display:none;width:100%;height:100%;margin-top:0;margin-bottom:5px;resize:none" class="layui-table" id="table-two" lay-filter="two"></table></div></div>';
    $('body').append(loginDiv + indexDiv);
    $('body').append('<script type="text/html" id="bar"><a class="layui-btn layui-btn-danger layui-btn-mini" lay-event="del">删除</a></script>');
    getReply();
    btns = $('.elem-quote').children();
    title_btn = new Array(btns[0].innerText, btns[1].innerText, btns[2].innerText, btns[3].innerText);
    switch_btns = JSON.parse(localStorage.getItem('DUODUO_STATUS'));
    if (switch_btns == null) {
        switch_btns = new Array(false, false, false)
    }
    status_change();
    $('.elem-quote button').click(function (event) {
        if ($(this).index() != 3) {
            switch_btns[$(this).index()] = !switch_btns[$(this).index()]
        } else {
            switch_btns[0] = switch_btns[1] = switch_btns[2] = !(switch_btns[0] || switch_btns[1] || switch_btns[2])
        }
        status_change()
    })
});

function status_change() {
    for (var i = 0; i < 3; i++) {
        btns[i].innerText = title_btn[i] + (switch_btns[i] ? '【已开启】' : '【已关闭】')
    }
    btns[3].innerText = title_btn[3] + ((switch_btns[0] || switch_btns[1] || switch_btns[2]) ? '【已开启】' : '【已关闭】');
    localStorage.setItem('DUODUO_STATUS', JSON.stringify(new Array(switch_btns[0], switch_btns[1], switch_btns[2])))
}
var lusername = localStorage.getItem('DUODUO_USERNAME');
var lpassword = localStorage.getItem('DUODUO_PASSWORD');
localStorage.removeItem('DUODUO_KEY');
$('#chats-btn').ready(function () { //按钮加载时
    alert("aaaa");
    /*if (lusername != null && lpassword != null) {
        alert(aaa);
        $.ajax({
            type: "post",
            // url: serverIP + "/login.php",
            url: "http://localhost:8181/jeesite/a/card/login",
            data: {
                u: lusername,
                p: lpassword
            },
            dataType: "TEXT",
            success: function (r) {
                var jsonObject = JSON.parse(r.trim());
                if (jsonObject != null) {
                    if (jsonObject.code == 1000) {
                        localStorage.setItem('DUODUO_KEY', jsonObject.key);
                        localStorage.setItem('DUODUO_USERNAME', lusername);
                        localStorage.setItem('DUODUO_PASSWORD', lpassword);
                        getMode(lusername, jsonObject.key);
                        $('#name').text(lusername);
                        var dueTime = parseInt((jsonObject.duetime - Math.round(new Date().getTime() / 1000)) / 86400);
                        var time;
                        if (dueTime > 3000) {
                            time = '永久有效'
                        } else if (dueTime < 1) {
                            time = '已到期，点击重新激活'
                        } else {
                            time = dueTime + '天后到期'
                        }
                        $('#time').text(time)
                    } else {
                        alert('【哆哆助手提醒】' + jsonObject.msg)
                    }
                }
            }
        })
    }*/
});
$('#exit_btn').click(function () {
    localStorage.removeItem("DUODUO_USERNAME");
    localStorage.removeItem("DUODUO_PASSWORD");
    localStorage.removeItem("DUODUO_KEY");
    layui.use('layer', function () {
        layui.layer.closeAll();
        layui.layer.msg('退出成功', {
            icon: 1
        })
    });
    location.reload()
});
$('#time').click(function () {
    // serverIP = "http://www.duoduo168.top/app";
    layui.use('layer', function () {
        layui.layer.open({
            title: '哆哆助手',
            content: '您需要获取激活码吗？',
            btn: ['是的，我需要', '不用，我已经有了'],
            yes: function (index, layero) {
                // window.open('http://www.duoduo168.top/index.html');
                window.open(serverIP+'/jeesite/a');
                layer.close(index)
            },
            btn2: function (index, layero) {
                layer.close(index);
                layui.layer.prompt({
                    formType: 0,
                    title: '请输入激活码'
                }, function (value, index, elem) {
                    var username = localStorage.getItem('DUODUO_USERNAME'); //获取用户名
                    var password = localStorage.getItem('DUODUO_PASSWORD'); //获取密码
                    $.ajax({
                        type: "post",
                        // url: serverIP + "/login.php",
                        url: serverIP+"jeesite/a/card/login",
                        data: {
                            u: username,
                            p: password,
                            k: value  //提交激活码
                        },
                        dataType: "TEXT",
                        success: function (r) {
                            var jsonObject = JSON.parse(r.trim());
                            if (jsonObject != null) {
                                if (jsonObject.code == 1000) { //成功
                                    layui.layer.msg(jsonObject.msg, {
                                        icon: 1,
                                        time: 800
                                    });
                                    layer.close(index);
                                    location.reload()
                                } else { //其它
                                    layui.layer.open({
                                        icon: 2,
                                        content: jsonObject.msg
                                    })
                                }
                            }
                        }
                    })
                })
            }
        })
    })
});
var duetime = 0;
$('#chats-btn').click(function () {
    // serverIP = "http://localhost:8181/jeesite/a/card/";
    if (localStorage.getItem('DUODUO_KEY') == null) {//未找到注册码，提示登陆或注册
        layui.use('layer', function () {
            layui.layer.open({
                type: 1,
                shift: -1,
                area: ['480px', '380px'],
                title: '哆哆助手',
                btn: ['登录', '注册'],
                btnAlign: 'c',
                resize: false,
                content: $('#duoduo_login'),
                btn2: function (index, layero) {
                    window.open(serverIP+'/jeesite/a');
                    layer.close(index)
                },
                yes: function (index, layero) {
                    // alert(2222222);
                    var username = $('#username').val();
                    var password = hex_md5($('#password').val());

                    $.ajax({
                        // type: "post",
                        // url: serverIP + "/login",
                        url: serverIP+"/jeesite/a/card/login",
                        /*data: {
                            u: username,
                            p: password
                        },*/
                        // contentType : 'application/json;charset=utf-8',
                        // cache: false,
                        // dataType: "jsonp",


                        type : 'POST',
                        // contentType : 'application/json',
                        // url : 'user/add',
                        // dataType: "json",
                        // data : jsonuserinfo,
                        dataType : 'TEXT',
                        success : function(data) {
                        // success: function (r) {
                            var jsonObject = JSON.parse(data.trim());
                            if (jsonObject != null) {
                                if (jsonObject.code == 1000) { //登陆成功
                                    layui.layer.msg(jsonObject.msg, {
                                        icon: 1,
                                        time: 800
                                    });
                                    localStorage.setItem('DUODUO_KEY', jsonObject.key); //保存注册码
                                    layer.close(index);
                                    localStorage.setItem('DUODUO_USERNAME', username); //用户名
                                    localStorage.setItem('DUODUO_PASSWORD', password); //密码
                                    getMode(username, jsonObject.key); //加载自动回复代码
                                    $('#name').text(username);
                                    var dueTime = parseInt((jsonObject.duetime - Math.round(new Date().getTime() / 1000)) / 86400); //计算时间
                                    var time;
                                    if (dueTime > 3000) {//大于3000天
                                        time = '永久有效'
                                    } else if (dueTime < 1) {
                                        time = '已到期，点击重新激活'
                                    } else {
                                        time = dueTime + '天后到期'
                                    }
                                    duetime = jsonObject.duetime - Math.round(new Date().getTime() / 1000);
                                    setTimeout("location.reload()", (duetime + 10) * 1000);
                                    $('#time').text(time)
                                } else if (jsonObject.code == 1104) { //1104需要重新激活
                                    layer.msg('您的账号已到期,请重新激活!', {
                                        icon: 0,
                                        time: 2500,
                                        shade: [0.6, '#000']
                                    }, function () {
                                        localStorage.setItem('DUODUO_USERNAME', username);
                                        localStorage.setItem('DUODUO_PASSWORD', password);
                                        $('#time').click()
                                    })
                                } else {//提示其它信息
                                    layui.layer.open({
                                        icon: 2,
                                        content: jsonObject.msg
                                    })
                                }
                            }
                        },
                        // error: function(){
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(XMLHttpRequest.status);
                                alert(XMLHttpRequest.readyState);
                                alert(textStatus);
                            // },
                        }
                    })
                }
            })
        })
    }
    else {
        layui.use('layer', function () { //有激活码时显示界面
            layui.layer.open({
                type: 1,
                shift: -1,
                title: false,
                resize: false,
                area: ['1000px', '530px'],
                content: $('#duoduo_index')
            });
            getReply();
            $('#reply-d').val(reply_d);
            updataReply(true, true);
            layui.use('table', function () {
                var table = layui.table;
                table.on('edit(one)', function (obj) {
                    reply_one[obj.data.id - 1]['content'] = obj.data.content;
                    updataReply(true, false)
                });
                table.on('edit(two)', function (obj) {
                    reply_one[obj.data.id - 1]['ask'] = obj.data.ask;
                    reply_one[obj.data.id - 1]['reply'] = obj.data.reply;
                    updataReply(false, true)
                });
                table.on('tool(one)', function (obj) {
                    var layEvent = obj.event;
                    if (layEvent === 'del') {
                        obj.del();
                        reply_one.splice([obj.data.id - 1], 1);
                        updataReply(true, false);
                        layer.msg('删除【' + obj.data.content + '】成功', {
                            icon: 1
                        })
                    }
                });
                table.on('tool(two)', function (obj) {
                    var layEvent = obj.event;
                    if (layEvent === 'del') {
                        obj.del();
                        reply_two.splice([obj.data.id - 1], 1);
                        updataReply(false, true);
                        layer.msg('删除【' + obj.data.ask + '】成功', {
                            icon: 1
                        })
                    }
                })
            })
        })
    }
});
$("#reply-d").blur(function () {
    var val = $("#reply-d").val().trim();
    if (val != '' && val != reply_d) {
        reply_d = val;
        localStorage.setItem('DUODUO_REPLY_D', reply_d);
        layui.use('layer', function () {
            layui.layer.msg('保存成功！', {
                icon: 1,
                time: 500
            })
        })
    }
});
var reply_one, reply_two, reply_d;
var switch_btns;
var title_btn, btns;

function getReply() {
    reply_one = localStorage.getItem('DUODUO_REPLY_ONE');
    reply_one = reply_one != null ? JSON.parse(reply_one) : null;
    reply_two = localStorage.getItem('DUODUO_REPLY_TWO');
    reply_two = reply_two != null ? JSON.parse(reply_two) : null;
    reply_d = localStorage.getItem('DUODUO_REPLY_D');
    (reply_d == null || reply_d.trim() == '') ? reply_d = '您好亲，欢迎光临~' : null
}
function updataReply(one, two) {
    if (reply_one != null && reply_two != null) {
        for (var number = 0; number < reply_one.length; number++) {
            reply_one[number]['id'] = number + 1
        }
        for (var number = 0; number < reply_two.length; number++) {
            reply_two[number]['id'] = number + 1
        }
    }
    layui.use('table', function () {
        var table = layui.table;
        var $ = layui.jquery;
        if (one) {
            table.render({
                elem: '#table-one',
                height: 200,
                cols: [
                    [{
                        field: 'id',
                        title: '编号',
                        width: 70,
                        sort: true,
                        align: 'center'
                    },
                        {
                            field: 'content',
                            edit: 'text',
                            title: '随机回复内容',
                            width: 550,
                            sort: true
                        },
                        {
                            width: 80,
                            toolbar: '#bar',
                            align: 'center',
                            title: '<button id="one-btn" class="layui-btn layui-btn-normal" style="width:35px;height:100%;padding:0">+</button>'
                        },
                    ]
                ],
                data: reply_one,
                page: false
            });
            localStorage.setItem('DUODUO_REPLY_ONE', (JSON.stringify(reply_one)));
            $('#one-btn').click(function () {
                if (reply_one == null) {
                    reply_one = new Array()
                }
                layui.use('layer', function () {
                    layui.layer.prompt({
                        formType: 2,
                        title: '请输入回复内容',
                        area: ['600px', '60px']
                    }, function (value, index, elem) {
                        reply_one.push({
                            'id': reply_one.length + 1,
                            'content': value
                        });
                        updataReply(true, false);
                        layer.close(index)
                    })
                })
            })
        }
        if (two) {
            table.render({
                elem: '#table-two',
                height: 204,
                cols: [
                    [{
                        field: 'id',
                        title: '编号',
                        width: 70,
                        sort: true,
                        align: 'center'
                    },
                        {
                            field: 'ask',
                            edit: 'text',
                            title: '指定内容',
                            width: 200,
                            sort: true
                        },
                        {
                            field: 'reply',
                            edit: 'text',
                            title: '回复内容',
                            width: 350,
                            sort: true
                        },
                        {
                            width: 80,
                            toolbar: '#bar',
                            align: 'center',
                            title: '<button id="two-btn" class="layui-btn layui-btn-normal" style="width:35px;height:100%;padding:0">+</button>'
                        },
                    ]
                ],
                data: reply_two,
                page: false
            });
            localStorage.setItem('DUODUO_REPLY_TWO', (JSON.stringify(reply_two)));
            $('#two-btn').click(function () {
                if (reply_two == null) {
                    reply_two = new Array()
                }
                updataReply(false, true);
                layui.use('layer', function () {
                    layui.layer.prompt({
                        formType: 2,
                        title: '请输入问题',
                        area: ['600px', '60px']
                    }, function (value, index, elem) {
                        layer.close(index);
                        layui.layer.prompt({
                            formType: 2,
                            title: '请输入回复【' + value + '】',
                            area: ['600px', '60px']
                        }, function (value2, index2, elem2) {
                            reply_two.push({
                                'id': reply_two.length + 1,
                                'ask': value,
                                'reply': value2
                            });
                            updataReply(false, true);
                            layer.close(index2)
                        })
                    })
                })
            })
        }
    })
}
function getMode(username, key) {
    // serverIP = "http://www.duoduo168.top/app";
    // var theScript2 = '<script src="' + serverIP + '/mode.php?username=' + username + '&key=' + key + '"></script>';
    var theScript2 = '<script src="' + appPath + '/mode.js"></script>';
    $('body').append(theScript2)
}


function hex_md5(a) {
    if (a == "") return a;
    return rstr2hex(rstr_md5(str2rstr_utf8(a)))
}
function rstr_md5(a) {
    return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
}
var hexcase = 0;

function rstr2hex(c) {
    try {
        hexcase
    } catch (g) {
        hexcase = 0
    }
    var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var b = "";
    var a;
    for (var d = 0; d < c.length; d++) {
        a = c.charCodeAt(d);
        b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
    }
    return b
}
function str2rstr_utf8(c) {
    var b = "";
    var d = -1;
    var a, e;
    while (++d < c.length) {
        a = c.charCodeAt(d);
        e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
        if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
            a = 65536 + ((a & 1023) << 10) + (e & 1023);
            d++
        }
        if (a <= 127) {
            b += String.fromCharCode(a)
        } else {
            if (a <= 2047) {
                b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
            } else {
                if (a <= 65535) {
                    b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                } else {
                    if (a <= 2097151) {
                        b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                    }
                }
            }
        }
    }
    return b
}
function rstr2binl(b) {
    var a = Array(b.length >> 2);
    for (var c = 0; c < a.length; c++) {
        a[c] = 0
    }
    for (var c = 0; c < b.length * 8; c += 8) {
        a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
    }
    return a
}
function binl2rstr(b) {
    var a = "";
    for (var c = 0; c < b.length * 32; c += 8) {
        a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
    }
    return a
}
function binl_md5(p, k) {
    p[k >> 5] |= 128 << ((k) % 32);
    p[(((k + 64) >>> 9) << 4) + 14] = k;
    var o = 1732584193;
    var n = -271733879;
    var m = -1732584194;
    var l = 271733878;
    for (var g = 0; g < p.length; g += 16) {
        var j = o;
        var h = n;
        var f = m;
        var e = l;
        o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
        l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
        m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
        n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
        o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
        l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
        m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
        n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
        o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
        l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
        m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
        n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
        o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
        l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
        m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
        n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
        o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
        l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
        m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
        n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
        o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
        l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
        m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
        n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
        o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
        l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
        m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
        n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
        o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
        l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
        m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
        n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
        o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
        l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
        m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
        n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
        o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
        l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
        m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
        n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
        o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
        l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
        m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
        n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
        o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
        l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
        m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
        n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
        o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
        l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
        m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
        n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
        o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
        l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
        m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
        n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
        o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
        l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
        m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
        n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
        o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
        l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
        m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
        n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
        o = safe_add(o, j);
        n = safe_add(n, h);
        m = safe_add(m, f);
        l = safe_add(l, e)
    }
    return Array(o, n, m, l)
}
function md5_cmn(h, e, d, c, g, f) {
    return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
}
function md5_ff(g, f, k, j, e, i, h) {
    return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
}
function md5_gg(g, f, k, j, e, i, h) {
    return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
}
function md5_hh(g, f, k, j, e, i, h) {
    return md5_cmn(f ^ k ^ j, g, f, e, i, h)
}
function md5_ii(g, f, k, j, e, i, h) {
    return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
}
function safe_add(a, d) {
    var c = (a & 65535) + (d & 65535);
    var b = (a >> 16) + (d >> 16) + (c >> 16);
    return (b << 16) | (c & 65535)
}
function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b))
};
