notity_msg(30*60*1000);
function notity_msg(delay){
    var starttime=localStorage["expiration_date"];
    var starttimeHaoMiao = (new Date(starttime)).getTime(); //得到毫秒数
    var nowtimeHaoMiao = (new Date()).getTime()+24*60*60*1000; //得到毫秒数
    if(starttimeHaoMiao<nowtimeHaoMiao){
        show();
    }

    setInterval(function(){
        var starttime=localStorage["expiration_date"];
        var starttimeHaoMiao = (new Date(starttime)).getTime(); //得到毫秒数
        var nowtimeHaoMiao = (new Date()).getTime()+24*60*60*1000; //得到毫秒数
        if(starttimeHaoMiao<nowtimeHaoMiao){
            show();
        }
    }, delay);
}


function show() {
    var notification = new Notification("过期续费", {
        icon : localStorage["lrkj_serverIp"]+'/app/img/pdd.jpg',
        body : '亲，拼多多自动回复快过期啦，避免软件停用，快来续费吧。'
    });
    notification.onclick = function() {
        console.log("click");
        var createProperties={url:localStorage["lrkj_pay_url"]+localStorage["user_name"]};
        chrome.tabs.create(createProperties);
        notification.close();
    }
}