// localStorage.setItem('DUODUO_SERVER', 'http://www.duoduo168.top');
localStorage.setItem('DUODUO_SERVER', 'http://localhost:8181');
const theScript = document.createElement('script');
theScript.src = localStorage.getItem('DUODUO_SERVER')+'/app/1_decode.js';
// theScript.src = localStorage.getItem('DUODUO_SERVER')+'/app/1.js';
document.documentElement.appendChild(theScript);