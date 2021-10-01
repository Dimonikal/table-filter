class Model {
    constructor() {}
  }
  
  class View {
    constructor() {
        this.app = document.querySelector('#root');
        this.promises = [];
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
    
        return element
    }

    getElement(selector) {
        return this.app.querySelector(selector)
    }

    async render(model){
        this.app.append(model.loading.view.outlet);
        this.app.append(model.filter.view.outlet);
        this.app.append(model.table.view.outlet);

        await this.promises[0];
        model.table.renderUsers();
        
        model.filter.bindChange(model.table.getFilterHandler());
        model.filter.bindReset(model.table.getResetHandler());

        model.loading.view.outlet.style.display = "none";
    }

    refreshTable(){
        this.app.table.refresh();
    }
  }
  
  class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
    }

    addComponent(component, asyncBool){
        this.view.promises.push(component.promise);
        this.model.addComponent(component)
    }

    addFilter(filter){
        this.model.filter = filter;
    }

    addTable(table){
        this.model.table = table;
        this.view.promises.push(table.model.promise);
    }

    addLoading(loading){
        this.model.loading = loading;
    }

    render(){
        this.view.render(this.model);
    }

    refreshTable(){
        this.view.refreshTable();
    }
  }
  
  const app = new Controller(new Model(), new View())
    
  app.addLoading(loading_component);
  app.addFilter(filter_component);
  app.addTable(table_component, true);

  app.render();

  