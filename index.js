// javascript
/* 

DATABASE SETUP 

*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-24bc6-default-rtdb.europe-west1.firebasedatabase.app/",
};

//Initialize Firebase
const app = initializeApp(appSettings);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const endorsementsListInDB = ref(database, "endorsementsList");

//APP
const inputFieldEl = document.getElementById("input-field");
const publishBtnEl = document.getElementById("publish-btn");
const endorsementListEl = document.getElementById("endorsement-list");
const inputFieldFromPerson = document.getElementById("input-from");
const inputFieldToPerosn = document.getElementById("input-to");

publishBtnEl.addEventListener("click", function () {
  let newPublish = {
    fromPerson: inputFieldFromPerson.value,
    toPerosn: inputFieldToPerosn.value,
    message: inputFieldEl.value,
  };

  push(endorsementsListInDB, newPublish);

  clearInputFieldEl();
});

onValue(endorsementsListInDB, function (snapshot) {
  if (snapshot.exists()) {
    //convert data to object so i can get ID and Value
    const data = Object.entries(snapshot.val());
    console.log(data);
    clearEndorsementListEl();

    for (let i = 0; i < data.length; i++) {
      let currentItem = data[i];

      appendItemToEndorsementListEl(currentItem);
    }
  } else {
    endorsementListEl.innerHTML = "No endorsements here... yet";
  }
});

function appendItemToEndorsementListEl(item) {
  let itemID = item[0];
  let itemMessgae = item[1].message;
  let fromPerson = item[1].fromPerson;
  let toPerson = item[1].toPerosn;

  let newLiEl = document.createElement("li");
  let newPEl = document.createElement("p");
  let newFromEl = document.createElement("h3");
  let newToEl = document.createElement("h3");

  newPEl.textContent = itemMessgae;
  newFromEl.textContent = fromPerson;
  newToEl.textContent = toPerson;

  newLiEl.addEventListener("dblclick", function () {
    //get exact location of item in database via ID
    let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`);
    //remove item from database
    remove(exactLocationOfItemInDB);
  });

  newLiEl.append(newFromEl, newPEl, newToEl);

  endorsementListEl.append(newLiEl);
}

//CLear functions

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = "";
}
