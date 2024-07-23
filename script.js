'use strict';

const storage = localStorage;
let todoItems = [];

const table = document.querySelector('table');
const todo = document.getElementById('todo');
const priority = document.querySelector('select');
const deadline = document.querySelector('input[type="date"]');
const submit = document.getElementById('submit');

document.addEventListener('DOMContentLoaded', () => {
  // Read local strage data
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }
  todoItems = JSON.parse(json);
  for (const item of todoItems) {
    addItem(item);
  }
});

const clearForm = () => {
  todo.value = '';
  priority.value = '中';
  deadline.value = '';
}

const addItem = (item) => {
  const tr = document.createElement('tr');

  for (const prop in item) {
    const td = document.createElement('td');
    if (prop == 'done') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener('change', checkBoxListener);
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }
  table.append(tr);
  clearForm();
}

const checkBoxListener = (ev) => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  const currentTr = ev.currentTarget.parentElement.parentElement;
  const idx = trList.indexOf(currentTr) - 1;
  todoItems[idx].done = ev.currentTarget.checked;
  storage.todoList = JSON.stringify(todoItems);
};

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName('tr'))
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
}

const validate = () => {
  let item = {};
  if (todo.value != '') {
    item.todo = todo.value;
  } else {
    window.alert('Empty todo content!');
    return;
  }

  if (deadline.value != '') {
    item.deadline = deadline.value;
  } else {
    const date = new Date();
    item.deadline = date.toLocaleDateString().replace(/\//g, '-');
  }

  if (priority.value != '') {
    item.priority = priority.value;
  } else {
    item.priority = '中';
  }
  item.done = false;

  return item
}

submit.addEventListener('click', () => {
  const item = validate();
  console.log(item);
  addItem(item);
  todoItems.push(item);
  storage.todoList = JSON.stringify(todoItems);
});

// Filter
//const filterDropDown = document.getElementById('filter');


const main = document.querySelector('main');

const filterDropDown = document.createElement('select');
filterDropDown.id = 'filterDropDown';
const filterDropDownList = [
  { value: 'High', text: '高' },
  { value: 'Middle', text: '中' },
  { value: 'Low', text: '低' },
]

filterDropDownList.forEach((option) => {
  const opt = document.createElement('option');
  opt.value = option.value;
  opt.textContent = option.text;
  filterDropDown.appendChild(opt);
});
main.appendChild(filterDropDown);


const filterButton = document.createElement('button');
filterButton.textContent = 'フィルタ';
filterButton.id = 'priority';
main.appendChild(filterButton);

const showItemsByPriority = (priority) => {
  for (const item of todoItems) {
    console.log(item.priority);
    if (item.priority == priority) {
      addItem(item);
    }
  }
}

filterButton.addEventListener('click', () => {
  const filterTarget = document.getElementById('filterDropDown').value;
  console.log(filterTarget);
  if (filterTarget == '') {
    return;
  }

  const filterList = [
    { target: 'High', priority: '高' },
    { target: 'Middle', priority: '中' },
    { target: 'Low', priority: '低' },
  ];

  filterList.forEach((filter) => {
    console.log(filter)
    if (filter.target == filterTarget) {
      console.log(filter)
      showItemsByPriority(filter.priority);
    }
  });

  clearTable();

});

const remove = document.createElement('button');
remove.textContent = '完了したアイテムを削除する';
remove.id = 'remove';
const br = document.createElement('br');
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener('click', () => {
  clearTable();
  todoItems = todoItems.filter((item) => item.done == false);
  for (const item of todoItems) {
    addItem(item);
  }
  storage.todoList = JSON.stringify(todoItems);
});
