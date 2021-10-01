class LoadingModel {
    constructor() {}
}

class LoadingView {
    constructor() {
        //Загрузка шаблона
        this.promise = xhrFunc('loading', 'html').then(v => this.outlet = v);
    }

    /**
     * Спрятать загрузочный круг
     * 
     */
    hide(){
        this.outlet.style.display = 'none';
    }
}

class LoadingController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.promise = view.promise;
    }
}
  
const loading_component = new LoadingController(new LoadingModel(), new LoadingView())