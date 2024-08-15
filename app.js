//*=============== AVAILABLE NUTRIENTS =============== */
const availableNutrients= [
  "nitrogen",
  "phosphorus",
  "potassium",
  "calcium",
  "magnesium",
  "sulfur",
  "iron",
  "manganese",
  "zinc",
  "copper",
  "boron",
  "molybdenum",
  "chlorine",
  "nickel",
];

//*=============== FERTILIZER DATA =============== */
import { products } from "./data.js";



//*=============== Select All Elements =============== */ 
/*====== Inputs =====*/
let productName = document.getElementById('product-name');
let nutrientName = document.getElementById('nutrient-name');
let percentage = document.getElementById('percentage');

/*====== Buttons =====*/
let selectElem = document.querySelector('.select');
let submitBtn = document.querySelector('.btn-add button');
let clearBtn = document.querySelector('.clear-btn');

/*====== Lists =====*/
let userLists = document.querySelector('.user-list');
let nutrientList = document.querySelector('ol.nutrients');
let store = JSON.parse(localStorage.getItem('store-data')) || [];

/*====== Miscellenious =====*/
let body = document.body;
let userDataElem = document.querySelector('.user-data');
let messageBox = document.querySelector('.message');
let alertSms = document.querySelector('.lert-message');
let overlay = document.querySelector('.overlay');
let diplayBox = document.querySelector('.display-box');
let hidePopup = document.querySelector('.cancel-box');
let displayName = document.querySelector('.display-name');


//*=============== Populate Option Fields =============== */

products.forEach(item => {
  let {name, id} = item;
  selectElem.innerHTML += `
  <option value="${name}" id="${id}">${name}</option>
  `
}) 



//*=============== Basic Settings =============== */
//
let floatingId;
selectElem.onclick= (e) => {
  productName.value = e.currentTarget.value;
  var selectedOption = selectElem.options[selectElem.selectedIndex];
  var optionId = selectedOption.id;
  floatingId = optionId;
}
//Replace numerals and special characters with empty strings
nutrientName.oninput = () => {
  nutrientName.value = nutrientName.value.replace(/[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g, "")
}
//Replace other characters with empty strings
percentage.oninput = () => {
  percentage.value = percentage.value.replace(/[^\w\s]|_/g, "")
}
//*=============== Handling Form Errors =============== */
//Product Name Error
function validateProductName() {
  if (!productName.value) {
    showMessage("Please fill all required field", "error-color");
    return false;
  }
  return true;
}

//Nutrient Name Error
function validateNutrientName() {
  let value = nutrientName.value.toLowerCase();
  if (!value) {
    showMessage("Please fill all required field", "error-color");
    return false;
  } else if (!availableNutrients.includes(value)) {
    showMessage("Check nutrient name spelling and try again", "error-color");
    return false;
  }
  return true;
}

//Percetage Error
function validatePercentage() {
  let value = percentage.value;
  if (!value) {
    showMessage("Please fill all required field", "error-color");
    return false;
  }
  return true;
}

//*=============== Submitting Form =============== */
submitBtn.addEventListener('click', function() {
  if(validateProductName() && validateNutrientName() && validatePercentage()) {
    //Generate user data
    generateUserData();
    //Reset user data
    checkStore();
    //Show message
    showMessage("Data generated successfully", "success-color");
    //Clear Inputs
    clearInputs();
    //update user data
    updateUserData();
  }
})


//*=============== Message Functions Here =============== */
//Show message
function showMessage(message, color) {
  messageBox.classList.add('show-message', color);
  messageBox.innerHTML = `<p>${message}</p>`;

  setTimeout(()=> {
    messageBox.classList.remove('show-message', color);
    messageBox.innerHTML = '';
  }, 2000)
}

function alertMessage(sms, color) {
  alertSms.classList.add('show-message', color);
  alertSms.innerHTML = `<p>${sms}</p>`;

  setTimeout(()=> {
    alertSms.classList.remove('show-message', color);
    alertSms.innerHTML = '';
  }, 1500)
}

//Generating user data
function generateUserData() {
  let productId = floatingId;
  let match = products.find(item => item.id === productId);

  if (match) {
    let search = store.find(elem => elem.id === productId);

    if (search) {
      if (search.nutrients.hasOwnProperty(nutrientName.value)) {
        search.nutrients[nutrientName.value] = percentage.value;
        alertMessage(`${nutrientName.value} percentage value changed successfully`, "success-color");
      } else {
        search.nutrients[nutrientName.value] = percentage.value;
      }
    } else {
      store.push(
        {
          ...match,
          nutrients: {
            [nutrientName.value] : percentage.value,
          }
        }
      )
    }
  }

  //Setting local storage
  localStorage.setItem('store-data', JSON.stringify(store));
}

//Clear inputs

function clearInputs() {
  productName.value = '';
  nutrientName.value = '';
  percentage.value = '';
}

//*=============== Updating User Data =============== */ 

function updateUserData() {
  //Reset the user list
  userLists.innerHTML = "";
  //Generate user list
  store.forEach(item => {
    let {name, id} = item;
    userLists.innerHTML += `
        <li class="list">
          <span>${name}</span>
          <div class="edit">
            <i id="${id}" class="bi bi-box-arrow-up-right"></i>
            <i id="${id}" class="bi bi-trash3"></i>
          </div>
        </li>
    `
  })
  
}

//*=============== Check The Store If Empty =============== */  
function checkStore() {
  if (store.length === 0) {
    userDataElem.classList.remove('reset');
  } else {
    userDataElem.classList.add('reset');
  }
}

//*=============== Clear Store =============== */

clearBtn.addEventListener('click', function() {
  showMessage("All data cleared successfully", "success-color");
  store = [];
  //Setting local storage
  localStorage.setItem('store-data', JSON.stringify(store));
  //Reset user data
  checkStore()
})

//*=============== Delete && Open Item =============== */

userLists.addEventListener('click', function(e) {
  let target = e.target;
  if (target.tagName === 'I') {
    let productId = target.getAttribute("id");

    if (target.classList.contains('bi-box-arrow-up-right')) {
      //Display box
      displayPopup(productId);
    } else {
      //Delete item
      deleteItem(productId);
    }
  }
})

//*=============== Delete Item Function =============== */
function deleteItem(id) {
  let itemId = id;
  store = store.filter(item => item.id !== id);
  //Setting local storage
  localStorage.setItem('store-data', JSON.stringify(store));
  //Update user data
  updateUserData();
  //Reset user data
  checkStore();

  showMessage(`One item successfully deleted`, "success-color");
}

//*=============== Open Item/ Display Box =============== */
function displayPopup(id) {
  let itemId = id;

  body.classList.add('active');

  let product = store.find(item => item.id == id );
  displayName.innerText = product.name;

  //Creat array of nutrients
  let nutrientArray = [];

  for (let n in product.nutrients) {
    let nKey = n;
    let nValue = product.nutrients[n];
    nutrientArray.push([nKey, nValue]);
  }
  //Reset the nutient list
  nutrientList.innerHTML = '';
  
  nutrientArray.forEach(item => {
    let [name, percentage] = item;
    nutrientList.innerHTML += `
      <li>
        <span>${name} <small>(${percentage}%)</small></span>
        <div class="edit">
          <i class="bi bi-pencil-square"></i>
          <i class="bi bi-trash3"></i>
        </div>
      </li>
    `
  });
  
}

//*=============== Hide Pop Up =============== */
function hideDisplay () {
  body.classList.remove('active');
}
overlay.onclick = hideDisplay;
hidePopup.onclick = hideDisplay;

//*=============== Functions To Call on Loading Document =============== */ 

updateUserData();
checkStore();



