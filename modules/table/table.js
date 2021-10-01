class TableModel {
    constructor() {
        //Загрузка данных о пользователях
        this.promise = xhrFuncData('', 'data').then(v => {
            this.data = v;
            // console.log(v);
        })
    }
}

class TableView {
    constructor() {
        //загрузка шаблона 
        this.promise = xhrFunc('table', 'html').then(v => {
            this.outlet = v;
            this.table = this.outlet.querySelector('table');
            //первый массив с наименованиями столбцов, второй с форматом данных
            this.columns = [['Name', 'Picture', 'Location', 'Email', 'Phone', 'Registered Date'],
            ['name>first+last', 'picture>thumbnail+large', 'location>state+city', 'email', 'phone', 'registered>date']];
            let thead = this.createElement('thead');
            let headers = this.createElement('tr', 'headers');
            for(let col of this.columns[0]){
                let header = this.createElement('th', col.replace(/\s+/g, ''));
                header.textContent = col;              //замена пробелов
                headers.append(header);
            }
            //добавление thead
            thead.append(headers);
            this.table.append(thead);
            this.thead = this.table.querySelector('thead');

            //добавление tbody
            let tbody = this.createElement('tbody');
            this.table.append(tbody);
            this.tbody = this.table.querySelector('tbody');
        }); 

        //создание ошибки
        this.error = this.createElement('span', 'error');
        this.error.textContent = 'Nothing has been found on your request'
    }

    /**
     * Рендеринг конкретных пользователей в таблице
     * 
     * @param {array} users - пользователи
     */
    renderUsers(users){

        /**
         * Трансформация данных о столбце
         * 
         * @param {string} col - данные о столбце в определенном формате с(или без) операторами(ов) > и +
         * @returns {string[]} 
         */
        function colTransform(col){
            let sptCol = col.split(">");
            if(sptCol.length > 1){
                sptCol[1] = sptCol[1].split("+");
            }
            return sptCol;
        }

        /**
         * Сборка данных по инструкции(формату)
         * 
         * @param {array} format - формат данных для извлечения
         * @param {object} user - данные о пользователе 
         * 
         * @returns {string} извлеченные данные
         */
        function dataChoose(format, user){
            let extractedData = user[format[0]];
            if(format.length > 1){
                extractedData = "";
                for(let item of format[1]){
                    extractedData += user[format[0]][item];
                    extractedData += " ";
                }
            }
            return extractedData;
        }
        
        /**
         * Форматирование даты
         * 
         * @param {Date} date - дата
         * @returns {string} дата в формате dd.MM.yyyy
         */
        function formatDate(date) {
            let _date = date.split("T", 1);
            _date = _date[0].split("-");
            let dd = _date[2],
                mm = _date[1],
                yyyy = _date[0];
            return dd + "." + mm + "." + yyyy;
        }

        /**
         * 
         * Функция построения строки с данными пользователя
         * 
         * @param {object} user - объект с данными пользователя
         * @returns {HTMLElement} строка tr
         */
        this.getUserTr = function getUserTr(user){
            let userTr = this.createElement('tr');
            for(let i = 0; i < this.columns[1].length; i++){
                let td = this.createElement('td');
                switch(i){
                    //если изображение
                    case 1:
                        let img = this.createElement('img', 'tooltip');
                        let tooltip = this.createElement('span');
                        let imgs = dataChoose(colTransform(this.columns[1][1]), user).split(" ");
                        img.src = imgs[0];
                        tooltip.style.backgroundImage = "url("+imgs[1]+")"; 
                        td.append(img);
                        td.append(tooltip);
                        break;
                    //если дата
                    case 5:
                        let date = dataChoose(colTransform(this.columns[1][5]), user);
                        td.textContent = formatDate(date);
                        break;
                    default:
                        td.textContent = dataChoose(colTransform(this.columns[1][i]), user);
                        break;
                }
                userTr.append(td);
            }
            return userTr;
        }
        
        //очистка tbody
        let content = this.tbody.querySelectorAll('tr');
        for(let i = 0; i < content.length; i++){
            if(content[i]){
                this.tbody.removeChild(content[i]);
            }
        }
        let error = this.tbody.querySelector('.error');
        if(error){
            this.tbody.removeChild(error);
        }

        //если есть пользователи
        if(users.length > 0){
            for(let i = 0; i < users.length; i++){
                //добавить в таблицу
                this.tbody.append(this.getUserTr(users[i]));
            }
        }else{
            //вывести ошибку
            this.tbody.append(this.error);
        }
    }

    /**
     * Создание элемента DOM
     * 
     * @param {string} tag - имя тега
     * @param {string} className - имя класса
     * @see view.renderUsers(filteredUsers)
     */
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className && className != undefined) element.classList.add(className)
    
        return element
    }
}

class TableController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.promise = Promise.all([model.promise, view.promise]);

/**
 * Фильтрация пользователей
 * 
 * @param {string} value - введенное строчное выражение
 * @see {@link TableView.renderUsers}
 */
        this.filterUsers = new debounce(function(value){
            if(value){
                let input_names = value.split(" ", 2);
                let firstName = input_names[0];
                let lastName = input_names[1];
                let fnRegexp = firstName ? new RegExp("^"+firstName, 'i') : null;
                let lnRegexp = lastName != undefined ? new RegExp("^"+lastName, 'i') : null;
                let filteredUsers = model.data.results.filter(user => {
                    return (fnRegexp ? fnRegexp.test(user.name['first']) : false) && (lnRegexp ? lnRegexp.test(user.name['last']) : true);
                });
                // console.log(firstName, lastName);
                view.renderUsers(filteredUsers);
            }else{
                view.renderUsers(model.data.results)
            }
        }, 700);
    }

    
     /**
  * Рендеринг всех пользователей
  * 
  * @see {@link TableView.renderUsers}
  */
    renderUsers(){
        this.view.renderUsers(this.model.data.results);
    }

    handleChange = (value) => {
        return this.filterUsers(value);
    }

    handleReset = () => {
        this.renderUsers();
    }

    getFilterHandler(){
        return this.handleChange;
    }

    getResetHandler(){
        return this.handleReset;
    }
}
  
const table_component = new TableController(new TableModel(), new TableView())