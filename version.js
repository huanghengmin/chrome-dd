getVertion(true);

setInterval(function(){
	getVertion(true);
},1000*60*60*1);

function getVertion(show){
	$.ajax({
        type : "post",
        url:localStorage["lrkj_serverIp"] + "/api/pdd/getversion",
        dataType : "json",// 返回json格式的数据
        timeout : 15000,
        success : function(json, textStatus, XMLHttpRequest) {
            if(json.code==0){
			   if(json.version>chrome.runtime.getManifest().version){
			       var createProperties={
						url:json.url
				   }
			       if(show){
			    	   var notification = new Notification("发现新版本?点击去下载更新", {
    			       		icon : localStorage["lrkj_serverIp"]+'/app/img/pdd.jpg',
    			       		body : json.log
			          	});
    			       	notification.onclick = function() {
    			       		console.log("click");
    			            chrome.tabs.create(createProperties);
    			            notification.close();
    			       	}
			       }
				}
			}else {
                $.toast(json.msg);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            $.toast("系统发生错误,请稍后再试");
        }
    });
}