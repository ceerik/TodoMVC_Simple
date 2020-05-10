const form = document.querySelector("form");
const inputElement = document.getElementById('itemInputBox');
const toggleAll = document.getElementById('toggleAllButton');
const viewAll = document.getElementById('footerAllButton');
const viewActive = document.getElementById('footerActiveButton');
const viewCompleted = document.getElementById('footerCompletedButton');
const clearCompleted = document.getElementById('clearCompletedButton');
const template = document.querySelector('.template');
const todoneCounter = document.getElementById('itemsLeft');
var viewState = 0;
// items stores an array todoItem id's, each corresponding to an item in the todo list.
var itemsArray;
// nextItem stores the integer intended to be used for the id of the todoItem that is to be created next. Numbers are not reused.
var nextItemID;
init();

function init() {
    changeViewState(0);
    inputReset();
    itemsArray = new Array();
    updateItemsLeftCounter();
    nextItemID = 0;
}


//Event listener code for deletion, and completion toggling of todoItems inspired by: https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class/50901269#answer-50901269
var base = document.querySelector('#todoItems');
var toggleButtons = '.todoItemToggleImage';
var deleteButtons = '.todoItemDeleteImage';

base.addEventListener('click', function(event) {
  var closest = event.target.closest(toggleButtons);
  if (closest && base.contains(closest)) {
    var todoItem = event.target.parentElement.parentElement.parentElement;
    if (todoItem.classList.contains('todoneItem')) {
        todoItem.classList.remove('todoneItem');
    } else if (!todoItem.classList.contains('todoneItem')) {
        todoItem.classList.add('todoneItem');
    }
    updateItemsLeftCounter();
  }
});

base.addEventListener('click', function(event) {
    var closest = event.target.closest(deleteButtons);
    if (closest && base.contains(closest)) {
      var todoItem = event.target.parentElement.parentElement.parentElement;
      garbageColletor(todoItem);
      updateItemsLeftCounter();
    }
});

clearCompleted.onclick = event => {
    var todoItems = getTodoItems();
    var itemsToDelete = new Array();
    const length = todoItems.length;
    for (i = 0; i < length; i++) {
        if (todoItems[i].classList.contains('todoneItem')) {
            itemsToDelete.push(todoItems[i]);
        }
    }
    itemsToDelete.forEach(garbageColletor);
    updateItemsLeftCounter();
}

function garbageColletor(itemToDelete) {
    document.getElementById('todoItems').removeChild(itemToDelete);
}

// Make sure to run this function whenever anything might potentially add/remove the todoneItem class from an element of the todoItem class, or remove todoItems entirely. This might be doable with an event handler of some sort? If it can detect the addition of another element in the todoItems div. (It looks like MutationObserver can do this, although there's not enough time to implement it now.)
function updateItemsLeftCounter() {
    var todoItems = getTodoItems();
    const length = todoItems.length;
    var remainingItems = length;

    for (i = 0; i < length; i++) {
        if (todoItems[i].classList.contains('todoneItem')) {
            remainingItems--;
        }
    }

    document.getElementById('itemsLeft').textContent = remainingItems + " items left";
    
    if (length > 0) {
        setFooterVisibility(true);
    } else {
        setFooterVisibility(false);
    }

    if (remainingItems < itemsArray.length) {
        clearCompleted.classList.remove('hiddenClearCompletedButton');
    } else {
        clearCompleted.classList.add('hiddenClearCompletedButton');
    }
}

function setFooterVisibility(visible) {
    var footer = document.getElementById('footer');
    if (visible) {
        footer.classList.remove('hiddenFooter');
    } else if (!visible) {
        footer.classList.add('hiddenFooter');
    }
}

viewAll.onclick = event => {
    changeViewState(0);
}

viewActive.onclick = event => {
    changeViewState(1);
}

viewCompleted.onclick = event => {
    changeViewState(2);
}

// View States:
// 0 = All
// 1 = Active
// 2 = Completed
function changeViewState(newState) {
    var todoItems = getTodoItems();
    const length = todoItems.length;
    if (newState == 0) {
        for (i = 0; i < length; i++) {
            todoItems[i].classList.remove('hiddenItem');
        }
    } else if (newState == 1) {
        for (i = 0; i < length; i++) {
            if (todoItems[i].classList.contains('todoneItem')) {
                todoItems[i].classList.add('hiddenItem');
            } else if (!todoItems[i].classList.contains('todoneItem')) {
                todoItems[i].classList.remove('hiddenItem');
            }
        }
    } else if (newState == 2){
        for (i = 0; i < length; i++) {
            if (todoItems[i].classList.contains('todoneItem')) {
                todoItems[i].classList.remove('hiddenItem');
            } else if (!todoItems[i].classList.contains('todoneItem')) {
                todoItems[i].classList.add('hiddenItem');
            }
        }
    }
}

toggleAll.onclick = event => {
    var todoItems = getTodoItems();
    const length = todoItems.length;
    var checkedItems = 0;

    for (i = 0; i < length; i++) {
        if (todoItems[i].classList.contains('todoneItem')) {
            checkedItems ++;
        }
    }

    if (checkedItems != length) {
        for (i = 0; i < length; i++) {
            if (!todoItems[i].classList.contains('todoneItem')) {
                todoItems[i].classList.add('todoneItem');
            }
        }
    } else {
        for (i = 0; i < length; i++) {
            if (todoItems[i].classList.contains('todoneItem')) {
                todoItems[i].classList.remove('todoneItem');
            }
        }
    }
    updateItemsLeftCounter();
}

function getTodoItems() {
    const htmlItems = document.getElementsByClassName('todoItem');
    var items = new Array();
    const length = htmlItems.length;
    for (i = 0; i < length; i++) {
        items.push(htmlItems.item(i));
    }
    items.pop();
    return items;
}

form.onsubmit = event => {
    event.preventDefault();
    const input = inputElement.value;
    inputElement.value = "";
    createItem(input);
    updateItemsLeftCounter();
}

inputElement.onfocus = event => {
    inputSet();
}

inputElement.onblur = event => {
    inputReset();
}

function createItem(input) {
    const newItem = template.cloneNode('deep');
    newItem.classList.remove("template");
    const textBox = newItem.querySelector('.todoItemTextBox');
    const text = textBox.querySelector('.todoItemText');
    text.innerHTML = input;
    var id = nextItemID + 'Item';
    itemsArray.push(id);
    newItem.id = id;
    newItem.querySelectorAll('button')[0].querySelector('img').id = id + 'ToggleButton';
    newItem.querySelectorAll('button')[1].querySelector('img').id = id + 'DeleteButton';
    nextItemID ++;
    todoItems.insertAdjacentElement('afterbegin', newItem);
}

function inputSet() {
    inputElement.classList.remove('backgroundText');
    inputElement.value="";
}

function inputReset() {
    inputElement.classList.add('backgroundText');
    inputElement.value="What needs to be done?";
}