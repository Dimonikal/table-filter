class FilterModel {
    constructor() {}
}

class FilterView {
    constructor() {
        this.promise = xhrFunc('filter', 'html').then(v => {
            this.outlet = v;
            this.input = this.outlet.querySelector('input');
            this.reset = this.outlet.querySelector('button');
        });
    }

    bindChange(handler) {
        this.input.addEventListener('input', event => {
            handler(event.target.value);
        })
    }

    bindReset(handler) {
        this.reset.addEventListener('click', event => {
            handler();
        })
    }
}

class FilterController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    bindChange(handler){
        this.view.bindChange(handler);
    }

    bindReset(handler){
        this.view.bindReset(handler);
    }
}
  
const filter_component = new FilterController(new FilterModel(), new FilterView())