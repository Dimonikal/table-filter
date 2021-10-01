class LoadingModel {
    constructor() {}
}

class LoadingView {
    constructor() {
        this.promise = xhrFunc('loading', 'html').then(v => this.outlet = v);
    }

    hide(){
        console.log(this.outlet);
        this.outlet.style.display = 'hide';
        console.log(this.outlet.style);
    }
}

class LoadingController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
}
  
const loading_component = new LoadingController(new LoadingModel(), new LoadingView())