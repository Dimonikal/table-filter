class FilterModel {
    constructor() {}
}

class FilterView {
    constructor() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'modules/filter/filter.html', false);
        xhr.send();
        if (xhr.status != 200) {
            // обработать ошибку
            console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            this.app = xhr.responseText; // responseText -- текст ответа.
        }
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
    
        return element
    }
    
      // Retrieve an element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector)
    
        return element
    }
}

class FilterController {
    constructor(model, view) {
        this.model = model
        this.view = view
    }
}
  
const filter_component = new FilterController(new FilterModel(), new FilterView())