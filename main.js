import {toDl, User} from './user.js';
import Error from './error.js';
const userList = document.getElementById('users');
const editUser = document.getElementById('edit-user');
const spinner = document.getElementById('spinner');
const hideSpinner = () => spinner.classList.add('hidden');
const showSpinner = () => spinner.classList.remove('hidden');
let arrUsers = [];
let error = new Error();

document.addEventListener('DOMContentLoaded', init());
window.addEventListener('hashchange', changePage);

function init() {
  showSpinner();
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((users) => generateUsers(users))
    .then(addAvatars)
    .then(changePage)
    .then(hideSpinner);
}

function changePage() {
  const id = Number(location.hash.replace(/#user([0-9]*)\/.*/, '$1'));
  const action = location.hash.replace(/#user[0-9]*\/(.*)/, '$1');
  if (id && action === 'edit') {
    userList.classList.add('hidden');
    editUser.classList.remove('hidden');
    showEditUserForm(id);
  } else if (id && action === 'save') {
    saveForm(id);
  } else if (id && action === 'delete') {
    deleteUser(id);
  } else {
    userList.classList.remove('hidden');
    editUser.classList.add('hidden');
  }
}

function generateUsers(users) {  
  userList.innerHTML = '<h2 class="page-title">Users</h2>';
  users.forEach((record) => {  
    let user = new User(record);
    arrUsers.push(user);
    userList.appendChild(user.toDiv());
  });
  // Example of static method distance(user1, user2);
  console.log("Distance from user 1 to user 2 = ", User.distance(arrUsers[0], arrUsers[1]),"m");
}


function addAvatars() {
  const users = document.getElementsByClassName('user');
  Array.prototype.forEach.call(users, (user) => addAvatar(user));
}

function addAvatar(elUser) {
  const elAvatar = document.createElement('div');
  elAvatar.classList.add('avatar');
  fetch('https://cataas.com/cat?type=sq', { cache: 'no-store' })
    .then((response) => response.blob())
    .then((image) => {
      const img = document.createElement('img');
      img.setAttribute('src', URL.createObjectURL(image));
      elAvatar.appendChild(img);
    })
    .catch((reason) => error.message(reason));
  elUser.insertBefore(elAvatar, elUser.firstChild);
}

function deleteUser(id) {
  const userIndex = arrUsers ? arrUsers.findIndex((el) => el.id === id) : '';
  console.log(userIndex, arrUsers[userIndex]);
  if (confirm(`Are you shure you want to delete user ${arrUsers[userIndex].name}?`)) {
    showSpinner();
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          arrUsers.splice(userIndex, 1);
          const user = document.getElementById(`user-${id}`);
          if (user) {
            user.parentNode.removeChild(user);
          }
        } else {
          console.log(`Somesing went wrong. Response.status: ${response.status}`);
        }
      })
      .then(hideSpinner)
      .catch((reason) => error.message(reason));
  }
  location.hash = '#users';
}

function showEditUserForm(id) {
  const user = arrUsers.find((el) => el.id === id);

  function toFields(el, prefix) {
    let html = '';
    for (let key in el) {
      if (typeof el[key] === 'object' && el[key] !== null) {
        html += `<fieldset><legend>${key}</legend>${toFields(el[key], prefix + key + '.')}</fieldset>`;
      } else if (key == 'id') {
        html += `<label class="form-label">${key} <input type="text" name="${prefix}${key}" readonly value="${el[key]}"></label>`;
      } else {
        html += `<label class="form-label">${key} <input type="text" name="${prefix}${key}" value="${el[key]}"></label>`;
      }
    }
    html += '</dl>';
    return html;
  }

  const editForm = document.createElement('form');
  editForm.classList.add('edit-user-form');
  editForm.setAttribute('id', 'edit-user-form');
  editForm.innerHTML = toFields(user, '');
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');
  const saveButton = document.createElement('a');
  saveButton.classList.add('btn');
  saveButton.innerHTML = 'Save';
  saveButton.setAttribute('href', `#user${user.id}/save`);
  const cancelButton = document.createElement('a');
  cancelButton.classList.add('btn');
  cancelButton.innerHTML = 'Cancel';
  cancelButton.setAttribute('href', `#users`);
  buttons.appendChild(saveButton);
  buttons.appendChild(cancelButton);
  editForm.appendChild(buttons);

  editUser.innerHTML = '';
  editUser.appendChild(editForm);
}

function saveForm(id) {
  showSpinner();
  const generateObj = (obj, arr, val) => {
    if (arr.length === 1) {
      obj[arr[0]] = val;
      return;
    }
    if (!obj[arr[0]]) {
      obj[arr[0]] = {};
    }
    const restArr = arr.splice(1);
    generateObj(obj[arr[0]], restArr, val);
  };

  const getData = (id) => {
    const form = document.getElementById(id);
    const inputCollection = form.getElementsByTagName('input');
    const inputArray = [...inputCollection];
    const data = {};
    inputArray.map((input) => {
      const { name, value } = input;
      const splitName = name.split('.');
      generateObj(data, splitName, value);
    });
    return data;
  };

  const data = getData('edit-user-form');

  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((user) => {
      let userIndex = arrUsers.findIndex((el) => el.id === user.id);
      arrUsers[userIndex] = user;
      const userInfoDL = document
        .getElementById(`user-${user.id}`)
        .getElementsByClassName('info')[0]
        .getElementsByTagName('dl')[0];
      if (userInfoDL) {
        userInfoDL.outerHTML = toDl(user);
      }
      console.log(user);
    })
    .then(hideSpinner)
    .catch((reason)=>error.message(reason));
  location.hash = '#users';
}
