"use strict";
// webPreferences: true sets up the require in the script js file electron version 5.0.0 and above
// mainWindow = new BrowserWindow({
//   webPreferences: {
//     nodeIntegration: true
//   }
// });   index.js
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");
const electron = require("electron");
const { ipcRenderer } = electron;
//select form
let storeItem = document.querySelector("#storeItem");
let price = document.querySelector("#price");
let taxBox = document.querySelector("#taxInput");
//Global variable's
// This is the Main array that holds all the year objects
const arrayOfYearObjs = [];
// create elements object
const el = new Elements();
// create display object
const display = new Display(el, $);
// create tax percent
let taxRate = 0.06;
// create year index
let yearIndex = -243;
// create month index
let monthIndex = -243;
// this is for the fontSize
let root = document.querySelector(":root");
// temp hold for array
let settingsArrayContainer;
//The start of program exicution.
window.onload = function() {
  addDateToForm();
  startUp();
};
// addDateToForm
function addDateToForm() {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  let date = new Date();

  document.querySelector("#date").value = date.toLocaleDateString();
}
//startUp
function startUp() {
  //get data from settings obect
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "momMoney") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);
    var x = document.querySelector("#autoLoad").checked;
    if (x === true) {
      if (settings.filePathArray) {
        autoLoadYearObjects(settings.filePathArray);
      }
    }
  }
  // set tax variable
  document.querySelector("#taxSpan").textContent = `${taxRate}%`;
}
//*************************************************** */
// Helper functions
//*************************************************** */
function mapOutKey(key, array) {
  const newArray = array.map(function(item) {
    return item[key];
  });
  return newArray;
}
function autoLoadYearObjects(array) {
  array.forEach(function(item) {
    readFileContents(item);
  });
}

function readFileContents(filepath) {
  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      let message = "An error occured reading the file.";
      let msgType = "error";
      display.showAlert(message, msgType);
      return;
    } else {
      try {
        data = JSON.parse(data);
      } catch {
        let message = "Can not parse data";
        let msgType = "error";
        display.showAlert(message, msgType);
        return;
      }

      if (data) {
        if (data.fileType === "ElectronMomMoney2019September") {
          // set filepath: This is in case you moved your file
          data.fileNamePath = filepath;

          // check if the fileNamePath already exists if it does alert and return
          // make a variable to return
          let isTaken = false;
          arrayOfYearObjs.forEach(element => {
            if (element.fileNamePath === data.fileNamePath) {
              isTaken = true;
            }
          });
          if (isTaken) {
            display.showAlert("That file is already loaded", "error");
            // redisplay
            // get the names for all the years
            // and then send them to the Display
            display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
            return;
          }
          // create a file cab object
          let newYearObject = new YearObject(
            data.name,
            data.fileNamePath,
            data.arrayOfMonthObjects
          );
          // push the file cab obj into the array of file cabinets
          arrayOfYearObjs.push(newYearObject);
          // write the file cab object to disk
          newYearObject.writeFileCabToHardDisk(fs);
          // redisplay
          // get the names for all the years
          // and then send them to the Display
          display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
          return;
        } else {
          let message = "This is not a valid ElectronFileCab2019April file";
          let msgType = "error";
          display.showAlert(message, msgType);
        }
      }
    }
  });
}
function loadUpSettingsForm() {
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "momMoney") {
    //set the tax rate text input
    document.querySelector("#taxRate").value = settings.taxRate;
    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        document.querySelector("#x-small").checked = true;
        break;
      case "small":
        document.querySelector("#small").checked = true;
        break;
      case "normal":
        document.querySelector("#normal").checked = true;
        break;
      case "large":
        document.querySelector("#large").checked = true;
        break;
      case "x-large":
        document.querySelector("#x-large").checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }

  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End

function applySettings(settings) {
  if (settings.autoLoad === true) {
    document.querySelector("#autoLoad").checked = true;
  }
  switch (settings.fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
} // End
//************************************************ */
// IPC
//************************************************ */

// listen for index.js to show settings form
ipcRenderer.on("SettingsForm:show", event => {
  loadUpSettingsForm();
  display.showSettingsForm();
});

// listen for inedex.js to send data
ipcRenderer.on("Display:showAlert", (event, dataObj) => {
  display.showAlert(dataObj.message, dataObj.msgType);
}); // End ipcRenderer.on("Display:showAlert"

// listen for inedex.js to send data
ipcRenderer.on("year:add", (event, dataObj) => {
  if (dataObj.name === "") {
    display.showAlert("You did not enter a name for the Year!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    display.showAlert("You clicked cancel", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach(element => {
    if (element.fileNamePath === dataObj.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    display.showAlert("That file is already loaded", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  let newYear = new YearObject(dataObj.name, dataObj.fileNamePath);
  // create the 12 months
  let January = new MonthObject("January");
  newYear.arrayOfMonthObjects.push(January);
  let February = new MonthObject("February");
  newYear.arrayOfMonthObjects.push(February);
  let March = new MonthObject("March");
  newYear.arrayOfMonthObjects.push(March);
  let April = new MonthObject("April");
  newYear.arrayOfMonthObjects.push(April);
  let May = new MonthObject("May");
  newYear.arrayOfMonthObjects.push(May);
  let June = new MonthObject("June");
  newYear.arrayOfMonthObjects.push(June);
  let July = new MonthObject("July");
  newYear.arrayOfMonthObjects.push(July);
  let August = new MonthObject("August");
  newYear.arrayOfMonthObjects.push(August);
  let September = new MonthObject("September");
  newYear.arrayOfMonthObjects.push(September);
  let October = new MonthObject("October");
  newYear.arrayOfMonthObjects.push(October);
  let November = new MonthObject("November");
  newYear.arrayOfMonthObjects.push(November);
  let December = new MonthObject("December");
  newYear.arrayOfMonthObjects.push(December);
  // push the year obj into the array of year objects
  arrayOfYearObjs.push(newYear);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);

  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
});
// End ipcRenderer.on("year:add"********************

// listen for index.js to change font size
ipcRenderer.on("FontSize:change", (event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
}); // End ipcRenderer.on("FontSize:change"

// listen for inedex.js to send data
ipcRenderer.on("yearObj:load", (event, data) => {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach(element => {
    if (element.fileNamePath === data.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    display.showAlert("That file is already loaded", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  let newYear = new YearObject(
    data.name,
    data.fileNamePath,
    data.arrayOfMonthObjects
  );
  // push the year obj into the array of year Objects
  arrayOfYearObjs.push(newYear);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);
  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});
//End ipcRenderer.on("year:load"*****************************
// ***********************************************************

//*************************************************** */

el.yearList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("year")) {
    // set's the current target active
    e.target.classList.add("active");
    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".year");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "year";
        }
        el[i].className = "year active";
      };
    }
  } // End code to set the active class

  // get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  yearIndex = index;

  // get the array of months and send it to display
  display.paintMonthTabs(
    mapOutKey("name", arrayOfYearObjs[yearIndex].arrayOfMonthObjects)
  );
}); // End el.yearList.addEventListener()

el.monthList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("month")) {
    // set's the current target active
    e.target.classList.add("active");
    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".month");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "month";
        }
        el[i].className = "month active";
      };
    }
  } // End code to set the active class

  // get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  monthIndex = index;

  // get the array of Transactions and send it to display
  display.paintTransactions(
    arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
      .arrayOfTransactions
  );
});

// transaction form
document.querySelector("#clear").addEventListener("click", e => {
  storeItem.value = "";
  price.value = "";
});

document.querySelector("#transactionBtn").addEventListener("click", e => {
  e.preventDefault();
  let date = document.querySelector("#date").value;
  let storeItem = document.querySelector("#storeItem").value;
  let price = document.querySelector("#price").value;
  price = Number(price);
  let newTransaction;
  if (taxBox.checked) {
    // create transaction with tax
    let tax = price * taxRate;
    newTransaction = new Transaction(date, storeItem, price, tax);
    taxBox.checked = false;
  } else {
    // create transaction without tax
    newTransaction = new Transaction(date, storeItem, price);
  }
  // push new transaction into array
  arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
    monthIndex
  ].arrayOfTransactions.push(newTransaction);
  // save to disk
  arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs);
  // get the array of Transactions and send it to display
  display.paintTransactions(
    arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
      .arrayOfTransactions
  );
});

document.querySelector("#transactionList").addEventListener("click", e => {
  console.log("ul clicked");
  // event delegation
  if (e.target.classList.contains("deleteTrans")) {
    // get the index from the html
    if (e.ctrlKey) {
      console.log("control key down");
      let Index = e.target.parentElement.parentElement.dataset.index;
      let deleteIndex = parseInt(Index);
      console.log(deleteIndex);
      // delete transaction
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
        monthIndex
      ].arrayOfTransactions.splice(deleteIndex, 1);
      // save to disk
      arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs);
      // get the array of Transactions and send it to display
      display.paintTransactions(
        arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
          .arrayOfTransactions
      );
    }
  }
});
