const title = document.querySelector('#title');
const description = document.querySelector('#description');
const list = document.querySelector('.list');
const form = document.querySelector('.form');
const addBtn = document.querySelector('.addBtn');
const editBtn = document.querySelector('.editBtn');
const submitBtn = document.querySelector('.submitBtn');

let todos = JSON.parse(localStorage.getItem('myTodo') || '[]');
let currentEdit = null;

const createDate = () => {
  const currentDate = new Date();

  const date =
    currentDate.getFullYear() +
    '-' +
    (currentDate.getMonth() + 1) +
    '-' +
    currentDate.getDate();
  const hour =
    currentDate.getHours() < 10
      ? `0${currentDate.getHours()}`
      : currentDate.getHours();
  const min =
    currentDate.getMinutes() < 10
      ? `0${currentDate.getMinutes()}`
      : currentDate.getMinutes();

  const sec =
    currentDate.getSeconds() < 10
      ? `0${currentDate.getSeconds()}`
      : currentDate.getSeconds();
  const time = hour + ':' + min + ':' + sec;
  const dateTime = date + ' ' + time;
  return dateTime;
};

const idGenerator = () => {
  return +(Math.random() * 1000000).toFixed(0);
};

const createLi = (id, titleVal, desc, date) => {
  const li = document.createElement('li');
  const listContent = document.createElement('div');
  const listBtns = document.createElement('div');
  const listTitle = document.createElement('h3');
  const listDesc = document.createElement('span');
  const listTime = document.createElement('time');
  const listEdit = document.createElement('button');
  const listDelete = document.createElement('button');

  listDelete.innerText = 'delete';
  listEdit.innerText = 'edit';
  listTitle.innerText = titleVal;
  listDesc.innerText = desc;
  listTime.innerHTML = date;

  li.className = 'listItem';
  listContent.className = 'listItemContent';
  listBtns.className = 'listItemBtns';
  listTitle.className = 'listTitle';
  listDesc.className = 'listDesc';
  listTime.className = 'listTime';
  listEdit.className = 'listBtn listEdit';
  listDelete.className = 'listBtn listDelete';

  listContent.appendChild(listTitle);
  listContent.appendChild(listDesc);
  listContent.appendChild(listTime);

  listBtns.appendChild(listEdit);
  listBtns.appendChild(listDelete);

  li.appendChild(listContent);
  li.appendChild(listBtns);
  li.dataset.id = id;

  list.appendChild(li);

  listDelete.addEventListener('click', (e) => {
    const itemId = e.target.parentNode.parentNode.dataset.id;
    todos = todos.filter((item) => item.id !== +itemId);
    e.target.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode
    );
    localStorage.setItem('myTodo', JSON.stringify(todos));
  });

  listEdit.addEventListener('click', (e) => {
    submitBtn.classList.remove('addBtn');
    submitBtn.classList.add('editBtn');
    submitBtn.innerText = 'edit';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'submitBtn cancelBtn';
    cancelBtn.innerHTML = 'cancel';
    form.appendChild(cancelBtn);

    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearAfterEdit();
    });
    const itemId = e.target.parentNode.parentNode.dataset.id;
    const editingItem = todos.filter((item) => item.id === +itemId);
    currentEdit = editingItem[0];
    title.value = editingItem[0].title;
    description.value = editingItem[0].description;
  });
};

const formSubmit = (e) => {
  e.preventDefault();
  const titleValue = title.value;
  const descValue = description.value;
  if (
    titleValue.trim() !== '' &&
    descValue.trim() !== '' &&
    titleValue.length < 121 &&
    descValue.length < 251
  ) {
    const dateTime = createDate();
    const itemId = idGenerator();
    const newTodo = {
      id: itemId,
      title: titleValue,
      description: descValue,
      timestamp: dateTime,
    };
    todos.push(newTodo);
    localStorage.setItem('myTodo', JSON.stringify(todos));
    update();
    clear();
  }
};

const formEdit = (e) => {
  e.preventDefault();
  const titleValue = title.value;
  const descValue = description.value;
  todos.forEach((item) => {
    if (item.id === currentEdit.id) {
      item.title = titleValue;
      item.description = descValue;
    }
  });
  localStorage.setItem('myTodo', JSON.stringify(todos));
  update();
  clearAfterEdit();
};

const update = () => {
  list.innerHTML = '';
  todos.forEach((t) => {
    createLi(t.id, t.title, t.description, t.timestamp);
  });
};

const clear = () => {
  title.value = '';
  description.value = '';
};

const clearAfterEdit = () => {
  currentEdit = null;
  clear();
  submitBtn.innerHTML = 'add';
  submitBtn.classList.add('addBtn');
  submitBtn.classList.remove('editBtn');
  document.querySelector('.cancelBtn').remove();
};

update();

submitBtn.addEventListener('click', (e) => {
  if (submitBtn.classList.contains('addBtn')) {
    formSubmit(e);
  } else if (submitBtn.classList.contains('editBtn')) {
    formEdit(e);
  }
});
