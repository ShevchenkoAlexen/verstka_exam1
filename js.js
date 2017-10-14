'use strict';


class TodoList {
    constructor(bodyElement) {
        this.list = bodyElement;
        this.changeViewButtonsElem = bodyElement.querySelectorAll('.radiokbox');
        this.tasksElem = bodyElement.querySelectorAll('li');
        this.tasksCheckbox = bodyElement.querySelectorAll('.checkbox');
        this.inputForm = bodyElement.querySelector('.input_form');
        this.initTodo();
    }

    initTodo() {

        for (var j = 0; j < this.changeViewButtonsElem.length; j++) {
            if (this.changeViewButtonsElem[j].checked) {
                var v = this.changeViewButtonsElem[j].value;
                this.show(v);
            }
        }
        for (var i = 0; i < this.tasksElem.length; i++) {
            if (this.tasksElem[i].querySelector('.checkbox').checked) {
                this.clickTodo(i);
            }
        }
        this.changeCount();
        this.addListnerRadio();
        this.addListnerCheckTodos();
        this.addListnerInputForm();
        this.addListnerDelLine(this.list);
        this.addListnerButtonClear();
        this.addListnerNewTodoList();


        return this;
    }
    clickTodo(n) {
        this.tasksElem[n].querySelector('.label').classList.toggle('label-complite');

        return this;
    }
    changeCount() {
        this.tasksElem = this.list.querySelectorAll('li');
        this.tasksCheckbox = this.list.querySelectorAll('.checkbox');
        var count = this.tasksElem.length - 1;
        var elemCount = this.list.querySelector('.count');
        elemCount.innerHTML = count + ' item';

        return this;
    }
    show(view) {
        if (view === 'complited') {
            this.showComplited();
        } else if (view === 'active') {
            this.showActive();
        } else {
            this.showAll();
        }
    }

    /**
     * Листнер на перещелкивание вида
     */
    addListnerRadio() {
        for (var i = 0; i < this.changeViewButtonsElem.length; i++) {
            var t = this;
            this.changeViewButtonsElem[i].addEventListener('click', function () {
                t.show(this.value);

            });
        }
    }

    addListnerCheckTodos() {
        for (var i = 0; i < this.tasksCheckbox.length; i++) {
            this.addListnerCheckTodo(this.tasksCheckbox[i]);
        }

        return this;
    }
    addListnerCheckTodo(checkbox) {
        checkbox.addEventListener('click', function () {
            console.info('click');
            var l = checkbox.closest('.todo_item').querySelector('.label');
            l.classList.toggle('label-complite');
        });

        return this;

    }
    addListnerInputForm() {
        var t = this;
        this.inputForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var nt = this.querySelector('.input_section');
            var todo = nt.value;
            t.addTask(todo);
            nt.value = null;

        });

        return this;
    }

    addTask(newT) {
        console.info('addTask');
        if (!newT) {
            return this; // Если ничего не введено, то завершаем
        }
        var temp = this.tasksElem[0];
        var div = temp.cloneNode(true); // Клонируем шаблон
        div.classList.toggle('template');
        div.querySelector('.label').textContent = newT; // Добавляем текст в шаблон
        temp.parentNode.appendChild(div); // Вставляем объект
        // addListnerDelLine.call(bodytd);// Вешаем событие на удаление
        this.addListnerCheckTodo(div.querySelector('.checkbox'));
        this.addListnerDelLine(div);
        this.changeCount();

        return this;
    }
    addListnerDelLine(div) {
        var t = this;
        var dItem = div.querySelectorAll('.del_item_button');
        for (var i = 0; i < dItem.length; i++) {
            dItem[i].addEventListener('click', function () {
                t.delTask(this);
            });
        }

        return this;
    }

    addListnerButtonClear() {
        var t = this;
        var clButton = this.list.querySelector('.button_clear');
        clButton.addEventListener('click', function () {
            console.info('del');
            t.clearComplite();
        });

        return this;
    }

    delTask(div) {
        var li = div.closest('li');
        li.parentNode.removeChild(li);
        this.changeCount();
    }

    clearComplite() {
        console.info(this.tasksElem.length);
        for (var i = this.tasksElem.length - 1; i >= 0; i--) {
            var li = this.tasksElem[i];
            if (this.tasksCheckbox[i].checked) {
                li.parentNode.removeChild(li);
            }
        }
        this.changeCount();

        return this;
    }


    /**
     * Отображение только выполненных тасок
     */
    showComplited() {
        for (var i = 0; i < this.tasksElem.length; i++) {
            var checked = this.tasksElem[i].querySelector('.checkbox').checked;
            if (checked) {
                this.tasksElem[i].closest('li').classList.toggle('unvisible', false);
                // На выполненных выключаем класс
            }
            if (!checked) {
                this.tasksElem[i].closest('li').classList.toggle('unvisible', true);
                // НА  не выполненых включаем
            }
        }

        return this;
    }

    /**
     * Отобразить только активные таски
     */
    showActive() {

        for (var i = 0; i < this.tasksElem.length; i++) {
            var checked = this.tasksElem[i].querySelector('.checkbox').checked;
            if (checked) {
                this.tasksElem[i].closest('li').classList.toggle('unvisible', true);
            }
            if (!checked) {
                this.tasksElem[i].closest('li').classList.toggle('unvisible', false);
            }
        }

        return this;
    }

    /**
     * отобразить все таски
     */
    showAll() {
        for (var i = 0; i < this.tasksElem.length; i++) {
            this.tasksElem[i].closest('li').classList.toggle('unvisible', false);
        }

        return this;
    }

    addListnerNewTodoList() {
        var t = this;
        var clButton = this.list.querySelectorAll('.new_list_button');
        for (var i = 0; i < clButton.length; i++) {
            clButton[i].addEventListener('click', function () {
                console.info('click');
                t.createNewTodo(this.value);

            });
        }
    }
    createNewTodo(type) {

        var count = document.querySelectorAll('.body').length;
        var div = this.list.cloneNode(true);
        var menu = div.querySelectorAll('.radiokbox');
        for (var j = 0; j < menu.length; j++) {
            var menuName = 'menu' + (count + 1);
            menu[j].setAttribute('name', menuName);
        }
        var newTodo = new TodoList(div);
        var divName = newTodo.list.querySelector('.list_header .input_section');
        if (type === 'new_list') {
            divName.value = 'New Todo list';
            var list = newTodo.list.querySelectorAll('.del_item_button');
            for (var i = 1; i < list.length; i++) {
                newTodo.delTask(list[i]);
            }
        } else {
            divName.value = divName.value + ' clone';
        }
        this.list.parentNode.appendChild(newTodo.list);
    }


}


window.onload = function () {
    // проверяем поддержку
    var startTodo = [];
    var lists = document.querySelectorAll('.body');
    for (var i = 0; i < lists.length; i++) {
        startTodo[i] = new TodoList(lists[i]);

    }


};


