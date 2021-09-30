class Model {
    constructor() {
        this.components = [];
    }

    addComponent(component){
        this.components.push(component);
    }
  }
  
  class View {
    constructor() {
        this.app = this.getElement('#root');
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
    
        return element
    }

    getElement(selector) {
        const element = document.querySelector(selector)
    
        return element
    }

    render(components){
        for(let i = 0; i < components.length; i++){
            this.app.append(components[i].view.app);
        }
    }
  }
  
  class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view
    }

    addComponent(component){
        this.model.addComponent(component)
    }

    render(){
        this.view.render(this.model.components);
    }
  }
  
  const app = new Controller(new Model(), new View())

  app.addComponent(loading_component);
  app.addComponent(filter_component);
  app.addComponent(table_component);

  app.render();

  