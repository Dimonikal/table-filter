class TableModel {
    constructor() {
        this.promise = xhrFuncData('', 'data').then(v => {
            this.data = v;
            console.log(this.data);
            this.names = [];
            for(let i = 0; i < this.data.results.length; i++){
                this.names.push({id: i, name: this.data.results[i].name});
            }
            // console.log(this.names);
        })
    }
}

class TableView {
    constructor() {
        this.promise = xhrFunc('table', 'html').then(v => {
            this.outlet = v;
            this.table = this.outlet.querySelector('table');
            this.columns = [['Name', 'Picture', 'Location', 'Email', 'Phone', 'Registered Date'],
            ['name>first+last', 'picture>thumbnail+large', 'location>state+city', 'email', 'phone', 'registered>date']];
            let headers = this.createElement('tr', 'headers');
            for(let col of this.columns[0]){
                let header = this.createElement('th', col.replace(/\s+/g, ''));
                header.textContent = col;
                headers.append(header);
            }
            // console.log(headers);
            this.table.append(headers);
            this.headers = this.table.querySelector('.headers');
        }); 

        this.error = this.createElement('span', 'error');
        this.error.textContent = 'Nothing has been found on your request'
    }

    renderUsers(users){
        function colTransform(col){
            let sptCol = col.split(">");
            if(sptCol.length > 1){
                sptCol[1] = sptCol[1].split("+");
            }
            // console.log(sptCol);
            return sptCol;
        }

        function dataChoose(sptCol, user){
            // console.log(user);
            let extractedData = user[sptCol[0]];
            if(sptCol.length > 1){
                extractedData = "";
                for(let item of sptCol[1]){
                    extractedData += user[sptCol[0]][item];
                    extractedData += " ";
                }
            }
            // console.log(extractedData);
            return extractedData;
        }
        
        function formatDate(date) {
            let _date = date.split("T", 1);
            _date = _date[0].split("-");
            let dd = _date[2],
                mm = _date[1],
                yyyy = _date[0];
            // console.log(_date);
            return dd + "." + mm + "." + yyyy;
        }

        this.getUser = function getUser(user){
            let userTr = this.createElement('tr');
            for(let i = 0; i < this.columns[1].length; i++){
                let td = this.createElement('td');
                switch(i){
                    case 1:
                        let img = this.createElement('img', 'tooltip');
                        let tooltip = this.createElement('span');
                        // let tooltip_img = this.createElement('img');
                        let imgs = dataChoose(colTransform(this.columns[1][1]), user).split(" ");
                        img.src = imgs[0];
                        // tooltip_img.src = imgs[1];
                        tooltip.style.backgroundImage = "url("+imgs[1]+")"; 
                        td.append(img);
                        td.append(tooltip);
                        break;
                    case 5:
                        let date = dataChoose(colTransform(this.columns[1][5]), user);
                        td.textContent = formatDate(date);
                        // console.log(formatDate(date));
                        // console.log(date);
                        break;
                    default:
                        td.textContent = dataChoose(colTransform(this.columns[1][i]), user);
                        break;
                }
                userTr.append(td);
            }
            // console.log(userTr);
            return userTr;
        }
        
        this.table.innerHTML = "";

        if(users.length > 0){
            for(let i = 0; i < users.length; i++){
                this.table.append(this.getUser(users[i]));
            }
        }else{
            this.table.append(this.error);
        }
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className && className != undefined) element.classList.add(className)
    
        return element
    }

    getElement(selector) {
        const element = document.querySelector(selector)
    
        return element
    }
}

class TableController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.promise = model.promise;

        this.filterUsers = new debounce(function(value){
            let input_names = value.split(" ", 2);
            let firstName = input_names[0];
            let lastName = input_names[1];
            let fnRegexp = new RegExp(firstName, 'i');
            let lnRegexp = new RegExp(lastName, 'i');
            let filteredUsers = model.data.results.filter(user => {
                return fnRegexp.test(user.name['first']) && lnRegexp.test(user.name['last'])
            });
            console.log(filteredUsers);
            view.renderUsers(filteredUsers);
        }, 1000);
    }

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
  
let table_component = new TableController(new TableModel(), new TableView())