class TableModel {
    constructor() {}
}

class TableView {
    constructor() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'modules/table/table.html', false);
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

class TableController {
    constructor(model, view) {
        this.model = model
        this.view = view
    }
}
  
const table_component = new TableController(new TableModel(), new TableView())