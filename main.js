class Model {
    constructor() {}

    /**
     * Метод добавления компонента приложения в главный модуль
     * 
     * @param component - компонент приложения
     * @param name - имя компонента
     */
    addComponent(component, name){
        this[name] = component;
    }
}
  
class View {
    constructor() {
        //определение корневого тега
        this.app = document.querySelector('#root');
        //массив промисов
        this.promises = [];
    }

    /**
     * Рендер приложения
     * 
     * @param {Model} model - модель приложения
     */
    async render(model){
        this.app.append(model.loading.view.outlet); //представление loading
        this.app.append(model.filter.view.outlet); // представление filter
        this.app.append(model.table.view.outlet); // представление table

        await Promise.all(this.promises); //ожидание выполнения всех промисов(загрузки данных)
        model.table.renderUsers(); //рендер пользователей

        model.loading.view.hide(); //сокрытие загрузочного круга
        
        //операции присваивания обработчиков событий
        model.filter.bindChange(model.table.getFilterHandler(), model.table.getResetHandler());
        model.filter.bindReset(model.table.getResetHandler()); 
    }
}
  
class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
    }

    /**
     * Метод добавления компонента приложения в главный модуль
     * 
     * @param component - компонент приложения
     * @param name - имя компонента
     * @see {@link View.addComponent}
     */
    addComponent(component, name){
        this.view.promises.push(component.promise); //добавление промисов в массив
        this.model.addComponent(component, name) // добавление компонента в модель приложения
    }

    /**
     * Рендер приложения
     * 
     * @see {@link View.render}
     */
    render(){
        this.view.render(this.model);
    }
}
  
const app = new Controller(new Model(), new View())

app.addComponent(loading_component, 'loading');
app.addComponent(filter_component, 'filter');
app.addComponent(table_component, 'table');

app.render();

  