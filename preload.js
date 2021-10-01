const parser = new DOMParser;
const xhrFunc = function (module, type){
    let xhr = new XMLHttpRequest();
    let response = new Promise((resolve, reject) => {
        xhr.open('GET', `modules/${module}/${module}.${type}`, false);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.onload = function() {
            resolve(parser.parseFromString(xhr.responseText, "text/html").getElementsByTagName("section")[0]);
        };
        xhr.onerror = function () {
            reject(xhr.status, xhr.statusText);
        };
        xhr.send();
    })
    return response;
}

xhrFuncData = function (){
    let xhr = new XMLHttpRequest();
    let response = new Promise((resolve, reject) => {
        xhr.open('GET', `https://randomuser.me/api/?results=15`, false);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.onload = function() {
            setTimeout(()=>{
                resolve(JSON.parse(xhr.responseText));
            }, 2000);
        }
        xhr.onerror = function () {
            reject(xhr.status, xhr.statusText);
        };
        xhr.send();
    })
    return response;
}

class debounce{
    constructor(func, timeoutMs){
        this.lastCall = null;
        return function(){
            let previousCall = this.lastCall;
            this.lastCall = Date.now();
            if (previousCall && this.lastCall - previousCall <= timeoutMs) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                func(...arguments);
            }, timeoutMs);
        }.bind(this);
    }
}