class FilterModel {
    constructor() {}
}

class FilterView {
    constructor() {
        //загрузка шаблона
        this.promise = xhrFunc('filter', 'html').then(v => {
            this.outlet = v;
            this.input = this.outlet.querySelector('input');
            this.reset = this.outlet.querySelector('button');
        });
    }

    /**
     * Бинд обработчика события изменения input'a
     * 
     * @param {Function} handlerChange - обработчик изменения
     */
    bindChange(handlerChange) {
        this.input.addEventListener('input', event => {
            handlerChange(event.target.value);
            // console.log(event.target.value);
        })
    }

    /**
     * Бинд обработчика события нажатия на кнопку reset
     * 
     * @param {Function} handler - обработчик сброса
     */
    bindReset(handler) {
        this.reset.addEventListener('click', event => {
            this.input.value = "";
            handler();
        })
    }
}

class FilterController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.promise = view.promise;
    }

    /**
     * Бинд обработчика события изменения input'a
     * 
     * @param {Function} changeHandler - обработчик изменения
     * @see {@link FilterView.bindChange}
     */
    bindChange(changeHandler){
        this.view.bindChange(changeHandler);
    }

    /**
     * Бинд обработчика события нажатия на кнопку reset
     * 
     * @param {Function} handler - обработчик сброса
     * @see {@link FilterView.bindReset}
     */
    bindReset(handler){
        this.view.bindReset(handler);
    }
}
  
const filter_component = new FilterController(new FilterModel(), new FilterView())