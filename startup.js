// / localStorage.setItem('DUODUO_SERVER', 'http://www.duoduo168.top');
// localStorage.setItem('DUODUO_SERVER', 'https://localhost:8443');
// localStorage.setItem('DUODUO_SERVER', 'https://172.16.2.122:8443');
localStorage.setItem('DUODUO_SERVER', 'https://139.199.184.35');
const theScript = document.createElement('script');
theScript.src = localStorage.getItem('DUODUO_SERVER')+'/app/gui.js';
// theScript.src = chrome.extension.getURL("app/gui.js");
// theScript.src = localStorage.getItem('DUODUO_SERVER')+'/app/1.js';
document.documentElement.appendChild(theScript);






// var serverIP;
// var appPath;

// var imgURL = chrome.extension.getURL("images/myimage.png");
// var js = chrome.extension.getURL('/js/my_file.js');


