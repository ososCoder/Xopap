import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
  databaseURL: 'YOUR FIREBASE URL HERE', //FIXME
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListinDB = ref(database, 'shoppingList');

const form = document.getElementById('form');
const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener('click', (e) => {
  e.preventDefault();

  let inputValue = inputFieldEl.value;

  if (inputFieldEl.value !== '') {
    push(shoppingListinDB, inputValue);
  } else {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.textContent = 'Introduce un producto';
    form.append(alert);
    setTimeout(() => {
      alert.classList.remove;
      alert.classList.add('alert-off');
    }, 2000);
  }

  clearInputFieldEl();
});

onValue(shoppingListinDB, (snapshot) => {
  if (snapshot.exists()) {
    const itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (const item of itemsArray) {
      appendItemToShoppingListEl(item);
    }
  } else {
    shoppingListEl.innerHTML = `
    <div class="emptyCart">
        <img src='./assets/icons/empty-cart.png' class="empty-cart" loading="lazy" alt="Empty cart animated when there are no products to buy"/>
        <p>Nada que comprar aún...</p>
    </div>
    `;
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = '';
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = '';
}

function appendItemToShoppingListEl(item) {
  const itemID = item[0];
  const itemValue = item[1];

  const newEl = document.createElement('li');
  newEl.textContent = itemValue;

  newEl.addEventListener('click', () => {
    const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
