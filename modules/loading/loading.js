class LoadingModel {
    constructor() {}
}

class LoadingView {
    constructor() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'modules/loading/loading.html', false);
        xhr.send();
        if (xhr.status != 200) {
            // обработать ошибку
            console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            this.app = xhr.responseText; // responseText -- текст ответа.
        }
    }
}

class LoadingController {
    constructor(model, view) {
        this.model = model
        this.view = view
    }
}
  
const loading_component = new LoadingController(new LoadingView(), new LoadingModel())