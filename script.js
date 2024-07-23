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
  priority.value = '普';
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

function validate() {
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
    item.priority = '普';
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

const filterButton = document.createElement('button');
filterButton.textContent = '優先度（高）で絞り込み';
filterButton.id = 'priority'
const main = document.querySelector('main');
main.appendChild(filterButton);

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName('tr'))
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
}

filterButton.addEventListener('click', () => {
  clearTable();

  for (const item of todoItems) {
    if (item.priority == '高') {
      addItem(item);
    }
  }
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
