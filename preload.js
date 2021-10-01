const parser = new DOMParser;
/**
 * Функция загрузки файлов модулей
 * 
 * @see {@link  TableModel}, {@link FilterModel}, {@link LoadingModel}
 */
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

/**
 * Функция загрузки данных о пользователях
 * 
 * @see {@link TableModel}
 */
const xhrFuncData = function (){
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

/**
 * Декоратор, вызов функции производится после паузы, до тех пор остальные вызовы функции игнорируются
 * 
 * @constructor 
 * @param {Function} func - функция
 * @param {number} timeoutMs - пауза в миллисекундах
 * @see {@link TableView.renderUsers}
 */
class debounce{
    constructor(func, timeoutMs){
        this.lastCall = null;
        return function(){
            //время предыдущего вызова
            let previousCall = this.lastCall;
            //сохранение текущего времени вызова
            this.lastCall = Date.now();
            //если не первый вызов и разница между вызовами меньше паузы
            if (previousCall && this.lastCall - previousCall <= timeoutMs) {
                //очистить таймер
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                func(...arguments);
            }, timeoutMs);
        }.bind(this);
    }
}